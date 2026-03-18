import { motion } from "framer-motion";
import { GraduationCap, Users } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";
import SectionHeading from "@/components/SectionHeading";
import { useLanguage } from "@/contexts/LanguageContext";

const VisaRecords = () => {
  const { t } = useLanguage();

  const records = [
    { uni: t("visaRecords.uni.snu"), count: 245 },
    { uni: t("visaRecords.uni.yonsei"), count: 312 },
    { uni: t("visaRecords.uni.korea"), count: 198 },
    { uni: t("visaRecords.uni.hanyang"), count: 276 },
    { uni: t("visaRecords.uni.kyunghee"), count: 189 },
    { uni: t("visaRecords.uni.kaist"), count: 87 },
    { uni: t("visaRecords.uni.chungnam"), count: 354 },
    { uni: t("visaRecords.uni.skku"), count: 156 },
    { uni: t("visaRecords.uni.london"), count: 143 },
    { uni: t("visaRecords.uni.manchester"), count: 98 },
    { uni: t("visaRecords.uni.edinburgh"), count: 76 },
    { uni: t("visaRecords.uni.munich"), count: 64 },
    { uni: t("visaRecords.uni.amsterdam"), count: 52 },
    { uni: t("visaRecords.uni.sorbonne"), count: 41 },
  ];

  return (
    <div>
      <section className="gradient-primary py-20 lg:py-28">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            {t('visaRecords.hero.title')}
          </motion.h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            {t('visaRecords.hero.description')}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <AnimatedCounter end={5000} suffix="+" label={t('visaRecords.stat.totalStudents')} icon={<Users className="h-6 w-6" />} />
            <AnimatedCounter end={98} suffix="%" label={t('visaRecords.stat.successRate')} icon={<GraduationCap className="h-6 w-6" />} />
            <AnimatedCounter end={120} suffix="+" label={t('visaRecords.stat.universities')} icon={<GraduationCap className="h-6 w-6" />} />
            <AnimatedCounter end={15} suffix="+" label={t('visaRecords.stat.countries')} icon={<GraduationCap className="h-6 w-6" />} />
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-6">
          <SectionHeading title={t('visaRecords.main.title')} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {records.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between rounded-xl bg-card p-5 shadow-card border border-border"
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-primary shrink-0" />
                  <span className="font-medium text-sm text-foreground">{r.uni}</span>
                </div>
                <span className="font-bold text-primary text-lg">{r.count}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisaRecords;
