import { AlertTriangle } from "lucide-react";

export default function PrescriptionWarning() {
  return (
    <div className="card p-6 bg-danger-50 border-danger">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-danger mb-1">Prescription Required</h3>
          <p className="text-sm text-danger/80">
            This medicine requires a valid prescription and cannot be ordered directly through MediBridge.
          </p>
        </div>
      </div>
    </div>
  );
}
