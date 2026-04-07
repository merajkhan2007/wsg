import { SellerSidebar } from '@/components/layout/SellerSidebar';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-slate-50 font-sans text-gray-700">
      <SellerSidebar />
      <main className="flex-1 p-8 relative z-0">
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-brand-teal/5 to-transparent -z-10 blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
