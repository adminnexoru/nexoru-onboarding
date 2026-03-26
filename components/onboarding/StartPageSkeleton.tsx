export default function StartPageSkeleton() {
  return (
    <div className="rounded-[28px] border border-[#E5E7EB] bg-white px-5 py-7 shadow-sm sm:rounded-[32px] sm:px-8 sm:py-9 md:px-12 md:py-12">
      <div className="mb-6 h-10 w-40 animate-pulse rounded-full bg-[#E5E7EB]" />

      <div className="mb-8 h-20 w-full max-w-[760px] animate-pulse rounded-[20px] bg-[#E5E7EB] sm:h-24 md:h-28" />

      <div className="mb-10 space-y-3">
        <div className="h-6 w-full max-w-[720px] animate-pulse rounded-[12px] bg-[#E5E7EB]" />
        <div className="h-6 w-full max-w-[620px] animate-pulse rounded-[12px] bg-[#E5E7EB]" />
      </div>

      <div className="mb-8 rounded-[20px] border border-[#E5E7EB] bg-[#F8FAFC] p-5 sm:p-6">
        <div className="h-6 w-56 animate-pulse rounded-[10px] bg-[#E5E7EB]" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="h-14 w-full animate-pulse rounded-2xl bg-[#E5E7EB] sm:max-w-[220px]" />
      </div>
    </div>
  );
}