import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.png";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="gradient-primary text-primary-foreground">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img src={logo} alt="Future Minds" className="h-10 w-10 rounded-lg object-cover" />
              <div className="leading-tight">
                <span className="text-lg font-bold">Future Minds</span>
                <span className="block text-[10px] font-medium opacity-70 tracking-wide">EDUCATIONAL CONSULTANCY</span>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed mb-6">
              {t('footer.description')}
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="h-9 w-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wide uppercase opacity-90">{t('footer.quickLinks')}</h4>
            <div className="space-y-2.5">
              {[
                { label: t("footer.links.about"), path: "/about" },
                { label: t("footer.links.services"), path: "/services" },
                { label: t("footer.links.visa"), path: "/visa-records" },
                { label: t("footer.links.care"), path: "/student-care" },
                { label: t("footer.links.branches"), path: "/branches" },
                { label: t("footer.links.contact"), path: "/contact" },
              ].map((l) => (
                <Link key={l.path} to={l.path} className="block text-sm opacity-75 hover:opacity-100 transition-opacity">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Study Destinations */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wide uppercase opacity-90">{t('footer.studyDestinations')}</h4>
            <div className="space-y-2.5">
              {[
                { label: t("footer.destinations.korea"), path: "/study-abroad/south-korea" },
                { label: t("footer.destinations.uk"), path: "/study-abroad/uk" },
                { label: t("footer.destinations.europe"), path: "/study-abroad/europe" },
              ].map((l) => (
                <Link key={l.path} to={l.path} className="block text-sm opacity-75 hover:opacity-100 transition-opacity">
                  {l.label}
                </Link>
              ))}
              <h4 className="font-semibold mt-6 mb-3 text-sm tracking-wide uppercase opacity-90">{t('footer.languageCourses')}</h4>
              {["IELTS", "TOEFL", "PTE", "TOPIK / EPS"].map((l) => (
                <span key={l} className="block text-sm opacity-75">{l}</span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wide uppercase opacity-90">{t('footer.contact')}</h4>
            <div className="space-y-4 text-sm">
              {[
                { icon: MapPin, text: t("footer.address.banepa") },
                { icon: MapPin, text: t("footer.address.kathmandu") },
                { icon: MapPin, text: t("footer.address.pokhara") },
                { icon: MapPin, text: t("footer.address.seoul") },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 opacity-80">
                  <item.icon className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{item.text}</span>
                </div>
              ))}
              <div className="flex items-center gap-2.5 opacity-80">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+977-01-4567890</span>
              </div>
              <div className="flex items-center gap-2.5 opacity-80">
                <Mail className="h-4 w-4 shrink-0" />
                <span>info@futureminds.edu.np</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/15 text-center text-sm opacity-60">
          <p>© {new Date().getFullYear()} Future Minds Educational Consultancy. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
