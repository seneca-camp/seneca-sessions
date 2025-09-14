import logo from "~/assets/logo.png";

export function Logo({ className = "w-32 md:w-48" }: { className?: string }) {
  return <img src={logo} alt="Seneca Logo" className={className} />;
}
