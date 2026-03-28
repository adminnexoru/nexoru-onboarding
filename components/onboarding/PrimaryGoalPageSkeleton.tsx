export default function PrimaryGoalPageSkeleton() {
  return (
    <div className="nx-page-card">
      <div className="mb-6 h-10 w-44 animate-pulse rounded-full bg-[rgba(255,255,255,0.08)]" />

      <div className="mb-8 h-20 w-full max-w-[720px] animate-pulse rounded-[24px] bg-[rgba(255,255,255,0.08)] sm:h-24 md:h-28" />

      <div className="mb-10 space-y-3">
        <div className="h-5 w-full max-w-[700px] animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
        <div className="h-5 w-full max-w-[580px] animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
      </div>

      <div className="mb-4 h-5 w-40 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-6"
          >
            <div className="mb-3 h-6 w-3/4 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
              <div className="h-4 w-11/12 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
              <div className="h-4 w-4/5 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-6">
        <div className="mb-4 h-5 w-36 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
        <div className="mb-3 h-5 w-3/4 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
        <div className="h-5 w-2/3 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
      </div>

      <div className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-14 w-full animate-pulse rounded-[18px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] sm:w-[120px]" />
        <div className="h-14 w-full animate-pulse rounded-[18px] bg-[rgba(124,58,237,0.35)] sm:w-[180px]" />
      </div>
    </div>
  );
}