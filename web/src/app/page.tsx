import { ReactNode } from "react";
import { LinkButton } from "./components/button/Button";

const Title = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <h1
      className={`${className} text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%`}
    >
      {children}
    </h1>
  );
};

const Card = ({
  title,
  description,
  actionLabel,
  href,
}: {
  title: string;
  description: string;
  actionLabel: string;
  href: string;
}) => {
  return (
    <div className="card w-96 h-64 bg-neutral-100 shadow-md">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
        <div className="card-actions justify-end">
          <a href={href} className="btn btn-primary">
            {actionLabel}
          </a>
        </div>
      </div>
    </div>
  );
};

const Picker = () => {
  return (
    <nav className="flex flex-col sm:flex-row space-y-md sm:space-y-0 sm:space-x-md">
      <Card
        title="ROS Bridge"
        description="ROS topics over websockets. If your running Ålen and a ROS bridge on your own network, this is the one."
        actionLabel="Go to ROS Bridge"
        href="/ros-bridge"
      />
      <Card
        title="IoT"
        description="MQTT topics over websockets. If you want to access Ålen remotely over internet."
        actionLabel="Go to IoT"
        href="/iot"
      />
    </nav>
  );
};

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-screen-2xl px-sm mx-auto w-full grow">
        <main className="py-xl">
          <div id="box" className="flex flex-col items-center space-y-xl">
            <Title className="text-5xl font-bold">Ground control</Title>
            <Picker />
            <img
              src="/images/foxpoint_logo_full.svg"
              className="h-4"
              alt="Foxpoint logo"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;

function Home() {
  return (
    <main className="flex min-h-screen items-center flex-col p-4">
      <div className="mt-24 flex flex-col items-center">
        <h1>Select source</h1>
        <div className="mt-8">
          <LinkButton href="/local" variant="primary" className="mr-2">
            Localhost
          </LinkButton>
          <LinkButton href="/lan" variant="primary" className="mr-2">
            LAN
          </LinkButton>
          <LinkButton href="/vpn" variant="primary" className="mr-2">
            VPN
          </LinkButton>
          <LinkButton
            href="/ws-over-ethernet"
            variant="primary"
            className="mr-2"
          >
            WS over ethernet
          </LinkButton>
          <LinkButton href="/openvpn" variant="primary" className="mr-2">
            OpenVPN
          </LinkButton>
          <LinkButton href="/iot" variant="primary" className="mr-2">
            IoT
          </LinkButton>
        </div>
      </div>
    </main>
  );
}
