export default function VolumeOperationsPageSkeleton() {
  return (
    <div className="nx-page-card">
      <div className="mb-6 h-10 w-44 animate-pulse rounded-full bg-[rgba(255,255,255,0.08)]" />

      <div className="mb-8 h-20 w-full max-w-[720px] animate-pulse rounded-[24px] bg-[rgba(255,255,255,0.08)] sm:h-24 md:h-28" />

      <div className="mb-10 space-y-3">
        <div className="h-5 w-full max-w-[700px] animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
        <div className="h-5 w-full max-w-[540px] animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <div className="mb-3 h-5 w-48 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
            <div className="mb-3 h-5 w-full max-w-[320px] animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
            <div
              className={`${
                index === 5 ? "h-[140px]" : "h-14"
              } w-full animate-pulse rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.04)]`}
            />
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-14 w-full animate-pulse rounded-[18px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] sm:w-[120px]" />
        <div className="h-14 w-full animate-pulse rounded-[18px] bg-[rgba(124,58,237,0.35)] sm:w-[180px]" />
      </div>
    </div>
  );
}