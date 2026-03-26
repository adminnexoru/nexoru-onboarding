export default function ScheduleSessionPageSkeleton() {
  return (
    <div className="rounded-[28px] border border-[#E5E7EB] bg-white px-5 py-7 shadow-sm sm:rounded-[32px] sm:px-8 sm:py-9 md:px-12 md:py-12">
      <div className="mb-6 h-9 w-48 animate-pulse rounded-full bg-[#E5E7EB]" />
      <div className="mb-8 h-16 w-full max-w-[620px] animate-pulse rounded-[18px] bg-[#E5E7EB]" />
      <div className="mb-10 h-8 w-full max-w-[760px] animate-pulse rounded-[12px] bg-[#E5E7EB]" />

      <div className="mb-8 rounded-[24px] border border-[#E5E7EB] bg-[#F8FAFC] p-5 sm:p-6">
        <div className="mb-4 h-5 w-40 animate-pulse rounded bg-[#E5E7EB]" />
        <div className="h-14 w-full max-w-[220px] animate-pulse rounded-2xl bg-[#E5E7EB]" />
      </div>

      <div className="mb-8">
        <div className="mb-4 h-5 w-48 animate-pulse rounded bg-[#E5E7EB]" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded-2xl bg-[#E5E7EB]"
            />
          ))}
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-14 w-full animate-pulse rounded-2xl bg-[#E5E7EB] sm:w-[120px]" />
        <div className="h-14 w-full animate-pulse rounded-2xl bg-[#E5E7EB] sm:w-[220px]" />
      </div>
    </div>
  );
}