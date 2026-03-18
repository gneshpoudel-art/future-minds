import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { useLanguage } from "@/contexts/LanguageContext";

const Branches = () => {
  const { t } = useLanguage();

  const branches = [
    {
      city: t("branches.kathmandu.city"),
      address: t("branches.kathmandu.address"),
      phone: "+977-01-4567890",
      email: "ktm@futureminds.edu.np",
      hours: t("branches.kathmandu.hours"),
      desc: t("branches.kathmandu.desc")
    },
    {
      city: t("branches.banepa.city"),
      address: t("branches.banepa.address"),
      phone: "+977-011-660123",
      email: "info@futureminds.edu.np",
      hours: t("branches.banepa.hours"),
      desc: t("branches.banepa.desc")
    },
    {
      city: t("branches.pokhara.city"),
      address: t("branches.pokhara.address"),
      phone: "+977-061-123456",
      email: "pokhara@futureminds.edu.np",
      hours: t("branches.pokhara.hours"),
      desc: t("branches.pokhara.desc")
    },
    {
      city: t("branches.seoul.city"),
      address: t("branches.seoul.address"),
      phone: "+82-2-1234-5678",
      email: "seoul@futureminds.edu.np",
      hours: t("branches.seoul.hours"),
      desc: t("branches.seoul.desc")
    },
  ];

  return (
    <div>
      <section className="gradient-primary py-20 lg:py-28">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            {t('branches.hero.title')}
          </motion.h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            {t('branches.hero.description')}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6">
            {branches.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl bg-card p-8 shadow-card border border-border">
                <h3 className="text-xl font-bold text-foreground mb-3">{b.city}</h3>
                <p className="text-sm text-muted-foreground mb-5">{b.desc}</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">{b.address}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-foreground">{b.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-foreground">{b.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-foreground">{t('branches.hours')}: {b.hours}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Branches;
