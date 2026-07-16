import Hero from "../../components/home/Hero";
import MedicineComparison from "../../components/home/MedicineComparison";
import EmergencyBanner from "../../components/home/EmergencyBanner";
import Features from "../../components/home/Features";
import Testimonials from "../../components/home/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <MedicineComparison />
      <EmergencyBanner />
      <Features />
      <Testimonials />
    </>
  );
}