import { ReactNode } from "react";
import Link from "next/link";
import { NavBar } from "./components/NavBar";

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
          <Link href={href} className="btn btn-primary">
            {actionLabel}
          </Link>
        </div>
      </div>
    </div>
  );
};

const Picker = () => {
  return (
    <nav className="flex flex-col sm:flex-row space-y-md sm:space-y-0 sm:space-x-md flex-wrap gap-4 justify-center">
      <Card
        title="ROS Bridge"
        description="ROS topics over websockets. If you're running Ålen and a ROS bridge on your own network, this is the one."
        actionLabel="Go to ROS Bridge"
        href="/ros-bridge"
      />
      <Card
        title="IoT"
        description="MQTT topics over websockets. If you want to access Ålen remotely over internet."
        actionLabel="Go to IoT"
        href="/iot"
      />
      <Card
        title="Map Test 1"
        description="Interactive map using React-Leaflet for visualization and testing."
        actionLabel="Go to Map Test 1"
        href="/map-test-1"
      />
      <Card
        title="Map Test 2"
        description="Performance-optimized map implementation using vanilla Leaflet."
        actionLabel="Go to Map Test 2"
        href="/map-test-2"
      />
    </nav>
  );
};

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar menuItems={[]} />
      <div className="max-w-screen-2xl px-sm mx-auto w-full grow">
        <main className="py-xl">
          <div id="box" className="flex flex-col items-center space-y-xl">
            <Title className="text-5xl font-bold">Ground control</Title>
            <Picker />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
