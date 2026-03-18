import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import SectionHeading from "@/components/SectionHeading";

const Language = () => {
  const { t } = useLanguage();

  const courses = [
    { id: "ielts", title: t("language.course.ielts.title"), desc: t("language.course.ielts.desc"), duration: "6-8 weeks", fee: t("contact.form.sendMessage") },
    { id: "toefl", title: t("language.course.toefl.title"), desc: t("language.course.toefl.desc"), duration: "6-8 weeks", fee: t("contact.form.sendMessage") },
    { id: "pte", title: t("language.course.pte.title"), desc: t("language.course.pte.desc"), duration: "4-6 weeks", fee: t("contact.form.sendMessage") },
    { id: "korean", title: t("language.course.korean.title"), desc: t("language.course.korean.desc"), duration: "3-6 months", fee: t("contact.form.sendMessage") },
    { id: "klpt", title: t("language.course.klpt.title"), desc: t("language.course.klpt.desc"), duration: "3-6 months", fee: t("contact.form.sendMessage") },
    { id: "topik", title: t("language.course.topik.title"), desc: t("language.course.topik.desc"), duration: "3-6 months", fee: t("contact.form.sendMessage") },
  ];

  return (
    <div>
      <section className="gradient-primary py-20 lg:py-28">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            {t('language.hero.title')}
          </motion.h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            {t('language.hero.description')}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <SectionHeading title={t('language.program.title')} description={t('language.program.description')} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c, i) => (
              <motion.div
                key={c.id}
                id={c.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl bg-card p-7 shadow-card border border-border hover:shadow-elevated transition-all"
              >
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground mb-5">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{c.desc}</p>
                <div className="flex items-center justify-between text-sm mb-5 text-muted-foreground">
                  <span>{t('language.course.duration').replace('{duration}', c.duration)}</span>
                  <span>{c.fee}</span>
                </div>
                <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                  {t('language.course.enroll')} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Language;
