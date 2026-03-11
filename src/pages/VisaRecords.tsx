import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";
import SectionHeading from "@/components/SectionHeading";
import { Users } from "lucide-react";

const records = [
  { uni: "Seoul National University", count: 245 },
  { uni: "Yonsei University", count: 312 },
  { uni: "Korea University", count: 198 },
  { uni: "Hanyang University", count: 276 },
  { uni: "Kyung Hee University", count: 189 },
  { uni: "KAIST", count: 87 },
  { uni: "Chungnam National University", count: 354 },
  { uni: "Sungkyunkwan University", count: 156 },
  { uni: "University of London", count: 143 },
  { uni: "University of Manchester", count: 98 },
  { uni: "University of Edinburgh", count: 76 },
  { uni: "TU Munich", count: 64 },
  { uni: "University of Amsterdam", count: 52 },
  { uni: "Sorbonne University", count: 41 },
];

const VisaRecords = () => (
  <div>
    <section className="gradient-primary py-20 lg:py-28">
      <div className="container mx-auto px-6 text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Visa Success Records</motion.h1>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto">Our track record speaks for itself. Over 5,000 students successfully placed worldwide.</p>
      </div>
    </section>

    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <AnimatedCounter end={5000} suffix="+" label="Total Students" icon={<Users className="h-6 w-6" />} />
          <AnimatedCounter end={98} suffix="%" label="Success Rate" icon={<GraduationCap className="h-6 w-6" />} />
          <AnimatedCounter end={120} suffix="+" label="Universities" icon={<GraduationCap className="h-6 w-6" />} />
          <AnimatedCounter end={15} suffix="+" label="Countries" icon={<GraduationCap className="h-6 w-6" />} />
        </div>
      </div>
    </section>

    <section className="pb-20">
      <div className="container mx-auto px-6">
        <SectionHeading title="Students Sent by University" />
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

export default VisaRecords;
