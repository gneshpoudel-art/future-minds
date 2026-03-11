import { motion } from "framer-motion";
import { BookOpen, Plane, Users, Heart, Building, Phone, Shield, GraduationCap } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const steps = [
  { icon: BookOpen, title: "Korean Language Training", desc: "Comprehensive language courses to prepare you for life and study in South Korea." },
  { icon: Plane, title: "Airport Pickup", desc: "Our Seoul team greets you at the airport and helps you settle in." },
  { icon: Users, title: "Orientation Program", desc: "Detailed orientation covering academics, culture, and daily life in Korea." },
  { icon: Heart, title: "Support Groups", desc: "Connect with fellow Nepali students through organized community groups." },
  { icon: Building, title: "Festival Organization", desc: "We organize cultural events and festivals to keep you connected to home." },
  { icon: Phone, title: "Seoul Office Support", desc: "Our Seoul branch provides ongoing administrative and personal support." },
  { icon: Shield, title: "Emergency Assistance", desc: "24/7 emergency support for any urgent situations." },
  { icon: GraduationCap, title: "University Mediation", desc: "We act as a bridge between you and your university for any academic concerns." },
];

const StudentCare = () => (
  <div>
    <section className="gradient-primary py-20 lg:py-28">
      <div className="container mx-auto px-6 text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Student Care System</motion.h1>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto">We do not just send students abroad. We support them every step of the way.</p>
      </div>
    </section>

    <section className="py-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <SectionHeading title="Your Journey With Us" description="A comprehensive care system from pre-departure to graduation." />
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
          
          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-5 md:pl-4"
              >
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground shrink-0 relative z-10">
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="pb-2">
                  <h3 className="font-semibold text-foreground text-lg mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default StudentCare;
