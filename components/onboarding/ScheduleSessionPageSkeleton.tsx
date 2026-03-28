export default function ScheduleSessionPageSkeleton() {
  return (
    <div className="nx-page-card">
      <div className="mb-6 h-9 w-48 animate-pulse rounded-full bg-[rgba(255,255,255,0.08)]" />
      <div className="mb-8 h-16 w-full max-w-[620px] animate-pulse rounded-[18px] bg-[rgba(255,255,255,0.08)]" />
      <div className="mb-10 h-8 w-full max-w-[760px] animate-pulse rounded-[12px] bg-[rgba(255,255,255,0.08)]" />

      <div className="mb-8 rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5 sm:p-6">
        <div className="mb-4 h-5 w-40 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
        <div className="h-14 w-full max-w-[220px] animate-pulse rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.04)]" />
      </div>

      <div className="mb-8">
        <div className="mb-4 h-5 w-48 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.04)]"
            />
          ))}
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-14 w-full animate-pulse rounded-[18px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] sm:w-[120px]" />
        <div className="h-14 w-full animate-pulse rounded-[18px] bg-[rgba(124,58,237,0.35)] sm:w-[220px]" />
      </div>
    </div>
  );
}