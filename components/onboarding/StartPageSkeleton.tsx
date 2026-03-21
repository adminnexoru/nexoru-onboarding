export default function StartPageSkeleton() {
  return (
    <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-8 shadow-sm md:p-10">
      <div className="mb-5 h-9 w-40 animate-pulse rounded-full bg-[#E5E7EB]" />

      <div className="mb-4 h-14 w-full max-w-[720px] animate-pulse rounded-[16px] bg-[#E5E7EB]" />
      <div className="mb-8 h-8 w-full max-w-[620px] animate-pulse rounded-[12px] bg-[#E5E7EB]" />

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="h-14 w-full max-w-[260px] animate-pulse rounded-[16px] bg-[#E5E7EB]" />
        <div className="h-14 w-full max-w-[180px] animate-pulse rounded-[16px] bg-[#E5E7EB]" />
      </div>
    </div>
  );
}