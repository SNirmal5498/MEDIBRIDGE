import { Calendar, Pencil } from "lucide-react";
import Button from "../common/Button";
import { formatMemberSince } from "../../utils/helpers";
import { useLanguage } from "../../hooks/useLanguage";

export default function ProfileHeader({ user, onEdit }) {
  const { t } = useLanguage();
  const initial = user?.name?.[0]?.toUpperCase() ?? "U";
  const role = (user?.role || "user").toUpperCase();

  return (
    <section className="card p-6 sm:p-8 h-full">
      <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
        {user?.profilePicture ? (
          <img
            src={user.profilePicture}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-primary-50"
          />
        ) : (
          <div className="grid place-items-center w-24 h-24 rounded-full bg-primary-100 text-primary-hover font-display font-extrabold text-3xl">
            {initial}
          </div>
        )}

        <h1 className="mt-4 font-display font-extrabold text-2xl text-text">{user?.name || "User"}</h1>
        <a
          href={`mailto:${user?.email || ""}`}
          className="mt-1 text-sm text-text-muted hover:text-primary-hover break-all"
        >
          {user?.email || "—"}
        </a>

        <span className="mt-3 inline-flex text-[11px] font-semibold uppercase tracking-wide text-primary-hover bg-primary-50 px-2.5 py-1 rounded-full">
          {role}
        </span>

        <p className="mt-3 flex items-center gap-1.5 text-sm text-text-muted">
          <Calendar className="w-4 h-4 shrink-0" />
          {t("profile.memberSince")} {formatMemberSince(user?.createdAt)}
        </p>

        <Button variant="primary" size="sm" icon={Pencil} className="mt-5 w-full sm:w-auto" onClick={onEdit}>
          {t("profile.editProfile")}
        </Button>
      </div>
    </section>
  );
}

