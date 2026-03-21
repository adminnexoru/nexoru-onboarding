export default function PrimaryGoalPageSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-4 h-8 w-40 rounded-full bg-gray-200" />
      <div className="mb-4 h-12 w-3/4 rounded bg-gray-200 md:h-16" />

      <div className="mb-8 space-y-3">
        <div className="h-5 w-full rounded bg-gray-200" />
        <div className="h-5 w-5/6 rounded bg-gray-200" />
      </div>

      <div className="mb-4 h-6 w-48 rounded bg-gray-200" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-gray-200 bg-white px-5 py-5"
          >
            <div className="mb-3 h-5 w-3/4 rounded bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-11/12 rounded bg-gray-200" />
              <div className="h-4 w-4/5 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 mb-4 h-6 w-64 rounded bg-gray-200" />

      <div className="mb-8 flex flex-wrap gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-10 w-28 rounded-full bg-gray-200" />
        ))}
      </div>

      <div className="mb-8 rounded-2xl bg-[#F7F8FC] p-5 md:p-6">
        <div className="mb-3 h-6 w-44 rounded bg-gray-200" />
        <div className="mb-2 h-5 w-2/3 rounded bg-gray-200" />
        <div className="h-5 w-1/2 rounded bg-gray-200" />
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-12 w-28 rounded-xl bg-gray-200" />
        <div className="h-12 w-36 rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}