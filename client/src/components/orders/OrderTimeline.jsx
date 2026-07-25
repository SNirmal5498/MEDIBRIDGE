import { PackageCheck, PackageOpen, Truck, CheckCircle2 } from "lucide-react";
import { ORDER_STATUSES } from "../../utils/orderData";

const ICONS = { PackageCheck, PackageOpen, Truck, CheckCircle2 };

export default function OrderTimeline({ order }) {
  const steps = ORDER_STATUSES.map((status) => ({
    ...status,
    step: order.timeline.find((t) => t.status === status.key),
  }));

  const completedCount = steps.filter((s) => s.step.done).length;
  const progress = steps.length > 1 ? (completedCount - 1) / (steps.length - 1) : 0;

  return (
    <div>
      {/* Desktop/tablet: circles + line, narrower centered container = tighter spacing */}
      <div className="hidden sm:block max-w-xl mx-auto">
        <div className="relative">
          {/* Background track — pinned exactly between first and last circle centers (circles are w-9 = 2.25rem, half = 1.125rem = left-4.5/right-4.5) */}
          <div className="absolute top-[18px] left-[18px] right-[18px] h-0.5 bg-slate-200" />
          {/* Progress track */}
          <div
            className="absolute top-[18px] left-[18px] h-0.5 bg-primary transition-all duration-500"
            style={{ width: `calc(${progress} * (100% - 36px))` }}
          />

          <div className="relative flex items-center justify-between">
            {steps.map(({ key, icon, step }) => {
              const Icon = ICONS[icon];
              return (
                <div
                  key={key}
                  className={`grid place-items-center w-9 h-9 rounded-full shrink-0 border-4 border-white ${
                    step.done ? "bg-primary text-white" : "bg-slate-100 text-text-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Labels */}
        <div className="grid grid-cols-4 mt-3">
          {steps.map(({ key, label, step }) => (
            <div key={key} className="text-center px-1">
              <p className={`text-sm font-semibold ${step.done ? "text-text" : "text-text-muted"}`}>
                {label}
              </p>
              <p className="text-xs text-text-muted mt-0.5">{step.timestamp || "Pending"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: stacked vertical timeline */}
      <div className="sm:hidden">
        {steps.map(({ key, label, icon, step }, i) => {
          const Icon = ICONS[icon];
          const isLast = i === steps.length - 1;

          return (
            <div key={key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`grid place-items-center w-9 h-9 rounded-full shrink-0 ${
                    step.done ? "bg-primary text-white" : "bg-slate-100 text-text-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {!isLast && (
                  <div className={`w-0.5 flex-1 min-h-6 ${step.done ? "bg-primary" : "bg-slate-200"}`} />
                )}
              </div>
              <div className="pb-5">
                <p className={`text-sm font-semibold ${step.done ? "text-text" : "text-text-muted"}`}>
                  {label}
                </p>
                <p className="text-xs text-text-muted mt-0.5">{step.timestamp || "Pending"}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}