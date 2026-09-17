import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import Button from "../common/Button";
import { useLanguage } from "../../hooks/useLanguage";

export default function PersonalInformation({ user, editing, onStartEdit, onCancelEdit, onSave }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    location: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const GENDER_OPTIONS = [
    { value: "", label: t("profile.preferNotToSay") },
    { value: "male", label: t("profile.male") },
    { value: "female", label: t("profile.female") },
    { value: "other", label: t("profile.other") },
    { value: "prefer_not_to_say", label: t("profile.preferNotToSay") },
  ];

  function displayValue(value) {
    return value ? value : t("profile.notProvided");
  }

  function genderLabel(value) {
    return GENDER_OPTIONS.find((o) => o.value === value)?.label || (value ? value : t("profile.notProvided"));
  }

  useEffect(() => {
    setForm({
      name: user?.name || "",
      phone: user?.phone || "",
      dateOfBirth: user?.dateOfBirth || "",
      gender: user?.gender || "",
      location: user?.location || "",
    });
  }, [user, editing]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSave(form);
    } catch (err) {
      setError(err.response?.data?.message || t("common.error"));
    } finally {
      setSaving(false);
    }
  }

  const fields = [
    { label: t("profile.name"), value: displayValue(user?.name) },
    { label: t("profile.email"), value: displayValue(user?.email) },
    { label: t("profile.phone"), value: displayValue(user?.phone) },
    { label: t("profile.dob"), value: displayValue(user?.dateOfBirth) },
    { label: t("profile.gender"), value: genderLabel(user?.gender) },
    { label: t("profile.location"), value: displayValue(user?.location) },
  ];

  return (
    <section className="card p-6 sm:p-8 h-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-lg text-text">{t("profile.personalInfo")}</h2>
          <p className="mt-1 text-sm text-text-muted">{t("profile.contactDemoDetails")}</p>
        </div>
        {!editing && (
          <Button variant="secondary" size="sm" icon={Pencil} onClick={onStartEdit}>
            {t("profile.editProfile")}
          </Button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-danger-50 text-danger text-sm px-3.5 py-2.5">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">{t("profile.name")}</label>
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary bg-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">{t("profile.email")}</label>
            <input
              value={user?.email || ""}
              disabled
              className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm bg-slate-50 text-text-muted"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">{t("profile.phone")}</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary bg-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">{t("profile.dob")}</label>
              <input
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange}
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary bg-transparent"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">{t("profile.gender")}</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary bg-white"
              >
                {GENDER_OPTIONS.map((opt) => (
                  <option key={opt.value || "empty"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">{t("profile.location")}</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="City, State"
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary bg-transparent"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={onCancelEdit} disabled={saving}>
              {t("profile.cancel")}
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={saving}>
              {saving ? t("profile.saving") : t("profile.saveChanges")}
            </Button>
          </div>
        </form>
      ) : (
        <dl className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-4">
          {fields.map((field) => (
            <div key={field.label} className="min-w-0">
              <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">{field.label}</dt>
              <dd className="mt-1 text-sm font-medium text-text break-words">{field.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}

