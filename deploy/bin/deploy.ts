#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { WebAppStack } from "../lib/WebAppStack";

const app = new cdk.App();
new WebAppStack(app, "GcWebAppStack", {
  env: { account: "485563272586", region: "eu-west-1" },
});
