export default function ScheduleConfirmationPageSkeleton() {
  return (
    <div className="nx-page-card">
      <div className="mb-6 h-10 w-44 animate-pulse rounded-full bg-[rgba(255,255,255,0.08)]" />

      <div className="mb-8 h-20 w-full max-w-[760px] animate-pulse rounded-[24px] bg-[rgba(255,255,255,0.08)] sm:h-24 md:h-28" />

      <div className="mb-10 space-y-3">
        <div className="h-5 w-full max-w-[720px] animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
        <div className="h-5 w-full max-w-[620px] animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
      </div>

      <div className="mb-8 rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5 sm:p-8">
        <div className="mb-3 h-5 w-40 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
        <div className="h-9 w-full max-w-[340px] animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5 sm:p-6">
          <div className="mb-2 h-4 w-16 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
          <div className="h-6 w-3/4 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
        </div>

        <div className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5 sm:p-6">
          <div className="mb-2 h-4 w-20 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
          <div className="h-6 w-1/2 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
        </div>
      </div>

      <div className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5 sm:p-8">
        <div className="mb-4 h-7 w-72 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
        <div className="mb-6 h-5 w-full max-w-[640px] animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />

        <div className="flex flex-col items-center rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-5 py-6">
          <div className="h-[220px] w-[220px] animate-pulse rounded-2xl bg-[rgba(255,255,255,0.08)]" />
          <div className="mt-4 h-4 w-64 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
          <div className="mt-5 h-12 w-52 animate-pulse rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.04)]" />
        </div>
      </div>
    </div>
  );
}