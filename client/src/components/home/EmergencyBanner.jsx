import { Siren, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";

export default function EmergencyBanner() {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-danger/20 bg-danger-50 px-6 py-6 sm:px-8 sm:py-7 flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
        <div className="flex items-start gap-4">
          <div className="grid place-items-center w-11 h-11 rounded-xl bg-white text-danger shrink-0">
            <Siren className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-text">Medical emergency?</h3>
            <p className="text-sm text-text-muted mt-0.5">
              Find emergency medicines, nearby hospitals, and ambulance numbers instantly.
            </p>
          </div>
        </div>
        <Button variant="danger" icon={ArrowRight} iconPosition="right" onClick={() => navigate("/emergency")} className="shrink-0">
          Open emergency info
        </Button>
      </div>
    </section>
  );
}