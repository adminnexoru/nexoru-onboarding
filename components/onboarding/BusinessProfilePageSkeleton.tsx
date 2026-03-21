export default function BusinessProfilePageSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-4 h-8 w-44 rounded-full bg-gray-200" />
      <div className="mb-4 h-12 w-3/4 rounded bg-gray-200 md:h-16" />

      <div className="mb-8 space-y-3">
        <div className="h-5 w-full rounded bg-gray-200" />
        <div className="h-5 w-2/3 rounded bg-gray-200" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index}>
            <div className="mb-2 h-5 w-40 rounded bg-gray-200" />
            <div className="h-12 w-full rounded-xl bg-gray-200" />
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-12 w-28 rounded-xl bg-gray-200" />
        <div className="h-12 w-36 rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}