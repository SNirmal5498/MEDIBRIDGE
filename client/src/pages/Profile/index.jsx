import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../hooks/useLanguage";
import Button from "../../components/common/Button";
import ProfileHeader from "../../components/profile/ProfileHeader";
import PersonalInformation from "../../components/profile/PersonalInformation";
import AccountInformation from "../../components/profile/AccountInformation";
import RecentOrders from "../../components/profile/RecentOrders";
import SavedMedicines from "../../components/profile/SavedMedicines";
import SavedPharmacies from "../../components/profile/SavedPharmacies";
import AccountSettings, { ChangePasswordModal } from "../../components/profile/AccountSettings";
import DangerZone from "../../components/profile/DangerZone";
import ConfirmModal from "../../components/profile/ConfirmModal";
import { getFavoriteMedicines, toggleFavorite } from "../../utils/medicineData";
import {
  getSavedPharmacies,
  getSavedPharmacyIds,
  setSavedPharmacyIds,
} from "../../utils/pharmacyData";

export default function Profile() {
  const { user, loading, isAuthenticated, logout, updateProfile, changePassword, deleteAccount } =
    useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const personalRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);

  useEffect(() => {
    setMedicines(getFavoriteMedicines());
    setPharmacies(getSavedPharmacies());
  }, []);

  function startEdit() {
    setEditing(true);
    personalRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleSaveProfile(form) {
    await updateProfile(form);
    setEditing(false);
  }

  function handleRemoveMedicine(id) {
    toggleFavorite(id);
    setMedicines(getFavoriteMedicines());
  }

  function handleRemovePharmacy(id) {
    const current = getSavedPharmacyIds() ?? [];
    const next = current.filter((x) => x !== id);
    setSavedPharmacyIds(next);
    setPharmacies(getSavedPharmacies());
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  async function handleDeleteAccount() {
    setDeleteError("");
    setDeleting(true);
    try {
      await deleteAccount();
      setDeleteOpen(false);
      navigate("/");
    } catch (err) {
      setDeleteError(err.response?.data?.message || t("common.error"));
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 card h-72 animate-pulse bg-slate-100" />
          <div className="lg:col-span-3 card h-72 animate-pulse bg-slate-100" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-16">
        <div className="card p-8 text-center">
          <div className="mx-auto grid place-items-center w-14 h-14 rounded-2xl bg-primary-50 text-primary-hover mb-4">
            <User className="w-6 h-6" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-text">{t("profile.title")}</h1>
          <p className="mt-2 text-sm text-text-muted">
            {t("auth.loginSubtitle")}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
            <Button as={Link} to="/login" variant="primary" size="sm">
              {t("nav.login")}
            </Button>
            <Button as={Link} to="/register" variant="secondary" size="sm">
              {t("nav.register")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-text">{t("profile.title")}</h1>
        <p className="mt-1.5 text-text-muted">{t("profile.personalInfo")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2">
          <ProfileHeader user={user} onEdit={startEdit} />
        </div>
        <div className="lg:col-span-3" ref={personalRef}>
          <PersonalInformation
            user={user}
            editing={editing}
            onStartEdit={startEdit}
            onCancelEdit={() => setEditing(false)}
            onSave={handleSaveProfile}
          />
        </div>
      </div>

      <div className="mt-5">
        <AccountInformation user={user} />
      </div>

      <div className="mt-10">
        <RecentOrders />
      </div>

      <div className="mt-10">
        <SavedMedicines medicines={medicines} onRemove={handleRemoveMedicine} />
      </div>

      <div className="mt-10">
        <SavedPharmacies pharmacies={pharmacies} onRemove={handleRemovePharmacy} />
      </div>

      <div className="mt-10">
        <AccountSettings onChangePassword={() => setPasswordOpen(true)} />
      </div>

      <div className="mt-10">
        <DangerZone onLogout={handleLogout} onDelete={() => setDeleteOpen(true)} />
      </div>

      <ChangePasswordModal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        onSubmit={changePassword}
      />

      <ConfirmModal
        open={deleteOpen}
        title={t("profile.deleteAccount")}
        description={
          deleteError
            ? deleteError
            : t("profile.deleteAccount")
        }
        confirmLabel={t("profile.deleteAccount")}
        loading={deleting}
        onConfirm={handleDeleteAccount}
        onClose={() => {
          if (!deleting) setDeleteOpen(false);
        }}
      />
    </div>
  );
}
