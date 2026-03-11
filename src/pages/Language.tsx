import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeading from "@/components/SectionHeading";

const courses = [
  { id: "ielts", title: "IELTS", desc: "International English Language Testing System. Accepted by universities, employers, and immigration authorities worldwide.", duration: "6-8 weeks", fee: "Contact us" },
  { id: "toefl", title: "TOEFL", desc: "Test of English as a Foreign Language. Required by many North American and international institutions.", duration: "6-8 weeks", fee: "Contact us" },
  { id: "pte", title: "PTE Academic", desc: "Pearson Test of English Academic. Computer-based test accepted by thousands of institutions globally.", duration: "4-6 weeks", fee: "Contact us" },
  { id: "korean", title: "EPS-TOPIK", desc: "Employment Permit System Test of Proficiency in Korean. Required for workers seeking employment in South Korea.", duration: "3-6 months", fee: "Contact us" },
  { id: "klpt", title: "KLPT", desc: "Korean Language Proficiency Test for evaluating Korean language skills of non-native speakers.", duration: "3-6 months", fee: "Contact us" },
  { id: "topik", title: "TOPIK", desc: "Test of Proficiency in Korean for academic purposes. Required for university admission in South Korea.", duration: "3-6 months", fee: "Contact us" },
];

const Language = () => (
  <div>
    <section className="gradient-primary py-20 lg:py-28">
      <div className="container mx-auto px-6 text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Language Courses</motion.h1>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto">Master the language skills needed for your academic and professional goals.</p>
      </div>
    </section>

    <section className="py-20">
      <div className="container mx-auto px-6">
        <SectionHeading title="Our Language Programs" description="Expert-led courses designed for success." />
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
                <span>Duration: {c.duration}</span>
                <span>{c.fee}</span>
              </div>
              <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                Enroll Now <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Language;
