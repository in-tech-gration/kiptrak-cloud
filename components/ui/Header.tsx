import AuthButton from "@/components/AuthButton";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-6xl flex justify-between items-center py-3 text-sm">
        <Link href="/" className="font-bold text-lg hover:border hover:rounded hover:border-green-400 p-3">
          <span className="text-gray-400">Kip</span>
          <span className="text-green-500">Trak</span> Cloud
        </Link>
        <AuthButton />
      </div>
    </nav>
  );
}
