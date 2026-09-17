import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import {
  FaCapsules,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useLanguage } from "../../hooks/useLanguage";
import { formatAddress } from "../../utils/formatters";

export default function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-teal-950 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Logo */}
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-teal-600 p-3 rounded-xl">
                <FaCapsules className="text-2xl" />
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  Medi<span className="text-teal-400">Bridge</span>
                </h2>

                <p className="text-sm text-gray-300">
                  {t("hero.subtitle").slice(0, 45)}...
                </p>
              </div>
            </div>

            <p className="mt-5 text-gray-300 leading-7">
              {t("footer.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-5">
              {t("footer.quickLinks")}
            </h3>

            <div className="flex flex-col gap-3 text-gray-300">
              <Link to="/">{t("nav.home")}</Link>
              <Link to="/medicine">{t("nav.compareMedicines")}</Link>
              <Link to="/pharmacy">{t("nav.nearbyPharmacy")}</Link>
              <Link to="/emergency">{t("nav.emergency")}</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-5">
              {t("footer.contactUs")}
            </h3>

            <div className="space-y-4 text-gray-300">

              <div className="flex items-center gap-3">
                <FaEnvelope />
                support@medibridge.com
              </div>

              <div className="flex items-center gap-3">
                <FaPhoneAlt />
                +91 98765 43210
              </div>

              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1" />
                {formatAddress("Coimbatore, Tamil Nadu, India", language.code)}
              </div>

            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg mb-5">
              {t("footer.followUs")}
            </h3>

            <div className="flex gap-4 text-2xl">

              <a href="#">
                <FaFacebook className="hover:text-teal-400 transition" />
              </a>

              <a href="#">
                <FaInstagram className="hover:text-teal-400 transition" />
              </a>

              <a href="#">
                <FaLinkedin className="hover:text-teal-400 transition" />
              </a>

              <a href="#">
                <FaGithub className="hover:text-teal-400 transition" />
              </a>

            </div>
          </div>

        </div>

        {/* Medical Disclaimer */}
        <div className="mt-10 rounded-2xl border border-teal-800 bg-teal-900/50 p-5 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />

          <p className="text-sm text-teal-100/70 leading-relaxed">
            <span className="font-semibold text-white">
              {t("footer.medicalDisclaimer")}:
            </span>{" "}
            {t("footer.disclaimerNotice")} {t("details.disclaimerText")}
          </p>
        </div>

        <hr className="my-10 border-teal-800" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">

          <p>
            © 2026 MediBridge. {t("footer.allRightsReserved")}
          </p>

          <div className="flex gap-6">
            <Link to="#">{t("footer.privacyPolicy")}</Link>
            <Link to="#">{t("footer.terms")}</Link>
          </div>

        </div>

      </div>
    </footer>
  );
}