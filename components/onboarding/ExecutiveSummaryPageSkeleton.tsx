export default function ExecutiveSummaryPageSkeleton() {
  return (
    <div className="nx-page-card">
      <div className="mb-6 h-10 w-44 animate-pulse rounded-full bg-[rgba(255,255,255,0.08)]" />

      <div className="mb-8 h-20 w-full max-w-[760px] animate-pulse rounded-[24px] bg-[rgba(255,255,255,0.08)] sm:h-24 md:h-28" />

      <div className="mb-10 space-y-3">
        <div className="h-5 w-full max-w-[720px] animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
        <div className="h-5 w-full max-w-[620px] animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-6">
          <div className="mb-5 h-7 w-52 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
          <div className="grid gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-4"
              >
                <div className="h-5 w-full animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-6">
          <div className="mb-5 h-7 w-48 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
          <div className="grid gap-4">
            <div className="rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5">
              <div className="mb-2 h-4 w-40 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
              <div className="h-10 w-36 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
            </div>
            <div className="rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5">
              <div className="mb-2 h-4 w-44 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
              <div className="h-10 w-36 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-6">
        <div className="mb-5 h-7 w-48 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-4"
            >
              <div className="h-5 w-full animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8 rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-6">
        <div className="mb-5 h-7 w-56 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
        <div className="grid gap-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-4"
            >
              <div className="mb-2 h-5 w-2/3 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
              <div className="h-4 w-full animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[18px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5">
        <div className="mb-3 h-6 w-40 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
        <div className="space-y-3">
          <div className="h-5 w-full animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
          <div className="h-5 w-4/5 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
        </div>
      </div>
    </div>
  );
}