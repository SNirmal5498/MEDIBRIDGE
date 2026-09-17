import { LogOut, Trash2 } from "lucide-react";
import Button from "../common/Button";
import { useLanguage } from "../../hooks/useLanguage";

export default function DangerZone({ onLogout, onDelete }) {
  const { t } = useLanguage();

  return (
    <section className="rounded-2xl border border-danger/20 bg-danger-50/40 p-6 sm:p-8">
      <h2 className="font-display font-bold text-lg text-text">{t("profile.accountSection")}</h2>
      <p className="mt-1 text-sm text-text-muted">
        {t("profile.accountSectionDesc")}
      </p>

      <div className="mt-5 flex flex-col sm:flex-row gap-2">
        <Button type="button" variant="secondary" size="sm" icon={LogOut} onClick={onLogout}>
          {t("profile.logout")}
        </Button>
        <Button type="button" variant="danger" size="sm" icon={Trash2} onClick={onDelete}>
          {t("profile.deleteAccount")}
        </Button>
      </div>
    </section>
  );
}

