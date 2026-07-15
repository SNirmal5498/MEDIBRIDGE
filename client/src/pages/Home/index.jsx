import Hero from "../../components/home/Hero";
import Stats from "../../components/home/Stats";
import MedicineComparison from "../../components/home/MedicineComparison";
import EmergencyBanner from "../../components/home/EmergencyBanner";
import Features from "../../components/home/Features";
import PharmacySection from "../../components/home/PharmacySection";
import Testimonials from "../../components/home/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <MedicineComparison />
      <EmergencyBanner />
      <Features />
      <PharmacySection />
      <Testimonials />
    </>
  );
}