import { LinkButton } from "./components/button/Button";

export default function Home() {
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
          <LinkButton href="/mqtt" variant="primary" className="mr-2">
            MQTT
          </LinkButton>
        </div>
      </div>
    </main>
  );
}
