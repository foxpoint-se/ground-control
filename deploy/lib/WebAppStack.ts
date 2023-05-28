import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

const domainName = "foxpoint.se";
const siteSubDomain = "app";
const name = "GcWebApp";

const handlerString = `
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  
  // Check whether the URI is missing a file name.
  if (uri.endsWith('/')) {
    request.uri += 'index.html';
  } 
  // Check whether the URI is missing a file extension.
  else if (!uri.includes('.')) {
    request.uri += '/index.html';
  }
  
  return request;
}
`;

export class WebAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const zone = cdk.aws_route53.HostedZone.fromLookup(this, "Zone", {
      domainName,
    });
    const siteDomain = siteSubDomain + "." + domainName;
    const cloudfrontOAI = new cdk.aws_cloudfront.OriginAccessIdentity(
      this,
      "cloudfront-OAI",
      {
        comment: `OAI for ${name}`,
      }
    );

    new cdk.CfnOutput(this, "Site", { value: "https://" + siteDomain });

    // Content bucket
    const siteBucket = new cdk.aws_s3.Bucket(this, name + "Bucket", {
      bucketName: siteDomain,
      publicReadAccess: false,
      blockPublicAccess: cdk.aws_s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Grant access to cloudfront
    siteBucket.addToResourcePolicy(
      new cdk.aws_iam.PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [siteBucket.arnForObjects("*")],
        principals: [
          new cdk.aws_iam.CanonicalUserPrincipal(
            cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );

    new cdk.CfnOutput(this, "Bucket", { value: siteBucket.bucketName });

    // TLS certificate
    const certificate = new cdk.aws_certificatemanager.DnsValidatedCertificate(
      this,
      "SiteCertificate",
      {
        domainName: siteDomain,
        hostedZone: zone,
        region: "us-east-1", // Cloudfront only checks this region for certificates.
      }
    );
    new cdk.CfnOutput(this, "Certificate", {
      value: certificate.certificateArn,
    });

    const cfFunction = new cdk.aws_cloudfront.Function(this, "Function", {
      code: cdk.aws_cloudfront.FunctionCode.fromInline(handlerString),
    });

    // CloudFront distribution
    const distribution = new cdk.aws_cloudfront.Distribution(
      this,
      "SiteDistribution",
      {
        certificate: certificate,
        defaultRootObject: "index.html",
        domainNames: [siteDomain],
        minimumProtocolVersion:
          cdk.aws_cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 404,
            responsePagePath: "/404.html",
            ttl: cdk.Duration.minutes(30),
          },
        ],
        defaultBehavior: {
          origin: new cdk.aws_cloudfront_origins.S3Origin(siteBucket, {
            originAccessIdentity: cloudfrontOAI,
          }),
          compress: true,
          allowedMethods:
            cdk.aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          viewerProtocolPolicy:
            cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          functionAssociations: [
            {
              eventType: cdk.aws_cloudfront.FunctionEventType.VIEWER_REQUEST,
              function: cfFunction,
            },
          ],
        },
      }
    );

    new cdk.CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
    });

    // Route53 alias record for the CloudFront distribution
    new cdk.aws_route53.ARecord(this, "SiteAliasRecord", {
      recordName: siteDomain,
      target: cdk.aws_route53.RecordTarget.fromAlias(
        new cdk.aws_route53_targets.CloudFrontTarget(distribution)
      ),
      zone,
    });

    // Deploy site contents to S3 bucket
    new cdk.aws_s3_deployment.BucketDeployment(this, "DeployWithInvalidation", {
      sources: [cdk.aws_s3_deployment.Source.asset("../web2/out")],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}
