import { useState, useEffect, useRef } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
  Building2,
  ShieldAlert,
  Loader2,
  FileCheck,
} from "lucide-react";
import { pharmacyService } from "../../services/pharmacyService";
import { prescriptionService } from "../../services/prescriptionService";
import Button from "../common/Button";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function PrescriptionUploadModal({
  isOpen,
  onClose,
  medicine,
  onSuccess,
}) {
  const [pharmacies, setPharmacies] = useState([]);
  const [pharmaciesLoading, setPharmaciesLoading] = useState(true);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [customerNotes, setCustomerNotes] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  const fileInputRef = useRef(null);

  // Load eligible partner pharmacies when modal opens
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    async function loadEligiblePharmacies() {
      setPharmaciesLoading(true);
      try {
        const res = await pharmacyService.getPharmacies();
        const list = res?.pharmacies || res?.data || [];
        // Filter only eligible partner pharmacies: approved & active
        const eligible = list.filter((p) => {
          const isApproved = !p.approvalStatus || p.approvalStatus === "approved";
          const isActive = p.isActive !== false;
          return isApproved && isActive;
        });

        if (isMounted) {
          setPharmacies(eligible);
          if (eligible.length > 0 && !selectedPharmacyId) {
            setSelectedPharmacyId(eligible[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load partner pharmacies:", err);
      } finally {
        if (isMounted) setPharmaciesLoading(false);
      }
    }

    loadEligiblePharmacies();
    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedPharmacyId]);

  // Clean up object URL preview on unmount or file change
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  if (!isOpen) return null;

  function validateFile(file) {
    if (!file) return "Please choose a prescription file.";

    // File size check
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `File exceeds the maximum limit of 5 MB (${formatBytes(file.size)}). Please upload a smaller document.`;
    }

    // Extension & MIME check
    const ext = "." + file.name.split(".").pop().toLowerCase();
    const mime = (file.type || "").toLowerCase();

    const extValid = ALLOWED_EXTENSIONS.includes(ext);
    const mimeValid = !mime || ALLOWED_MIME_TYPES.includes(mime);

    if (!extValid || !mimeValid) {
      return "Unsupported file type. Please upload a PDF, JPG, JPEG, PNG, or WEBP file.";
    }

    return null;
  }

  function handleFileSelection(file) {
    setValidationError("");
    const err = validateFile(file);
    if (err) {
      setValidationError(err);
      return;
    }

    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
    } else {
      setFilePreview(null);
    }
  }

  function handleFileInputChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  }

  function handleRemoveFile() {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setSelectedFile(null);
    setFilePreview(null);
    setValidationError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    setValidationError("");

    if (!selectedPharmacyId) {
      setValidationError("Please select a partner pharmacy to review your prescription.");
      return;
    }

    if (!selectedFile) {
      setValidationError("Please select or drop your prescription file.");
      return;
    }

    const fileErr = validateFile(selectedFile);
    if (fileErr) {
      setValidationError(fileErr);
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("prescription", selectedFile);
      formData.append("pharmacyId", selectedPharmacyId);
      formData.append("medicineId", medicine?.id || "");
      formData.append("medicineName", medicine?.brand || medicine?.name || "");
      if (customerNotes.trim()) {
        formData.append("customerNotes", customerNotes.trim());
      }

      const res = await prescriptionService.upload(formData);
      if (res?.success) {
        const assignedPharmacy = pharmacies.find((p) => p.id === selectedPharmacyId);
        setSubmissionSuccess({
          reference: res.reference || res.prescription?._id,
          pharmacyName: assignedPharmacy?.name || res.prescription?.pharmacyName || "Partner Pharmacy",
          prescription: res.prescription,
        });
        if (onSuccess) onSuccess(res.prescription || res);
      } else {
        setValidationError(res?.message || "Prescription upload failed. Please try again.");
      }
    } catch (err) {
      console.error("Prescription upload error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to upload prescription. Please verify file format and try again.";
      setValidationError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  function handleCloseModal() {
    if (submitting) return;
    handleRemoveFile();
    setCustomerNotes("");
    setValidationError("");
    setSubmissionSuccess(null);
    onClose();
  }

  const selectedPharmacyObj = pharmacies.find((p) => p.id === selectedPharmacyId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <UploadCloud className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
                Upload Prescription
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Required for Schedule H & Rx medications. Reviewed by verified pharmacists.
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseModal}
            disabled={submitting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {submissionSuccess ? (
            /* Success State */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-xl">
                  Prescription Submitted Successfully!
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Your prescription document has been securely routed to{" "}
                  <strong className="text-slate-800">{submissionSuccess.pharmacyName}</strong> for pharmacist review.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs max-w-md mx-auto space-y-2 text-left">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Prescription Reference:</span>
                  <span className="font-mono font-bold text-teal-700">
                    #{String(submissionSuccess.reference).slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Requested Medicine:</span>
                  <span className="font-bold text-slate-800">
                    {medicine?.brand || medicine?.name || "Prescription Medicine"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Fulfilling Pharmacy:</span>
                  <span className="font-semibold text-slate-800">
                    {submissionSuccess.pharmacyName}
                  </span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-slate-500">Verification Status:</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                    Pending Pharmacist Review
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                Once approved by the licensed pharmacist, your order can be confirmed for delivery or pickup.
              </p>

              <div className="pt-2">
                <Button variant="primary" size="md" onClick={handleCloseModal} className="w-full max-w-xs mx-auto">
                  Done
                </Button>
              </div>
            </div>
          ) : (
            /* Upload Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Medicine Summary Card */}
              {medicine && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold shrink-0">
                      <FileCheck className="w-4 h-4 text-teal-700" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {medicine.brand || medicine.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {medicine.genericName} {medicine.strength ? `· ${medicine.strength}` : ""}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                    Rx Required
                  </span>
                </div>
              )}

              {/* 1. Partner Pharmacy Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                  <span>1. Select Partner Pharmacy <span className="text-rose-500">*</span></span>
                  {selectedPharmacyObj?.rating && (
                    <span className="text-[11px] font-medium text-slate-500">
                      ⭐ {selectedPharmacyObj.rating} Rating
                    </span>
                  )}
                </label>
                {pharmaciesLoading ? (
                  <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
                    <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                    <span>Loading available partner pharmacies...</span>
                  </div>
                ) : (
                  <select
                    value={selectedPharmacyId}
                    onChange={(e) => {
                      setSelectedPharmacyId(e.target.value);
                      setValidationError("");
                    }}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                    required
                  >
                    <option value="">-- Choose Licensed Partner Pharmacy --</option>
                    {pharmacies.map((pharm) => (
                      <option key={pharm.id} value={pharm.id}>
                        {pharm.name} — {pharm.address} ({pharm.distanceKm ? `${pharm.distanceKm} km` : "Partner"})
                      </option>
                    ))}
                  </select>
                )}
                {selectedPharmacyObj && (
                  <p className="text-[11px] text-teal-700 font-semibold mt-1 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{selectedPharmacyObj.address} · Phone: {selectedPharmacyObj.phone}</span>
                  </p>
                )}
              </div>

              {/* 2. File Upload Dropzone */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  2. Prescription Document <span className="text-rose-500">*</span>
                  <span className="text-slate-400 font-normal ml-1">
                    (PDF, JPG, JPEG, PNG, WEBP — Max 5 MB)
                  </span>
                </label>

                {!selectedFile ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      isDragging
                        ? "border-teal-500 bg-teal-50/50"
                        : "border-slate-300 hover:border-teal-500 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    <UploadCloud className="w-10 h-10 text-teal-600 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-800">
                      Click to choose document or drag & drop here
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Clear photos or scans of your doctor's official prescription
                    </p>
                  </div>
                ) : (
                  /* File Selected View */
                  <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {filePreview ? (
                          <img
                            src={filePreview}
                            alt="Prescription Preview"
                            className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                            <FileText className="w-7 h-7" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {selectedFile.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {formatBytes(selectedFile.size)} ·{" "}
                            <span className="text-emerald-700 font-bold">Ready to submit</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          Replace
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* 3. Optional Customer Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  3. Notes for Pharmacist <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows="2"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  maxLength={500}
                  placeholder="Provide patient age, specific dosage instructions, or questions for the pharmacist..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                ></textarea>
                <div className="text-right text-[10px] text-slate-400">
                  {customerNotes.length}/500
                </div>
              </div>

              {/* Validation / Error Banner */}
              {validationError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Legal / Compliance Notice */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-800 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  By submitting, you confirm that this is a valid, unexpired prescription issued by a registered medical practitioner. Prescription medicines cannot be dispensed without licensed pharmacist approval.
                </p>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={submitting || !selectedFile || !selectedPharmacyId}
                  icon={submitting ? Loader2 : UploadCloud}
                >
                  {submitting ? "Submitting Prescription..." : "Submit Prescription"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
