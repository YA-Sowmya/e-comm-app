import Navbar from "@/components/Navbar";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-accent min-h-screen">
      <Navbar />
      <main className="flex flex-col bg-accent w-full">{children}</main>
    </div>
  );
}
