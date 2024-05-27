import NextLogo from "../NextLogo";
import SupabaseLogo from "../SupabaseLogo";

export default function Footer() {
  return (
    <footer className="w-full max-w-4xl border-t border-t-foreground/10 p-4 flex justify-evenly text-center text-xs">
      <div className="flex flex-col justify-center">
        <p className="font-bold text-xl">
          <span className="text-gray-400">Kip</span>
          <span className="text-green-500">Trak</span> Cloud
        </p>
        <p>
          Powered by{" "}
          <a
            href="https://intechgration.io/"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            in<span className="text-gray-400">tech</span>gration
          </a>
        </p>
      </div>
      <div className="flex gap-4 justify-center items-center">
        <a
          href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
          target="_blank"
          rel="noreferrer"
        >
          <SupabaseLogo />
        </a>
        <span className="border-l rotate-45 h-6" />
        <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
          <NextLogo />
        </a>
      </div>
    </footer>
  );
}
