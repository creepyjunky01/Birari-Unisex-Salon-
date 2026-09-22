import PageTransitionProvider from "@/components/PageTransitionProvider";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <PageTransitionProvider>{children}</PageTransitionProvider>;
}
