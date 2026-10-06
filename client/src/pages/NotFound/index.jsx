import { Link } from "react-router-dom";
import { Home as HomeIcon } from "lucide-react";
import Button from "../../components/common/Button";
import { useLanguage } from "../../hooks/useLanguage";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <p className="font-display font-extrabold text-6xl text-primary/30">404</p>
      <h1 className="mt-4 font-display font-bold text-2xl text-text">{t("notfound.title")}</h1>
      <p className="mt-2 text-text-muted">{t("notfound.desc")}</p>
      <Button as={Link} to="/" icon={HomeIcon} className="mt-6 inline-flex">
        {t("notfound.backHome")}
      </Button>
    </div>
  );
}