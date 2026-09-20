import Link from "next/link";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-ink px-6 text-center">
      <Logo size={64} />
      <h1 className="mt-6 font-display text-2xl font-bold text-cream">Page Not Found</h1>
      <p className="mt-2 max-w-xs text-sm text-white/50">
        The page you&apos;re looking for doesn&apos;t exist or the booking link has expired.
      </p>
      <Link href="/" className="btn-primary mt-8 max-w-xs">
        Back to Home
      </Link>
    </main>
  );
}
