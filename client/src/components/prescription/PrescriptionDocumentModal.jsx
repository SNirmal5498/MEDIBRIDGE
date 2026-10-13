import { useState, useEffect } from "react";
import { X, ExternalLink, Download, Loader2, AlertCircle, FileText } from "lucide-react";
import prescriptionService from "../../services/prescriptionService";
import Button from "../common/Button";

export default function PrescriptionDocumentModal({
  isOpen,
  onClose,
  prescriptionId,
  title = "Prescription Document",
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [docUrl, setDocUrl] = useState(null);
  const [docType, setDocType] = useState(null);

  useEffect(() => {
    let currentUrl = null;
    let isMounted = true;

    async function loadDocument() {
      if (!isOpen || !prescriptionId) return;

      setLoading(true);
      setError(null);
      setDocUrl(null);
      setDocType(null);

      try {
        const blob = await prescriptionService.getFile(prescriptionId);
        if (!isMounted) return;

        currentUrl = URL.createObjectURL(blob);
        setDocUrl(currentUrl);
        setDocType(blob.type || "application/pdf");
      } catch (err) {
        if (!isMounted) return;
        let message = "Failed to load prescription document.";
        if (err.response?.data instanceof Blob) {
          try {
            const text = await err.response.data.text();
            const parsed = JSON.parse(text);
            message = parsed.message || message;
          } catch {
            if (err.response.status === 403) {
              message = "Access Forbidden: You do not have permission to view this medical prescription document.";
            } else if (err.response.status === 401) {
              message = "Authentication required. Please log in to view this document.";
            } else if (err.response.status === 404) {
              message = "Prescription document not found on the server.";
            }
          }
        } else if (err.response?.data?.message) {
          message = err.response.data.message;
        }
        setError(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDocument();

    return () => {
      isMounted = false;
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [isOpen, prescriptionId]);

  // Cleanup on manual close
  const handleClose = () => {
    if (docUrl) {
      URL.revokeObjectURL(docUrl);
      setDocUrl(null);
    }
    onClose();
  };

  if (!isOpen) return null;

  const isPdf = docType?.includes("pdf") || (!docType?.includes("image") && !error);
  const isImage = docType?.includes("image");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl h-[88vh] rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                {title || "Prescription Document"}
              </h3>
              <p className="text-[11px] text-slate-500">
                Securely fetched with verified authorization credentials
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {docUrl && (
              <>
                <button
                  type="button"
                  onClick={() => window.open(docUrl, "_blank")}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Open in new window"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Open Full Tab</span>
                </button>
                <a
                  href={docUrl}
                  download={`prescription-${prescriptionId}.${isPdf ? "pdf" : "jpg"}`}
                  className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200/60 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Download copy"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </a>
              </>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 bg-slate-100/50 p-4 sm:p-6 overflow-hidden flex items-center justify-center">
          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
              <p className="text-sm font-semibold">Retrieving encrypted medical document...</p>
            </div>
          )}

          {error && (
            <div className="max-w-md w-full bg-white p-6 rounded-2xl border border-rose-200 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Unable to Access Document</h4>
              <p className="text-xs text-rose-700 font-medium">{error}</p>
              <div className="pt-2">
                <Button variant="secondary" size="sm" onClick={handleClose}>
                  Dismiss
                </Button>
              </div>
            </div>
          )}

          {!loading && !error && docUrl && (
            <div className="w-full h-full rounded-xl overflow-hidden bg-white shadow-xs border border-slate-200 flex items-center justify-center">
              {isPdf ? (
                <iframe
                  src={docUrl}
                  title="Prescription PDF Viewer"
                  className="w-full h-full border-0"
                />
              ) : isImage ? (
                <div className="w-full h-full overflow-auto p-4 flex items-center justify-center bg-slate-950/5">
                  <img
                    src={docUrl}
                    alt="Prescription Document Preview"
                    className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
                  />
                </div>
              ) : (
                <div className="text-center p-8 space-y-3">
                  <p className="text-sm text-slate-600">Document type ready for inspection.</p>
                  <a
                    href={docUrl}
                    download="prescription-document"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-700 text-white font-bold rounded-lg text-xs"
                  >
                    <Download className="w-4 h-4" /> Download File
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
