import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GraduationCap, FileCheck, Award, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const data: Record<string, {
  title: string; country: string; overview: string;
  universities: string[]; requirements: string[]; visaSteps: string[]; scholarships: string[];
}> = {
  "south-korea": {
    title: "Study in South Korea",
    country: "South Korea",
    overview: "South Korea is a global leader in technology, innovation, and education. Home to world-class universities and a vibrant culture, it offers affordable tuition, generous scholarships, and excellent career opportunities for international students.",
    universities: ["Seoul National University", "Yonsei University", "Korea University", "KAIST", "Hanyang University", "Kyung Hee University", "Chungnam National University", "Sungkyunkwan University"],
    requirements: ["High school diploma or equivalent", "Korean language proficiency (TOPIK Level 3+) or English proficiency (IELTS 5.5+)", "Statement of Purpose", "Letters of Recommendation", "Financial documentation", "Valid passport"],
    visaSteps: ["Receive university admission letter", "Prepare required documents", "Apply for D-2 student visa at Korean Embassy", "Attend visa interview if required", "Receive visa and prepare for departure"],
    scholarships: ["Korean Government Scholarship (KGSP)", "University-specific merit scholarships", "NIIED Scholarship Program", "Regional government scholarships"],
  },
  uk: {
    title: "Study in the United Kingdom",
    country: "United Kingdom",
    overview: "The UK is home to some of the world's oldest and most prestigious universities. With a rich academic tradition and globally recognized qualifications, studying in the UK opens doors to exceptional career prospects worldwide.",
    universities: ["University of London", "University of Manchester", "University of Edinburgh", "University of Leeds", "University of Birmingham", "King's College London"],
    requirements: ["Academic transcripts", "IELTS score of 6.0 or above", "Personal Statement", "References", "Proof of financial support", "Valid passport"],
    visaSteps: ["Receive CAS from university", "Complete online visa application", "Pay visa fee and immigration health surcharge", "Attend biometrics appointment", "Submit supporting documents"],
    scholarships: ["Chevening Scholarships", "Commonwealth Scholarships", "University-specific bursaries", "British Council scholarships"],
  },
  europe: {
    title: "Study in Europe",
    country: "Europe",
    overview: "Europe offers diverse, high-quality education often at low or zero tuition fees. From Germany's engineering excellence to France's art and culture, European universities provide world-class programs in a multicultural environment.",
    universities: ["TU Munich", "Sorbonne University", "University of Amsterdam", "ETH Zurich", "Politecnico di Milano", "University of Helsinki"],
    requirements: ["Academic transcripts", "Language proficiency (English or local language)", "Motivation letter", "CV/Resume", "Financial proof", "Valid passport"],
    visaSteps: ["Receive admission letter", "Apply for student visa at respective embassy", "Provide biometrics and documents", "Wait for visa processing", "Plan travel and accommodation"],
    scholarships: ["Erasmus Mundus", "DAAD Scholarships (Germany)", "Holland Scholarship (Netherlands)", "Swiss Government Excellence Scholarships"],
  },
};

const StudyAbroad = () => {
  const { country } = useParams<{ country: string }>();
  const info = data[country || "south-korea"];

  if (!info) return <div className="py-32 text-center text-muted-foreground">Destination not found.</div>;

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
          <SectionHeading badge="Universities" title={`Popular Universities in ${info.country}`} />
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
              <SectionHeading title="Admission Requirements" centered={false} />
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
              <SectionHeading title="Visa Process" centered={false} />
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
          <SectionHeading badge="Scholarships" title="Scholarship Opportunities" />
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
              Apply Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudyAbroad;
