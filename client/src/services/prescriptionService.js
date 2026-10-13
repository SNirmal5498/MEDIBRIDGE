import api from "./api";

export const prescriptionService = {
  /**
   * Upload customer prescription document
   * @param {FormData} formData
   */
  async upload(formData) {
    const response = await api.post("/prescriptions/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Fetch current user's prescription submissions
   * @param {Object} [params] - Optional query params e.g. { medicineId: "..." }
   */
  async getMyPrescriptions(params = {}) {
    const response = await api.get("/prescriptions/my", { params });
    return response.data;
  },

  /**
   * Get prescription file document as a binary Blob
   * @param {string} id - Prescription ID
   */
  async getFile(id) {
    const response = await api.get(`/prescriptions/${id}/file`, {
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Request fulfillment order for an approved prescription
   * @param {string} id - Prescription ID
   * @param {Object} orderData - { deliveryAddress, paymentMethod, quantity }
   */
  async requestOrder(id, orderData) {
    const response = await api.post(`/prescriptions/${id}/order-request`, orderData);
    return response.data;
  },

  /**
   * Securely fetch and display the prescription document in a new browser tab.
   * Uses authenticated Axios client to receive the blob and creates a temporary Object URL.
   * @param {string} id - Prescription ID
   */
  async openDocumentInNewTab(id) {
    // Open a blank tab synchronously to prevent popup blocker blocking async window.open
    const newTab = window.open("about:blank", "_blank");
    if (newTab) {
      newTab.document.write(
        "<!DOCTYPE html><html><head><title>Loading Document...</title></head><body style='display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:system-ui,sans-serif;background:#f8fafc;color:#475569;'><p style='font-size:14px;font-weight:600;'>Securely retrieving prescription document...</p></body></html>"
      );
    }

    try {
      const blob = await this.getFile(id);
      const docUrl = URL.createObjectURL(blob);

      if (newTab) {
        newTab.location.href = docUrl;
      } else {
        window.open(docUrl, "_blank");
      }

      // Revoke the object URL after 60 seconds once browser has loaded it
      setTimeout(() => {
        URL.revokeObjectURL(docUrl);
      }, 60000);

      return docUrl;
    } catch (err) {
      let errorMessage = "Unable to load prescription document.";
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const parsed = JSON.parse(text);
          errorMessage = parsed.message || errorMessage;
        } catch {
          if (err.response.status === 403) {
            errorMessage = "Access Denied: You do not have permission to view this prescription document.";
          } else if (err.response.status === 401) {
            errorMessage = "Session expired or authentication missing. Please log in again.";
          }
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      if (newTab) {
        newTab.document.body.innerHTML = `<!DOCTYPE html><html><head><title>Error</title></head><body style='display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:system-ui,sans-serif;background:#fef2f2;color:#991b1b;'><div style='padding:24px 32px;background:white;border-radius:12px;border:1px solid #fecaca;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);text-align:center;max-width:440px;'><h3 style='margin:0 0 8px;font-size:16px;'>Document Access Error</h3><p style='margin:0;font-size:13px;color:#7f1d1d;'>${errorMessage}</p></div></body></html>`;
      }
      throw new Error(errorMessage, { cause: err });
    }
  },
};

export default prescriptionService;
