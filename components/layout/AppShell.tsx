import Header from "./Header";
import ProgressBar from "./ProgressBar";
import SidebarSummary from "./SidebarSummary";

type AppShellProps = {
  children: React.ReactNode;
  step?: number;
  totalSteps?: number;
  progress?: number;
  summary?: {
    businessName?: string;
    industry?: string;
    goal?: string;
    packageName?: string;
  };
};

export default function AppShell({
  children,
  step = 1,
  totalSteps = 5,
  progress = 10,
  summary,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <ProgressBar
            step={step}
            totalSteps={totalSteps}
            progress={progress}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          <section>{children}</section>

          <div>
            <SidebarSummary
              businessName={summary?.businessName}
              industry={summary?.industry}
              goal={summary?.goal}
              packageName={summary?.packageName}
            />
          </div>
        </div>
      </main>
    </div>
  );
}