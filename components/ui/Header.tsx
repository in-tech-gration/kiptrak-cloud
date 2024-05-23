import DeployButton from "@/components/DeployButton";
import AuthButton from "@/components/AuthButton";

export default function Header() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
        <DeployButton />
        <AuthButton />
      </div>
    </nav>
  );
}
