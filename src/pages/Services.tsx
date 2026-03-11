import { motion } from "framer-motion";
import { Compass, BookOpen, FileCheck, GraduationCap, DollarSign, ChevronDown } from "lucide-react";
import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";

const services = [
  { id: "career", icon: Compass, title: "Career Counselling", desc: "Expert guidance to help you choose the right course, university, and country based on your academic profile, interests, and career goals.", details: "Our experienced counsellors conduct in-depth assessments of your academic background, career aspirations, and personal preferences to recommend the best-fit programs and institutions. We provide personalized roadmaps covering timeline, requirements, and budget planning." },
  { id: "test", icon: BookOpen, title: "Test Preparation", desc: "Comprehensive coaching for IELTS, TOEFL, PTE, TOPIK, EPS-TOPIK, and KLPT with experienced instructors.", details: "State-of-the-art facilities, mock tests, and personalized feedback ensure you achieve your target score. Our classes include small batch sizes, flexible timings, and access to extensive practice materials. We track progress through regular assessments." },
  { id: "visa", icon: FileCheck, title: "Visa Processing", desc: "End-to-end visa application support with a 98% success rate across all destinations.", details: "From document preparation to interview coaching, our visa experts handle every aspect of the process. We maintain up-to-date knowledge of embassy requirements and immigration policies to ensure your application is flawless." },
  { id: "admission", icon: GraduationCap, title: "Admission Guidance", desc: "Complete support for university applications including SOP writing, document verification, and application tracking.", details: "We assist with selecting universities, preparing application materials, writing compelling statements of purpose, and managing deadlines. Our partnerships with 120+ universities often provide fast-track admission pathways." },
  { id: "finance", icon: DollarSign, title: "Finance Assistance", desc: "Guidance on scholarships, education loans, and financial planning for your study abroad journey.", details: "We help identify scholarship opportunities, prepare compelling scholarship applications, and connect students with trusted financial institutions for education loans. Our team assists with financial documentation required by embassies." },
];

const Services = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  
  return (
    <div>
      <section className="gradient-primary py-20 lg:py-28">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Our Services</motion.h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">Comprehensive support at every stage of your academic journey abroad.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <SectionHeading title="What We Offer" description="Each service is designed to address specific needs in your study abroad journey." />
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
