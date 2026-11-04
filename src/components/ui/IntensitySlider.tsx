"use client";

export function IntensitySlider({
  label,
  value,
  onChange,
  min = 1,
  max = 10,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="label mb-0">{label}</label>
        <span className="rounded-full bg-[color-mix(in_oklab,var(--sage)_20%,transparent)] px-2.5 py-0.5 text-sm font-medium text-[var(--forest)]">
          {value}/{max}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--sage-deep)]"
        aria-label={label}
      />
    </div>
  );
}
