import { useState } from "react";
import {
  Lock,
  Bell,
  Globe,
  Shield,
  ChevronRight,
  X,
} from "lucide-react";
import Button from "../common/Button";
import { LANGUAGES } from "../../utils/constants";
import { useLanguage } from "../../hooks/useLanguage";

const NOTIFY_KEY = "medibridge_notification_prefs";
const PRIVACY_KEY = "medibridge_privacy_prefs";

const DEFAULT_NOTIFY = {
  orderUpdates: true,
  medicineReminders: true,
  pharmacyAlerts: false,
};

const DEFAULT_PRIVACY = {
  shareLocation: true,
  personalizedSuggestions: true,
};

function loadPrefs(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

export default function AccountSettings({ onChangePassword }) {
  const { language, setLanguage } = useLanguage();
  const [panel, setPanel] = useState(null);
  const [notify, setNotify] = useState(() => loadPrefs(NOTIFY_KEY, DEFAULT_NOTIFY));
  const [privacy, setPrivacy] = useState(() => loadPrefs(PRIVACY_KEY, DEFAULT_PRIVACY));

  function toggleNotify(key) {
    setNotify((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(NOTIFY_KEY, JSON.stringify(next));
      return next;
    });
  }

  function togglePrivacy(key) {
    setPrivacy((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(PRIVACY_KEY, JSON.stringify(next));
      return next;
    });
  }

  const rows = [
    {
      id: "password",
      icon: Lock,
      title: "Change Password",
      description: "Update the password used to sign in.",
      onClick: onChangePassword,
    },
    {
      id: "notifications",
      icon: Bell,
      title: "Notification Preferences",
      description: "Choose which alerts you want to receive.",
      onClick: () => setPanel((p) => (p === "notifications" ? null : "notifications")),
    },
    {
      id: "language",
      icon: Globe,
      title: "Language Preference",
      description: language.label,
      onClick: () => setPanel((p) => (p === "language" ? null : "language")),
    },
    {
      id: "privacy",
      icon: Shield,
      title: "Privacy Settings",
      description: "Control how MediBridge uses your data.",
      onClick: () => setPanel((p) => (p === "privacy" ? null : "privacy")),
    },
  ];

  return (
    <section className="card p-6 sm:p-8">
      <h2 className="font-display font-bold text-lg text-text">Account Settings</h2>
      <p className="mt-1 text-sm text-text-muted">Manage security, alerts, language, and privacy.</p>

      <div className="mt-5 divide-y divide-border">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <div key={row.id}>
              <button
                type="button"
                onClick={row.onClick}
                className="w-full flex items-center gap-3 py-3.5 text-left hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-colors"
              >
                <span className="grid place-items-center w-10 h-10 rounded-xl bg-primary-50 text-primary-hover shrink-0">
                  <Icon className="w-4 h-4" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-text">{row.title}</span>
                  <span className="block text-xs text-text-muted mt-0.5 truncate">{row.description}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
              </button>

              {panel === row.id && row.id === "notifications" && (
                <div className="pb-4 pl-14 space-y-2">
                  <Toggle
                    label="Order updates"
                    checked={notify.orderUpdates}
                    onChange={() => toggleNotify("orderUpdates")}
                  />
                  <Toggle
                    label="Medicine reminders"
                    checked={notify.medicineReminders}
                    onChange={() => toggleNotify("medicineReminders")}
                  />
                  <Toggle
                    label="Nearby pharmacy alerts"
                    checked={notify.pharmacyAlerts}
                    onChange={() => toggleNotify("pharmacyAlerts")}
                  />
                </div>
              )}

              {panel === row.id && row.id === "language" && (
                <div className="pb-4 pl-14 flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setLanguage(lang)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        lang.code === language.code
                          ? "bg-primary text-white"
                          : "bg-slate-100 text-text-muted hover:bg-slate-200"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}

              {panel === row.id && row.id === "privacy" && (
                <div className="pb-4 pl-14 space-y-2">
                  <Toggle
                    label="Use location for nearby pharmacies"
                    checked={privacy.shareLocation}
                    onChange={() => togglePrivacy("shareLocation")}
                  />
                  <Toggle
                    label="Personalized medicine suggestions"
                    checked={privacy.personalizedSuggestions}
                    onChange={() => togglePrivacy("personalizedSuggestions")}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm text-text">
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative w-10 h-6 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </button>
    </label>
  );
}

export function ChangePasswordModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess("Password updated successfully.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Could not update password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center px-4" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-slate-900/40" aria-label="Close" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative w-full max-w-md card p-6 sm:p-7 space-y-4">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-text-muted hover:bg-slate-100"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
        <h3 className="font-display font-bold text-lg text-text pr-8">Change Password</h3>

        {error && <div className="rounded-lg bg-danger-50 text-danger text-sm px-3.5 py-2.5">{error}</div>}
        {success && <div className="rounded-lg bg-primary-50 text-primary-hover text-sm px-3.5 py-2.5">{success}</div>}

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Current password</label>
          <input
            type="password"
            name="currentPassword"
            required
            autoComplete="current-password"
            value={form.currentPassword}
            onChange={handleChange}
            className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">New password</label>
          <input
            type="password"
            name="newPassword"
            required
            minLength={6}
            autoComplete="new-password"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Confirm new password</label>
          <input
            type="password"
            name="confirmPassword"
            required
            minLength={6}
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
