import { BadgeCheck, Circle, ShieldCheck, MailWarning } from "lucide-react";
import { formatMemberSince, formatDateTime } from "../../utils/helpers";
import { useLanguage } from "../../hooks/useLanguage";

export default function AccountInformation({ user }) {
  const { t } = useLanguage();
  const role = user?.role === "admin" ? "Admin" : "User";
  const active = (user?.accountStatus || "active") === "active";
  const verified = Boolean(user?.emailVerified);

  return (
    <section className="card p-6 sm:p-8">
      <h2 className="font-display font-bold text-lg text-text">{t("profile.accountSettings")}</h2>
      <p className="mt-1 text-sm text-text-muted">{t("profile.statusAndSecurity")}</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <InfoTile label={t("profile.accountType")} value={role} />
        <InfoTile
          label={t("profile.accountStatus")}
          value={
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                active ? "bg-primary-50 text-primary-hover" : "bg-danger-50 text-danger"
              }`}
            >
              <Circle className={`w-2 h-2 fill-current ${active ? "text-primary" : "text-danger"}`} />
              {active ? t("profile.active") : t("profile.suspended")}
            </span>
          }
        />
        <InfoTile
          label={t("profile.emailVerification")}
          value={
            verified ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-50 text-primary-hover">
                <BadgeCheck className="w-3.5 h-3.5" />
                {t("profile.verified")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-warning-50 text-amber-700">
                <MailWarning className="w-3.5 h-3.5" />
                {t("profile.notVerified")}
              </span>
            )
          }
        />
        <InfoTile label={t("profile.memberSince")} value={formatMemberSince(user?.createdAt)} />
        <InfoTile label={t("profile.lastLogin")} value={formatDateTime(user?.lastLogin)} />
      </div>

      {!verified && (
        <p className="mt-4 flex items-start gap-2 text-xs text-text-muted">
          <ShieldCheck className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary-hover" />
          Email verification status.
        </p>
      )}
    </section>
  );
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-xl border border-border bg-slate-50/70 px-4 py-3.5 min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">{label}</p>
      <div className="mt-1.5 text-sm font-semibold text-text">{value}</div>
    </div>
  );
}

