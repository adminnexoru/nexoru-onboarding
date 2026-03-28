export default function StartPageSkeleton() {
  return (
    <div className="nx-page-card">
      <div className="mb-6 h-10 w-44 animate-pulse rounded-full bg-[rgba(255,255,255,0.08)]" />

      <div className="mb-8 h-20 w-full max-w-[760px] animate-pulse rounded-[24px] bg-[rgba(255,255,255,0.08)] sm:h-24 md:h-28" />

      <div className="mb-10 space-y-3">
        <div className="h-6 w-full max-w-[720px] animate-pulse rounded-[12px] bg-[rgba(255,255,255,0.08)]" />
        <div className="h-6 w-full max-w-[620px] animate-pulse rounded-[12px] bg-[rgba(255,255,255,0.08)]" />
      </div>

      <div className="mb-8 rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5 sm:p-6">
        <div className="h-6 w-56 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="h-14 w-full animate-pulse rounded-[18px] bg-[rgba(124,58,237,0.35)] sm:max-w-[220px]" />
      </div>
    </div>
  );
}