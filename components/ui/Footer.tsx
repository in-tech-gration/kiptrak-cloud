export default function Footer() {
  return (
    <footer className="w-full border-t border-t-foreground/10 p-8 flex flex-col justify-center text-center text-xs">
      <p>KipTrack Cloud</p>
      <p>
        Powered by{" "}
        <a
          href="https://intechgration.io/"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          intechgration
        </a>
      </p>
    </footer>
  );
}
