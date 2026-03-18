import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Target, Eye, Heart, Shield, TrendingUp, Lightbulb } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

interface LeadershipMessage {
  id: number;
  name: string;
  position: string;
  message: string;
  photo_url: string | null;
}

const About = () => {
  const { t } = useLanguage();
  const [leadership, setLeadership] = useState<LeadershipMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeadership = async () => {
      try {
        const response = await fetch("/api/leadership");
        if (response.ok) {
          const data = await response.json();
          setLeadership(data);
        }
      } catch (error) {
        console.error("Failed to fetch leadership", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeadership();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="gradient-primary py-20 lg:py-28">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            {t('about.hero.title')}
          </motion.h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">{t('about.hero.description')}</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="mission" className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: Target, title: t("about.mission.title"), text: t("about.mission.text") },
              { icon: Eye, title: t("about.vision.title"), text: t("about.vision.text") },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="rounded-2xl bg-card p-8 shadow-card border border-border">
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground mb-5">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Messages */}
      <section className="py-20 bg-muted/50 overflow-hidden">
        <div className="container mx-auto px-6">
          <SectionHeading badge={t("about.leadership.badge")} title={t("about.leadership.title")} centered={true} />

          {loading ? (
            <div className="flex justify-center p-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : leadership.length > 0 ? (
            <div className={`grid gap-8 ${leadership.length === 1 ? 'max-w-3xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-2'}`}>
              {leadership.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl bg-card p-6 md:p-8 shadow-card border border-border flex flex-col md:flex-row gap-6 items-center md:items-start"
                >
                  {item.photo_url && (
                    <div className="shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-2 border-primary/20 bg-muted">
                      <img src={item.photo_url} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 text-center md:text-left">
                    <div className="text-primary mb-2">
                      <svg className="h-8 w-8 opacity-20" fill="currentColor" viewBox="0 0 32 32">
                        <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-2.2 1.8-4 4-4V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8z" />
                      </svg>
                    </div>
                    <p className="text-muted-foreground leading-relaxed italic mb-6">
                      {item.message}
                    </p>
                    <p className="font-bold text-foreground text-lg">{item.name}</p>
                    <p className="text-sm text-primary font-medium">{item.position}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground italic">{t("about.leadership.none")}</p>
          )}
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <SectionHeading badge={t("about.values.badge")} title={t("about.values.title")} />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: t("about.values.student.title"), desc: t("about.values.student.desc") },
              { icon: Shield, title: t("about.values.integrity.title"), desc: t("about.values.integrity.desc") },
              { icon: TrendingUp, title: t("about.values.excellence.title"), desc: t("about.values.excellence.desc") },
              { icon: Lightbulb, title: t("about.values.innovation.title"), desc: t("about.values.innovation.desc") },
            ].map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6 rounded-2xl bg-card shadow-card border border-border">
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground mx-auto mb-4">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="success" className="py-20 bg-muted/50">
        <div className="container mx-auto px-6">
          <SectionHeading badge={t("about.success.badge")} title={t("about.success.title")} description={t("about.success.description")} />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Binod K.", uni: "Seoul National University", text: t("about.stories.binod.text") },
              { name: "Anita R.", uni: "University of Edinburgh", text: t("about.stories.anita.text") },
              { name: "Sujan M.", uni: "TU Munich", text: t("about.stories.sujan.text") },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl bg-card p-7 shadow-card border border-border">
                <p className="text-muted-foreground leading-relaxed mb-5 italic">"{s.text}"</p>
                <p className="font-semibold text-foreground">{s.name}</p>
                <p className="text-sm text-primary">{s.uni}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
