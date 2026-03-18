type ProgressBarProps = {
  step?: number;
  totalSteps?: number;
  progress?: number;
};

export default function ProgressBar({
  step = 1,
  totalSteps = 5,
  progress = 10,
}: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-sm text-[#4A4F57]">
        <span>
          Paso {step} de {totalSteps}
        </span>
        <span>{progress}%</span>
      </div>

      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-[#3A3D91] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}