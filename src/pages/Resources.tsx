import { motion } from "framer-motion";
import { ChevronDown, Download, Calendar, BookOpen } from "lucide-react";
import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import GalleryCarousel from "@/components/GalleryCarousel";

const faqs = [
  { q: "What countries can I study in through Future Minds?", a: "We currently facilitate admissions to South Korea, United Kingdom, and various European countries including Germany, France, Netherlands, and more." },
  { q: "What is the visa success rate?", a: "We maintain a 98% visa success rate across all destinations, thanks to our experienced visa processing team." },
  { q: "Do you offer scholarships?", a: "We guide students in finding and applying for scholarships including KGSP, Chevening, Erasmus Mundus, and university-specific awards." },
  { q: "How long does the admission process take?", a: "The timeline varies by destination, but typically 2-4 months from initial counselling to receiving an admission letter." },
  { q: "Do you provide post-arrival support?", a: "Yes, our Seoul branch provides comprehensive post-arrival support including airport pickup, orientation, and ongoing assistance." },
];

const blogPosts = [
  { title: "Top 10 Universities in South Korea for 2024", category: "Study Abroad", date: "Dec 15, 2024" },
  { title: "IELTS vs TOEFL: Which Test Should You Take?", category: "Test Prep", date: "Dec 10, 2024" },
  { title: "Complete Guide to Korean Student Visa", category: "Visa Guide", date: "Dec 5, 2024" },
  { title: "Scholarship Opportunities in Europe", category: "Scholarships", date: "Nov 28, 2024" },
  { title: "Life as a Nepali Student in Seoul", category: "Student Life", date: "Nov 20, 2024" },
  { title: "How to Write a Winning Statement of Purpose", category: "Admissions", date: "Nov 15, 2024" },
];

const Resources = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div>
      <section className="gradient-primary py-20 lg:py-28">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Resources</motion.h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">Explore our blog, gallery, FAQs, and downloadable resources.</p>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="py-20">
        <div className="container mx-auto px-6">
          <SectionHeading badge="Blog" title="Latest Articles" description="Stay informed with our latest insights and guides." />
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
          <SectionHeading badge="Gallery" title="Photo Gallery" />
          <GalleryCarousel />
        </div>
      </section>

      {/* Downloads */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <SectionHeading badge="Downloads" title="Downloadable Resources" />
          <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {["Student Handbook 2024", "Visa Checklist", "Scholarship Guide"].map((d, i) => (
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
          <SectionHeading badge="FAQs" title="Frequently Asked Questions" />
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
          <SectionHeading badge="Events" title="News & Events" description="Stay updated with our latest activities and announcements." />
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { title: "Education Fair 2025", date: "March 15, 2025", desc: "Join us at the annual education fair in Kathmandu." },
              { title: "IELTS Workshop", date: "March 22, 2025", desc: "Free IELTS preparation workshop at Banepa office." },
              { title: "Korea Info Session", date: "April 5, 2025", desc: "Everything you need to know about studying in South Korea." },
            ].map((e, i) => (
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
