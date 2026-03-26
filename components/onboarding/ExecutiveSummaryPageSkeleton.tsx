export default function ExecutiveSummaryPageSkeleton() {
  return (
    <div className="rounded-[28px] border border-[#E5E7EB] bg-white px-5 py-7 shadow-sm sm:rounded-[32px] sm:px-8 sm:py-9 md:px-12 md:py-12">
      <div className="mb-6 h-10 w-44 animate-pulse rounded-full bg-[#E5E7EB]" />

      <div className="mb-8 h-20 w-full max-w-[760px] animate-pulse rounded-[20px] bg-[#E5E7EB] sm:h-24 md:h-28" />

      <div className="mb-10 space-y-3">
        <div className="h-5 w-full max-w-[720px] animate-pulse rounded bg-[#E5E7EB]" />
        <div className="h-5 w-full max-w-[620px] animate-pulse rounded bg-[#E5E7EB]" />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-[24px] border border-[#E5E7EB] bg-[#F8F9FC] p-6">
          <div className="mb-5 h-7 w-52 animate-pulse rounded bg-[#E5E7EB]" />
          <div className="grid gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[14px] border border-[#E5E7EB] bg-white px-4 py-4"
              >
                <div className="h-5 w-full animate-pulse rounded bg-[#E5E7EB]" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-6">
          <div className="mb-5 h-7 w-48 animate-pulse rounded bg-[#E5E7EB]" />
          <div className="grid gap-4">
            <div className="rounded-[16px] border border-[#E5E7EB] bg-[#F8F9FC] p-5">
              <div className="mb-2 h-4 w-40 animate-pulse rounded bg-[#E5E7EB]" />
              <div className="h-10 w-36 animate-pulse rounded bg-[#E5E7EB]" />
            </div>
            <div className="rounded-[16px] border border-[#E5E7EB] bg-[#F8F9FC] p-5">
              <div className="mb-2 h-4 w-44 animate-pulse rounded bg-[#E5E7EB]" />
              <div className="h-10 w-36 animate-pulse rounded bg-[#E5E7EB]" />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-[24px] border border-[#E5E7EB] bg-white p-6">
        <div className="mb-5 h-7 w-48 animate-pulse rounded bg-[#E5E7EB]" />
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[14px] border border-[#E5E7EB] bg-[#F8F9FC] px-4 py-4"
            >
              <div className="h-5 w-full animate-pulse rounded bg-[#E5E7EB]" />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8 rounded-[24px] border border-[#E5E7EB] bg-white p-6">
        <div className="mb-5 h-7 w-56 animate-pulse rounded bg-[#E5E7EB]" />
        <div className="grid gap-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[14px] border border-[#E5E7EB] bg-[#F8F9FC] px-4 py-4"
            >
              <div className="mb-2 h-5 w-2/3 animate-pulse rounded bg-[#E5E7EB]" />
              <div className="h-4 w-full animate-pulse rounded bg-[#E5E7EB]" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[18px] border border-[#E5E7EB] bg-[#F8F9FC] p-5">
        <div className="mb-3 h-6 w-40 animate-pulse rounded bg-[#E5E7EB]" />
        <div className="space-y-3">
          <div className="h-5 w-full animate-pulse rounded bg-[#E5E7EB]" />
          <div className="h-5 w-4/5 animate-pulse rounded bg-[#E5E7EB]" />
        </div>
      </div>
    </div>
  );
}