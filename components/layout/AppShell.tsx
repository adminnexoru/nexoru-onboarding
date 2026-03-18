import Header from "./Header";
import ProgressBar from "./ProgressBar";
import SidebarSummary from "./SidebarSummary";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <ProgressBar />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          <section>{children}</section>

          <div className="lg:block">
            <SidebarSummary />
          </div>
        </div>
      </main>
    </div>
  );
}