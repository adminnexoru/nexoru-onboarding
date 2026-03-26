export default function PackageRecommendationPageSkeleton() {
  return (
    <div className="rounded-[28px] border border-[#E5E7EB] bg-white px-5 py-7 shadow-sm sm:rounded-[32px] sm:px-8 sm:py-9 md:px-12 md:py-12">
      <div className="mb-6 h-10 w-52 animate-pulse rounded-full bg-[#E5E7EB]" />

      <div className="mb-8 h-20 w-full max-w-[760px] animate-pulse rounded-[20px] bg-[#E5E7EB] sm:h-24 md:h-28" />

      <div className="mb-10 space-y-3">
        <div className="h-5 w-full max-w-[720px] animate-pulse rounded bg-[#E5E7EB]" />
        <div className="h-5 w-full max-w-[620px] animate-pulse rounded bg-[#E5E7EB]" />
      </div>

      <div className="mb-8 rounded-[28px] border border-[#E5E7EB] bg-[#F8FAFC] p-6 sm:p-8">
        <div className="mb-3 h-5 w-36 animate-pulse rounded bg-[#E5E7EB]" />
        <div className="mb-8 h-10 w-full max-w-[420px] animate-pulse rounded bg-[#E5E7EB]" />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
            <div className="mb-3 h-5 w-28 animate-pulse rounded bg-[#E5E7EB]" />
            <div className="h-9 w-32 animate-pulse rounded bg-[#E5E7EB]" />
          </div>

          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
            <div className="mb-3 h-5 w-36 animate-pulse rounded bg-[#E5E7EB]" />
            <div className="h-9 w-32 animate-pulse rounded bg-[#E5E7EB]" />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-5 h-8 w-64 animate-pulse rounded bg-[#E5E7EB]" />

        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-3xl border border-[#E5E7EB] bg-white px-6 py-5"
            >
              <div className="space-y-3">
                <div className="h-5 w-full animate-pulse rounded bg-[#E5E7EB]" />
                <div className="h-5 w-11/12 animate-pulse rounded bg-[#E5E7EB]" />
                <div className="h-5 w-4/5 animate-pulse rounded bg-[#E5E7EB]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8 rounded-[28px] border border-[#FDE68A] bg-[#FFF8E7] p-6 sm:p-8">
        <div className="mb-3 h-5 w-52 animate-pulse rounded bg-[#E5E7EB]" />
        <div className="space-y-3">
          <div className="h-5 w-full animate-pulse rounded bg-[#E5E7EB]" />
          <div className="h-5 w-full animate-pulse rounded bg-[#E5E7EB]" />
          <div className="h-5 w-11/12 animate-pulse rounded bg-[#E5E7EB]" />
          <div className="h-5 w-4/5 animate-pulse rounded bg-[#E5E7EB]" />
        </div>
      </div>

      <div className="mb-8 rounded-[24px] border border-[#E5E7EB] bg-[#F8FAFC] px-6 py-5">
        <div className="space-y-3">
          <div className="h-5 w-full animate-pulse rounded bg-[#E5E7EB]" />
          <div className="h-5 w-4/5 animate-pulse rounded bg-[#E5E7EB]" />
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-14 w-full animate-pulse rounded-2xl bg-[#E5E7EB] sm:w-[120px]" />
        <div className="h-14 w-full animate-pulse rounded-2xl bg-[#E5E7EB] sm:w-[180px]" />
      </div>
    </div>
  );
}
