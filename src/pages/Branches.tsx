import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const branches = [
  { city: "Kathmandu", address: "New Baneshwor, Kathmandu, Nepal", phone: "+977-01-4567890", email: "ktm@futureminds.edu.np", hours: "Sun-Fri: 9:00 AM - 5:00 PM", desc: "Our Kathmandu branch serves students from the capital region with comprehensive counselling and test preparation services." },
  { city: "Banepa (Head Office)", address: "Banepa, Kavrepalanchok, Nepal", phone: "+977-011-660123", email: "info@futureminds.edu.np", hours: "Sun-Fri: 9:00 AM - 5:00 PM", desc: "Our head office in Banepa is the heart of Future Minds operations, providing the full range of consultancy services." },
  { city: "Pokhara", address: "Lakeside, Pokhara, Nepal", phone: "+977-061-123456", email: "pokhara@futureminds.edu.np", hours: "Sun-Fri: 9:00 AM - 5:00 PM", desc: "Serving students from the western region of Nepal with personalized guidance and support." },
  { city: "Seoul", address: "Seoul, South Korea", phone: "+82-2-1234-5678", email: "seoul@futureminds.edu.np", hours: "Mon-Fri: 9:00 AM - 6:00 PM", desc: "Our international branch in Seoul provides post-arrival support, emergency assistance, and university mediation for students in South Korea." },
];

const Branches = () => (
  <div>
    <section className="gradient-primary py-20 lg:py-28">
      <div className="container mx-auto px-6 text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Our Branches</motion.h1>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto">Visit us at any of our four locations across Nepal and South Korea.</p>
      </div>
    </section>

    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-6">
          {branches.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl bg-card p-8 shadow-card border border-border">
              <h3 className="text-xl font-bold text-foreground mb-3">{b.city}</h3>
              <p className="text-sm text-muted-foreground mb-5">{b.desc}</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2.5"><MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span className="text-foreground">{b.address}</span></div>
                <div className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-primary shrink-0" /><span className="text-foreground">{b.phone}</span></div>
                <div className="flex items-center gap-2.5"><Mail className="h-4 w-4 text-primary shrink-0" /><span className="text-foreground">{b.email}</span></div>
                <div className="flex items-center gap-2.5"><Clock className="h-4 w-4 text-primary shrink-0" /><span className="text-foreground">{b.hours}</span></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Branches;
