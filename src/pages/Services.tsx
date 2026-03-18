import { motion } from "framer-motion";
import { Compass, BookOpen, FileCheck, GraduationCap, DollarSign, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import SectionHeading from "@/components/SectionHeading";

const Services = () => {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState<string | null>(null);

  const services = [
    { id: "career", icon: Compass, title: t("services.career.title"), desc: t("services.career.desc"), details: t("services.career.details") },
    { id: "test", icon: BookOpen, title: t("services.test.title"), desc: t("services.test.desc"), details: t("services.test.details") },
    { id: "visa", icon: FileCheck, title: t("services.visa.title"), desc: t("services.visa.desc"), details: t("services.visa.details") },
    { id: "admission", icon: GraduationCap, title: t("services.admission.title"), desc: t("services.admission.desc"), details: t("services.admission.details") },
    { id: "finance", icon: DollarSign, title: t("services.finance.title"), desc: t("services.finance.desc"), details: t("services.finance.details") },
  ];

  return (
    <div>
      <section className="gradient-primary py-20 lg:py-28">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">{t('services.hero.title')}</motion.h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">{t('services.hero.description')}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <SectionHeading title={t('services.offer.title')} description={t('services.offer.description')} />
          <div className="space-y-4">
            {services.map((s, i) => (
              <motion.div
                key={s.id}
                id={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl bg-card shadow-card border border-border overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                  className="w-full flex items-center gap-5 p-6 text-left hover:bg-muted/30 transition-colors"
                >
                  <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground shrink-0">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg">{s.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${expanded === s.id ? "rotate-180" : ""}`} />
                </button>
                {expanded === s.id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="px-6 pb-6">
                    <div className="pt-4 border-t border-border">
                      <p className="text-muted-foreground leading-relaxed">{s.details}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
