import { useState } from "react";
import { AlertTriangle, Upload, CheckCircle2, FileText, Loader2 } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import api from "../../services/api";

export default function PrescriptionWarning({ onPrescriptionUploaded }) {
  const { t } = useLanguage();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(selected.type)) {
      setError("Invalid file type. Only JPEG, PNG, WEBP, and PDF files are allowed.");
      return;
    }

    setError("");
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("prescription", file);

      const response = await api.post("/prescriptions/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.success) {
        setUploaded(true);
        if (onPrescriptionUploaded) {
          onPrescriptionUploaded(response.data.prescription);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Prescription upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card p-6 bg-amber-50/60 border-amber-200">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-amber-900 mb-1">{t("checkout.prescriptionRequiredTitle")}</h3>
          <p className="text-sm text-amber-800">
            {t("checkout.prescriptionRequiredDesc")}
          </p>

          {!uploaded ? (
            <div className="mt-4 pt-3 border-t border-amber-200/80">
              <label className="block text-xs font-bold text-amber-900 mb-2">
                Upload Doctor's Prescription (JPEG, PNG, or PDF, max 5MB)
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleFileChange}
                  className="text-xs text-text file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200"
                />

                {file && (
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    {uploading ? "Uploading..." : "Upload Prescription"}
                  </button>
                )}
              </div>

              {error && <p className="text-xs text-danger font-semibold mt-2">{error}</p>}
            </div>
          ) : (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Prescription Attached Successfully (Pending Verification)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
