import { motion } from "framer-motion";
import { ChevronDown, Download, Calendar, BookOpen } from "lucide-react";
import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import GalleryCarousel from "@/components/GalleryCarousel";
import { useLanguage } from "@/contexts/LanguageContext";

const Resources = () => {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: t("resources.faq.q1"), a: t("resources.faq.a1") },
    { q: t("resources.faq.q2"), a: t("resources.faq.a2") },
    { q: t("resources.faq.q3"), a: t("resources.faq.a3") },
    { q: t("resources.faq.q4"), a: t("resources.faq.a4") },
    { q: t("resources.faq.q5"), a: t("resources.faq.a5") },
  ];

  const blogPosts = [
    { title: t("resources.blog.post1.title"), category: t("resources.blog.cat.study"), date: "Dec 15, 2024" },
    { title: t("resources.blog.post2.title"), category: t("resources.blog.cat.prep"), date: "Dec 10, 2024" },
    { title: t("resources.blog.post3.title"), category: t("resources.blog.cat.visa"), date: "Dec 5, 2024" },
    { title: t("resources.blog.post4.title"), category: t("resources.blog.cat.scholarships"), date: "Nov 28, 2024" },
    { title: t("resources.blog.post5.title"), category: t("resources.blog.cat.life"), date: "Nov 20, 2024" },
    { title: t("resources.blog.post6.title"), category: t("resources.blog.cat.admissions"), date: "Nov 15, 2024" },
  ];

  const events = [
    { title: t("resources.event1.title"), date: "March 15, 2025", desc: t("resources.event1.desc") },
    { title: t("resources.event2.title"), date: "March 22, 2025", desc: t("resources.event2.desc") },
    { title: t("resources.event3.title"), date: "April 5, 2025", desc: t("resources.event3.desc") },
  ];

  const downloads = [
    t("resources.downloads.handbook"),
    t("resources.downloads.checklist"),
    t("resources.downloads.guide")
  ];

  return (
    <div>
      <section className="gradient-primary py-20 lg:py-28">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            {t('resources.hero.title')}
          </motion.h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            {t('resources.hero.description')}
          </p>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="py-20">
        <div className="container mx-auto px-6">
          <SectionHeading badge={t('resources.blog.badge')} title={t('resources.blog.title')} description={t('resources.blog.description')} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, i) => (
              <motion.article key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-2xl bg-card shadow-card border border-border overflow-hidden group hover:shadow-elevated transition-all cursor-pointer">
                <div className="h-40 bg-muted flex items-center justify-center">
                  <BookOpen className="h-10 w-10 text-muted-foreground/40" />
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium gradient-primary text-primary-foreground mb-3">{post.category}</span>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{post.date}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-6">
          <SectionHeading badge={t('resources.gallery.badge')} title={t('resources.gallery.title')} />
          <GalleryCarousel />
        </div>
      </section>

      {/* Downloads */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <SectionHeading badge={t('resources.downloads.badge')} title={t('resources.downloads.title')} />
          <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {downloads.map((d, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3 rounded-xl bg-card p-5 shadow-card border border-border cursor-pointer hover:shadow-elevated transition-all">
                <Download className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground">{d}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-muted/50">
        <div className="container mx-auto px-6 max-w-3xl">
          <SectionHeading badge={t('resources.faq.badge')} title={t('resources.faq.title')} />
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="rounded-xl bg-card border border-border overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors">
                  <span className="font-medium text-foreground text-sm pr-4">{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section id="events" className="py-20">
        <div className="container mx-auto px-6">
          <SectionHeading badge={t('resources.events.badge')} title={t('resources.events.title')} description={t('resources.events.description')} />
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {events.map((e, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl bg-card p-6 shadow-card border border-border">
                <div className="flex items-center gap-2 text-xs text-primary font-medium mb-3">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{e.date}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{e.title}</h3>
                <p className="text-sm text-muted-foreground">{e.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resources;
