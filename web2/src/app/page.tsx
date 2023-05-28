import { LinkButton } from "./components/button/Button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center flex-col p-4">
      <div className="mt-24 flex flex-col items-center">
        <h1>Select source</h1>
        <div className="mt-8">
          <LinkButton href="/radio" variant="primary" className="mr-2">
            Radio
          </LinkButton>

          <LinkButton href="/ros" variant="primary">
            ROS
          </LinkButton>
        </div>
      </div>
    </main>
  );
}
