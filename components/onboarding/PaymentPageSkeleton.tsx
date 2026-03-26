export default function PaymentPageSkeleton() {
  return (
    <div className="rounded-[28px] border border-[#E5E7EB] bg-white px-5 py-7 shadow-sm sm:rounded-[32px] sm:px-8 sm:py-9 md:px-12 md:py-12">
      <div className="mb-6 h-10 w-40 animate-pulse rounded-full bg-[#E5E7EB]" />

      <div className="mb-8 h-20 w-full max-w-[760px] animate-pulse rounded-[20px] bg-[#E5E7EB] sm:h-24 md:h-28" />

      <div className="mb-10 space-y-3">
        <div className="h-5 w-full max-w-[700px] animate-pulse rounded bg-[#E5E7EB]" />
        <div className="h-5 w-full max-w-[560px] animate-pulse rounded bg-[#E5E7EB]" />
      </div>

      <div className="mb-8 rounded-[24px] border border-[#E5E7EB] bg-[#F8FAFC] p-6 sm:p-8">
        <div className="mb-3 h-5 w-40 animate-pulse rounded bg-[#E5E7EB]" />
        <div className="mb-6 h-10 w-full max-w-[420px] animate-pulse rounded bg-[#E5E7EB]" />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <div className="mb-2 h-4 w-28 animate-pulse rounded bg-[#E5E7EB]" />
            <div className="h-9 w-32 animate-pulse rounded bg-[#E5E7EB]" />
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <div className="mb-2 h-4 w-36 animate-pulse rounded bg-[#E5E7EB]" />
            <div className="h-9 w-32 animate-pulse rounded bg-[#E5E7EB]" />
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-[24px] border border-[#E5E7EB] bg-white p-6 sm:p-8">
        <div className="mb-5 h-7 w-56 animate-pulse rounded bg-[#E5E7EB]" />

        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="mb-2 h-5 w-2/3 animate-pulse rounded bg-[#E5E7EB]" />
                  <div className="h-4 w-full animate-pulse rounded bg-[#E5E7EB]" />
                </div>

                <div className="w-full max-w-[180px] space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-[#E5E7EB]" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-[#E5E7EB]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-[24px] border border-[#D9E3F0] bg-[#F8FAFC] p-6 sm:p-8">
          <div className="mb-2 h-4 w-44 animate-pulse rounded bg-[#E5E7EB]" />
          <div className="h-10 w-36 animate-pulse rounded bg-[#E5E7EB]" />
        </div>

        <div className="rounded-[24px] border border-[#D9E3F0] bg-[#F8FAFC] p-6 sm:p-8">
          <div className="mb-2 h-4 w-52 animate-pulse rounded bg-[#E5E7EB]" />
          <div className="h-10 w-36 animate-pulse rounded bg-[#E5E7EB]" />
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-[24px] border border-[#D9E3F0] bg-[#F8FAFC] p-6 sm:p-8">
          <div className="mb-2 h-4 w-36 animate-pulse rounded bg-[#E5E7EB]" />
          <div className="mb-3 h-12 w-40 animate-pulse rounded bg-[#E5E7EB]" />
          <div className="h-4 w-full animate-pulse rounded bg-[#E5E7EB]" />
        </div>

        <div className="rounded-[24px] border border-[#D9E3F0] bg-[#F8FAFC] p-6 sm:p-8">
          <div className="mb-2 h-4 w-40 animate-pulse rounded bg-[#E5E7EB]" />
          <div className="mb-3 h-12 w-40 animate-pulse rounded bg-[#E5E7EB]" />
          <div className="h-4 w-full animate-pulse rounded bg-[#E5E7EB]" />
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-14 w-full animate-pulse rounded-2xl bg-[#E5E7EB] sm:w-[120px]" />
        <div className="h-14 w-full animate-pulse rounded-2xl bg-[#E5E7EB] sm:w-[220px]" />
      </div>
    </div>
  );
}