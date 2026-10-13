import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Eye,
  ShoppingCart,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Building2,
  RefreshCw,
  Loader2,
  UploadCloud,
} from "lucide-react";
import prescriptionService from "../../services/prescriptionService";
import PrescriptionDocumentModal from "./PrescriptionDocumentModal";
import PrescriptionOrderModal from "./PrescriptionOrderModal";
import PrescriptionUploadModal from "./PrescriptionUploadModal";
import Button from "../common/Button";
import { useAuth } from "../../hooks/useAuth";

export default function MyPrescriptions() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewingRxId, setViewingRxId] = useState(null);
  const [viewingRxTitle, setViewingRxTitle] = useState("");
  const [orderingRx, setOrderingRx] = useState(null);
  const [resubmittingRx, setResubmittingRx] = useState(null);
  const [successToast, setSuccessToast] = useState("");

  const loadPrescriptions = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await prescriptionService.getMyPrescriptions();
      if (res?.success) {
        setPrescriptions(res.prescriptions || []);
      } else {
        setError(res?.message || "Failed to load prescriptions.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load prescriptions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    prescriptionService
      .getMyPrescriptions()
      .then((res) => {
        if (isMounted && res?.success) {
          setPrescriptions(res.prescriptions || []);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.response?.data?.message || err.message || "Failed to load prescriptions.");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOrderSuccess = (order, message) => {
    setSuccessToast(message || "Prescription order request successfully submitted!");
    setTimeout(() => setSuccessToast(""), 5000);
    loadPrescriptions();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
      case "reviewed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified & Approved
          </span>
        );
      case "under-review":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3.5 h-3.5" />
            Under Review
          </span>
        );
      case "clarification-required":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200">
            <HelpCircle className="w-3.5 h-3.5" />
            Clarification Needed
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Awaiting Review
          </span>
        );
    }
  };

  return (
    <div id="prescriptions" className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-100 font-semibold text-xs animate-in fade-in flex items-center justify-between">
          <span>{successToast}</span>
          <button onClick={() => setSuccessToast("")} className="text-emerald-300 font-bold ml-2">
            &times;
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            My Prescriptions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track verification status, pharmacist feedback, and order dispensing requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={loadPrescriptions}
            disabled={loading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-7 h-7 text-teal-600 animate-spin" />
          <p className="text-xs font-semibold">Loading your prescription requests...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between">
          <span>{error}</span>
          <Button variant="secondary" size="sm" onClick={loadPrescriptions}>
            Retry
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && prescriptions.length === 0 && (
        <div className="text-center py-12 px-4 bg-slate-50/60 rounded-xl border border-slate-200/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">No Prescriptions Uploaded</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              When you submit a prescription for prescription-required medicines, you can track its review progress, pharmacist notes, and order dispensing status right here.
            </p>
          </div>
          <div className="pt-2">
            <Button as={Link} to="/medicine" variant="primary" size="sm">
              Browse Medicines
            </Button>
          </div>
        </div>
      )}

      {/* Prescriptions List */}
      {!loading && !error && prescriptions.length > 0 && (
        <div className="divide-y divide-slate-100">
          {prescriptions.map((rx) => {
            const isApproved = rx.status === "approved" || rx.status === "reviewed";
            const hasOrder = Boolean(rx.order);

            return (
              <div
                key={rx._id}
                className="py-5 first:pt-0 last:pb-0 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Prescription Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      {rx.medicineName || "Prescription Order"}
                    </h3>
                    {getStatusBadge(rx.status)}
                  </div>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <strong>Pharmacy:</strong> {rx.pharmacyName || rx.pharmacyId || "Partner Pharmacy"}
                    </span>
                    <span>
                      <strong>Submitted:</strong> {new Date(rx.createdAt).toLocaleDateString()} at{" "}
                      {new Date(rx.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {rx.originalName && (
                      <span className="font-mono text-[11px] text-slate-400">
                        File: {rx.originalName}
                      </span>
                    )}
                  </div>

                  {/* Customer Notes */}
                  {rx.customerNotes && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <strong className="text-slate-700">Your Note:</strong> "{rx.customerNotes}"
                    </p>
                  )}

                  {/* Pharmacist Review Feedback */}
                  {(rx.reviewNotes || rx.rejectionReason) && (
                    <div
                      className={`text-xs p-2.5 rounded-lg border flex items-start gap-2 ${
                        rx.status === "rejected"
                          ? "bg-rose-50 border-rose-200 text-rose-800"
                          : rx.status === "clarification-required"
                          ? "bg-purple-50 border-purple-200 text-purple-800"
                          : "bg-emerald-50 border-emerald-200 text-emerald-800"
                      }`}
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <strong>Pharmacist Review Feedback:</strong>{" "}
                        {rx.rejectionReason || rx.reviewNotes}
                      </div>
                    </div>
                  )}

                  {/* Order linked indicator */}
                  {hasOrder && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/60">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      <span>
                        Order Placed: {typeof rx.order === "object" ? rx.order.orderId : rx.order}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Eye}
                    onClick={() => {
                      setViewingRxId(rx._id);
                      setViewingRxTitle(rx.medicineName || "Prescription Document");
                    }}
                  >
                    View Document
                  </Button>

                  {/* Next Step Actions */}
                  {isApproved && !hasOrder && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={ShoppingCart}
                      onClick={() => setOrderingRx(rx)}
                    >
                      Order Medicine
                    </Button>
                  )}

                  {isApproved && hasOrder && (
                    <Button
                      as={Link}
                      to="/orders"
                      variant="secondary"
                      size="sm"
                    >
                      View in Orders
                    </Button>
                  )}

                  {(rx.status === "clarification-required" || rx.status === "rejected") && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={UploadCloud}
                      onClick={() => setResubmittingRx(rx)}
                    >
                      {rx.status === "clarification-required"
                        ? "Upload Corrected Document"
                        : "Resubmit Prescription"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Document Preview Modal */}
      <PrescriptionDocumentModal
        isOpen={Boolean(viewingRxId)}
        prescriptionId={viewingRxId}
        title={viewingRxTitle}
        onClose={() => setViewingRxId(null)}
      />

      {/* Prescription Order Dispensing Modal */}
      {orderingRx && (
        <PrescriptionOrderModal
          isOpen={Boolean(orderingRx)}
          prescription={orderingRx}
          medicine={{ name: orderingRx.medicineName, id: orderingRx.medicineId }}
          user={user}
          onClose={() => setOrderingRx(null)}
          onOrderSuccess={handleOrderSuccess}
        />
      )}

      {/* Resubmission Modal */}
      {resubmittingRx && (
        <PrescriptionUploadModal
          isOpen={Boolean(resubmittingRx)}
          medicine={{
            id: resubmittingRx.medicineId,
            name: resubmittingRx.medicineName,
            brand: resubmittingRx.medicineName,
          }}
          onClose={() => setResubmittingRx(null)}
          onSuccess={() => {
            setResubmittingRx(null);
            loadPrescriptions();
          }}
        />
      )}
    </div>
  );
}
