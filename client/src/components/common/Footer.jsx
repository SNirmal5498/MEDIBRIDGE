import { Link } from "react-router-dom";
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

export default function Footer() {
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
                  Compare • Locate • Order Safely
                </p>
              </div>
            </div>

            <p className="mt-5 text-gray-300 leading-7">
              MediBridge helps users compare medicines, locate nearby
              pharmacies and safely order eligible OTC medicines.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-5">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3 text-gray-300">
              <Link to="/">Home</Link>
              <Link to="/medicine">Compare Medicines</Link>
              <Link to="/pharmacy">Nearby Pharmacy</Link>
              <Link to="/emergency">Emergency</Link>
              <Link to="/about">About</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-5">
              Contact
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
                Coimbatore, Tamil Nadu, India
              </div>

            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg mb-5">
              Follow Us
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

        <hr className="my-10 border-teal-800" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">

          <p>
            © 2026 MediBridge. All Rights Reserved.
          </p>

          <div className="flex gap-6">
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Terms & Conditions</Link>
          </div>

        </div>

      </div>
    </footer>
  );
}