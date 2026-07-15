import { Link } from "react-router-dom";
import { Home as HomeIcon } from "lucide-react";
import Button from "../../components/common/Button";
export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <p className="font-display font-extrabold text-6xl text-primary/30">404</p>
      <h1 className="mt-4 font-display font-bold text-2xl text-text">Page not found</h1>
      <p className="mt-2 text-text-muted">This page is still being built or the address is wrong.</p>
      <Button as={Link} to="/" icon={HomeIcon} className="mt-6 inline-flex">
        Back to home
      </Button>
    </div>
  );
}