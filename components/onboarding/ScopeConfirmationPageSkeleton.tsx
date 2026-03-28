export default function ScopeConfirmationPageSkeleton() {
  return (
    <div className="nx-page-card">
      <div className="mb-6 h-10 w-52 animate-pulse rounded-full bg-[rgba(255,255,255,0.08)]" />

      <div className="mb-8 h-20 w-full max-w-[760px] animate-pulse rounded-[24px] bg-[rgba(255,255,255,0.08)] sm:h-24 md:h-28" />

      <div className="mb-10 space-y-3">
        <div className="h-5 w-full max-w-[740px] animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
        <div className="h-5 w-full max-w-[660px] animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-6">
          <div className="mb-5 h-7 w-28 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
          <div className="grid gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-5 py-4"
              >
                <div className="h-5 w-full animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-[rgba(249,115,22,0.18)] bg-[rgba(249,115,22,0.06)] p-6">
          <div className="mb-5 h-7 w-36 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
          <div className="grid gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[rgba(249,115,22,0.18)] bg-[rgba(255,255,255,0.04)] px-5 py-4"
              >
                <div className="h-5 w-full animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-6">
        <div className="mb-5 h-7 w-52 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />

        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-4"
            >
              <div className="mb-3 h-5 w-2/3 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
              <div className="h-4 w-1/2 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8 rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-6">
        <div className="flex gap-3">
          <div className="mt-1 h-[18px] w-[18px] animate-pulse rounded bg-[rgba(255,255,255,0.08)]" />
          <div className="flex-1 space-y-3">
            <div className="h-5 w-full animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
            <div className="h-5 w-full animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
            <div className="h-5 w-4/5 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-14 w-full animate-pulse rounded-[18px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] sm:w-[120px]" />
        <div className="h-14 w-full animate-pulse rounded-[18px] bg-[rgba(124,58,237,0.35)] sm:w-[180px]" />
      </div>
    </div>
  );
}