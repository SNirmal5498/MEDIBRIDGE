import { ShieldAlert } from "lucide-react";
import {
  FIRST_AID_GUIDES,
  EMERGENCY_HOSPITALS,
  EMERGENCY_MEDICINES,
} from "../../utils/emergencyData";
import FirstAidCard from "../../components/emergency/FirstAidCard";
import HospitalCard from "../../components/emergency/HospitalCard";
import EmergencyMedicineCard from "../../components/emergency/EmergencyMedicineCard";
import EmergencyChecklist from "../../components/emergency/EmergencyChecklist";
import SafetyTips from "../../components/emergency/SafetyTips";

export default function Emergency() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-text">Emergency Assistance</h1>
        <p className="mt-1.5 text-text-muted">
          Quickly access emergency services, first aid guidance, nearby hospitals, and emergency medicine information.
        </p>
      </div>

      {/* First aid guides */}
      <section>
        <h2 className="font-display font-bold text-xl text-text mb-5">First Aid Guides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FIRST_AID_GUIDES.map((guide) => (
            <FirstAidCard key={guide.id} guide={guide} />
          ))}
        </div>
      </section>

      {/* Nearby hospitals */}
      <section className="mt-14">
        <h2 className="font-display font-bold text-xl text-text mb-5">Nearby Hospitals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {EMERGENCY_HOSPITALS.map((hospital) => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>
      </section>

      {/* Emergency OTC medicines */}
      <section className="mt-14">
        <h2 className="font-display font-bold text-xl text-text mb-5">Emergency OTC Medicines</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {EMERGENCY_MEDICINES.map((medicine) => (
            <EmergencyMedicineCard key={medicine.id} medicine={medicine} />
          ))}
        </div>
      </section>

      {/* Checklist + safety tips */}
      <section className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <EmergencyChecklist />
        <SafetyTips />
      </section>

      {/* Disclaimer */}
      <section className="mt-14">
        <div className="rounded-2xl border border-warning/30 bg-warning-50 p-5 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <p className="text-sm text-text leading-relaxed">
            <span className="font-semibold">Medical Disclaimer: </span>
            the emergency information provided by MediBridge is intended for informational purposes only
            and should not replace professional medical advice or emergency medical services. In case of a
            serious emergency, immediately contact your local emergency services or visit the nearest hospital.
          </p>
        </div>
      </section>
    </div>
  );
}