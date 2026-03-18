import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GraduationCap, FileCheck, Award, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import SectionHeading from "@/components/SectionHeading";

const StudyAbroad = () => {
  const { country } = useParams<{ country: string }>();
  const { t } = useLanguage();

  const getCountryKey = (c: string) => {
    if (c === "south-korea") return "korea";
    return c; // uk, europe
  };

  const cKey = getCountryKey(country || "south-korea");

  // Static university lists (as they are proper names, keeping them here but could be translated if needed)
  const universities: Record<string, string[]> = {
    "south-korea": ["Seoul National University", "Yonsei University", "Korea University", "KAIST", "Hanyang University", "Kyung Hee University", "Chungnam National University", "Sungkyunkwan University"],
    uk: ["University of London", "University of Manchester", "University of Edinburgh", "University of Leeds", "University of Birmingham", "King's College London"],
    europe: ["TU Munich", "Sorbonne University", "University of Amsterdam", "ETH Zurich", "Politecnico di Milano", "University of Helsinki"],
  };

  const info = {
    title: t(`study.${cKey}.title`),
    country: t(`nav.studyAbroad`) + " " + (country === "south-korea" ? t("footer.destinations.korea") : country === "uk" ? "UK" : t("footer.destinations.europe")),
    overview: t(`study.${cKey}.overview`),
    universities: universities[country || "south-korea"] || [],
    requirements: t(`study.${cKey}.requirements`).split("|"),
    visaSteps: t(`study.${cKey}.visaSteps`).split("|"),
    scholarships: t(`study.${cKey}.scholarships`).split("|"),
  };

  if (info.title === `study.${cKey}.title`) return <div className="py-32 text-center text-muted-foreground">{t('study.hero.destinationNotFound')}</div>;

  return (
    <div>
      <section className="gradient-primary py-20 lg:py-28">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">{info.title}</motion.h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">{info.overview}</p>
        </div>
      </section>

      {/* Universities */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <SectionHeading badge={t('study.badge.universities')} title={t('study.popularUniversities').replace('{country}', country === "south-korea" ? t("footer.destinations.korea") : country === "uk" ? "UK" : t("footer.destinations.europe"))} />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {info.universities.map((u, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="rounded-xl bg-card p-5 shadow-card border border-border flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-primary shrink-0" />
                <span className="font-medium text-sm text-foreground">{u}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements & Visa */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <SectionHeading title={t('study.title.requirements')} centered={false} />
              <div className="space-y-3">
                {info.requirements.map((r, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                    <FileCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground">{r}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <SectionHeading title={t('study.title.visa')} centered={false} />
              <div className="space-y-3">
                {info.visaSteps.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                    <span className="h-6 w-6 rounded-full gradient-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                    <span className="text-sm text-foreground">{s}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scholarships */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <SectionHeading badge={t('study.badge.scholarships')} title={t('study.title.scholarships')} />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {info.scholarships.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="rounded-xl bg-card p-5 shadow-card border border-border text-center">
                <Award className="h-6 w-6 text-primary mx-auto mb-3" />
                <p className="font-medium text-sm text-foreground">{s}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/contact" className="inline-flex items-center gap-2 gradient-primary text-primary-foreground rounded-xl px-8 py-3.5 font-semibold text-sm hover:opacity-90 transition-opacity">
              {t('study.button.apply')} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudyAbroad;
