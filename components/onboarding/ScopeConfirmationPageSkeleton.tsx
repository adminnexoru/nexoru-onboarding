export default function ScopeConfirmationPageSkeleton() {
  return (
    <div className="rounded-[28px] border border-[#E5E7EB] bg-white px-5 py-7 shadow-sm sm:rounded-[32px] sm:px-8 sm:py-9 md:px-12 md:py-12">
      <div className="mb-6 h-10 w-52 animate-pulse rounded-full bg-[#E5E7EB]" />

      <div className="mb-8 h-20 w-full max-w-[760px] animate-pulse rounded-[20px] bg-[#E5E7EB] sm:h-24 md:h-28" />

      <div className="mb-10 space-y-3">
        <div className="h-5 w-full max-w-[740px] animate-pulse rounded bg-[#E5E7EB]" />
        <div className="h-5 w-full max-w-[660px] animate-pulse rounded bg-[#E5E7EB]" />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-[24px] border border-[#E5E7EB] bg-[#F8FAFC] p-6">
          <div className="mb-5 h-7 w-28 animate-pulse rounded bg-[#E5E7EB]" />
          <div className="grid gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-4"
              >
                <div className="h-5 w-full animate-pulse rounded bg-[#E5E7EB]" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-[#F3D4C2] bg-[#FFF8F5] p-6">
          <div className="mb-5 h-7 w-36 animate-pulse rounded bg-[#E5E7EB]" />
          <div className="grid gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[#F3D4C2] bg-white px-5 py-4"
              >
                <div className="h-5 w-full animate-pulse rounded bg-[#E5E7EB]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-[24px] border border-[#E5E7EB] bg-white p-6">
        <div className="mb-5 h-7 w-52 animate-pulse rounded bg-[#E5E7EB]" />

        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[20px] border border-[#D1D5DB] bg-white px-4 py-4"
            >
              <div className="mb-3 h-5 w-2/3 animate-pulse rounded bg-[#E5E7EB]" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-[#E5E7EB]" />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8 rounded-[24px] border border-[#E5E7EB] bg-[#F8FAFC] p-6">
        <div className="flex gap-3">
          <div className="mt-1 h-[18px] w-[18px] animate-pulse rounded bg-[#E5E7EB]" />
          <div className="flex-1 space-y-3">
            <div className="h-5 w-full animate-pulse rounded bg-[#E5E7EB]" />
            <div className="h-5 w-full animate-pulse rounded bg-[#E5E7EB]" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-[#E5E7EB]" />
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-14 w-full animate-pulse rounded-2xl bg-[#E5E7EB] sm:w-[120px]" />
        <div className="h-14 w-full animate-pulse rounded-2xl bg-[#E5E7EB] sm:w-[180px]" />
      </div>
    </div>
  );
}