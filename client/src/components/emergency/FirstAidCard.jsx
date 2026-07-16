import { useState } from "react";
import { Cross, ChevronDown } from "lucide-react";
import Button from "../common/Button";

export default function FirstAidCard({ guide }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card card-hover p-5 flex flex-col">
      <div className="flex items-start gap-3">
        <div className="grid place-items-center w-10 h-10 rounded-xl bg-primary-50 text-primary-hover shrink-0">
          <Cross className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display font-bold text-text">{guide.title}</h3>
          <p className="mt-1 text-sm text-text-muted leading-snug">{guide.description}</p>
        </div>
      </div>

      {open && (
        <ul className="mt-4 space-y-1.5 pl-1">
          {guide.steps.map((step, i) => (
            <li key={i} className="flex gap-2 text-sm text-text">
              <span className="text-primary-hover font-semibold shrink-0">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ul>
      )}

      <Button
        variant="secondary"
        size="sm"
        icon={ChevronDown}
        className={`w-full mt-4 !mt-auto pt-2 transition-transform ${open ? "[&_svg]:rotate-180" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Show Less" : "Read More"}
      </Button>
    </div>
  );
}