export default function CurrentProcessPageSkeleton() {
  return (
    <div className="rounded-[28px] border border-[#E5E7EB] bg-white px-5 py-7 shadow-sm sm:rounded-[32px] sm:px-8 sm:py-9 md:px-12 md:py-12">
      <div className="mb-6 h-10 w-40 animate-pulse rounded-full bg-[#E5E7EB]" />
      <div className="mb-8 h-20 w-full max-w-[720px] animate-pulse rounded-[20px] bg-[#E5E7EB] sm:h-24 md:h-28" />
      <div className="mb-10 space-y-3">
        <div className="h-5 w-full max-w-[700px] animate-pulse rounded bg-[#E5E7EB]" />
        <div className="h-5 w-full max-w-[540px] animate-pulse rounded bg-[#E5E7EB]" />
      </div>

      <div className="grid gap-y-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index}>
            <div className="mb-3 h-5 w-64 animate-pulse rounded bg-[#E5E7EB]" />
            <div className="mb-3 h-5 w-full max-w-[560px] animate-pulse rounded bg-[#E5E7EB]" />
            <div className="h-[140px] w-full animate-pulse rounded-2xl bg-[#E5E7EB]" />
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-14 w-full animate-pulse rounded-2xl bg-[#E5E7EB] sm:w-[120px]" />
        <div className="h-14 w-full animate-pulse rounded-2xl bg-[#E5E7EB] sm:w-[180px]" />
      </div>
    </div>
  );
}