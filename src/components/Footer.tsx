import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
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
              Empowering students to achieve their dreams of studying abroad with expert guidance and unwavering support.
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
            <h4 className="font-semibold mb-4 text-sm tracking-wide uppercase opacity-90">Quick Links</h4>
            <div className="space-y-2.5">
              {[
                { label: "About Us", path: "/about" },
                { label: "Services", path: "/services" },
                { label: "Visa Records", path: "/visa-records" },
                { label: "Student Care", path: "/student-care" },
                { label: "Branches", path: "/branches" },
                { label: "Contact", path: "/contact" },
              ].map((l) => (
                <Link key={l.path} to={l.path} className="block text-sm opacity-75 hover:opacity-100 transition-opacity">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Study Destinations */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wide uppercase opacity-90">Study Destinations</h4>
            <div className="space-y-2.5">
              {[
                { label: "South Korea", path: "/study-abroad/south-korea" },
                { label: "United Kingdom", path: "/study-abroad/uk" },
                { label: "Europe", path: "/study-abroad/europe" },
              ].map((l) => (
                <Link key={l.path} to={l.path} className="block text-sm opacity-75 hover:opacity-100 transition-opacity">
                  {l.label}
                </Link>
              ))}
              <h4 className="font-semibold mt-6 mb-3 text-sm tracking-wide uppercase opacity-90">Language Courses</h4>
              {["IELTS", "TOEFL", "PTE", "TOPIK / EPS"].map((l) => (
                <span key={l} className="block text-sm opacity-75">{l}</span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wide uppercase opacity-90">Contact Us</h4>
            <div className="space-y-4 text-sm">
              {[
                { icon: MapPin, text: "Banepa Head Office, Nepal" },
                { icon: MapPin, text: "New Baneshwor, Kathmandu" },
                { icon: MapPin, text: "Pokhara, Nepal" },
                { icon: MapPin, text: "Seoul, South Korea" },
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
          <p>Copyright 2024 Future Minds Educational Consultancy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
