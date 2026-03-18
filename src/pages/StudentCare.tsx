import { motion } from "framer-motion";
import { BookOpen, Plane, Users, Heart, Building, Phone, Shield, GraduationCap } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { useLanguage } from "@/contexts/LanguageContext";

const StudentCare = () => {
  const { t } = useLanguage();

  const steps = [
    { icon: BookOpen, title: t("studentCare.step.korean.title"), desc: t("studentCare.step.korean.desc") },
    { icon: Plane, title: t("studentCare.step.pickup.title"), desc: t("studentCare.step.pickup.desc") },
    { icon: Users, title: t("studentCare.step.orientation.title"), desc: t("studentCare.step.orientation.desc") },
    { icon: Heart, title: t("studentCare.step.groups.title"), desc: t("studentCare.step.groups.desc") },
    { icon: Building, title: t("studentCare.step.festival.title"), desc: t("studentCare.step.festival.desc") },
    { icon: Phone, title: t("studentCare.step.seoul.title"), desc: t("studentCare.step.seoul.desc") },
    { icon: Shield, title: t("studentCare.step.emergency.title"), desc: t("studentCare.step.emergency.desc") },
    { icon: GraduationCap, title: t("studentCare.step.mediation.title"), desc: t("studentCare.step.mediation.desc") },
  ];

  return (
    <div>
      <section className="gradient-primary py-20 lg:py-28">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            {t('studentCare.hero.title')}
          </motion.h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            {t('studentCare.hero.description')}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <SectionHeading title={t('studentCare.main.title')} description={t('studentCare.main.description')} />
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

            <div className="space-y-8">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-5 md:pl-4"
                >
                  <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground shrink-0 relative z-10">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div className="pb-2">
                    <h3 className="font-semibold text-foreground text-lg mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentCare;
