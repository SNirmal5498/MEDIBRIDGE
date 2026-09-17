import { X } from "lucide-react";
import Button from "../common/Button";
import { useLanguage } from "../../hooks/useLanguage";

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  confirmVariant = "danger",
  loading = false,
  onConfirm,
  onClose,
}) {
  const { t } = useLanguage();

  if (!open) return null;

  const actualConfirmLabel = confirmLabel || t("profile.confirm");
  const actualCancelLabel = cancelLabel || t("profile.cancel");

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40"
        aria-label={t("profile.close")}
        onClick={onClose}
      />
      <div className="relative w-full max-w-md card p-6 sm:p-7">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-text-muted hover:bg-slate-100"
          aria-label={t("profile.close")}
        >
          <X className="w-4 h-4" />
        </button>
        <h3 id="confirm-modal-title" className="font-display font-bold text-lg text-text pr-8">
          {title}
        </h3>
        <p className="mt-2 text-sm text-text-muted leading-relaxed">{description}</p>
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose} disabled={loading}>
            {actualCancelLabel}
          </Button>
          <Button
            type="button"
            variant={confirmVariant}
            size="sm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? t("profile.pleaseWait") : actualConfirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

