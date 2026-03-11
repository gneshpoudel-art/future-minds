import { motion } from "framer-motion";
import { useState } from "react";
import { Send, MapPin, Phone, Mail } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const Contact = () => {
  const [formType, setFormType] = useState<"inquiry" | "appointment">("inquiry");

  return (
    <div>
      <section className="gradient-primary py-20 lg:py-28">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Contact Us</motion.h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">Get in touch with our expert counsellors. We are here to help you every step of the way.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="flex gap-3 mb-8">
                {(["inquiry", "appointment"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFormType(t)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${formType === t ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                  >
                    {t === "inquiry" ? "General Inquiry" : "Book Appointment"}
                  </button>
                ))}
              </div>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                    <input name="fullName" type="text" required maxLength={100} className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                    <input name="email" type="email" required maxLength={255} className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="your@email.com" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
                    <input name="phone" type="tel" required maxLength={20} className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="+977-XXXXXXXXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {formType === "appointment" ? "Preferred Date" : "Subject"}
                    </label>
                    {formType === "appointment" ? (
                      <input name="preferredDate" type="date" required className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    ) : (
                      <input name="subject" type="text" required maxLength={200} className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="How can we help?" />
                    )}
                  </div>
                </div>
                {formType === "appointment" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Service Interested In</label>
                    <select name="service" required className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <option value="">Select a service</option>
                      <option value="career">Career Counselling</option>
                      <option value="test">Test Preparation</option>
                      <option value="visa">Visa Processing</option>
                      <option value="admission">Admission Guidance</option>
                      <option value="finance">Finance Assistance</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                  <textarea name="message" required maxLength={1000} rows={5} className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" placeholder="Tell us more..." />
                </div>
                <button type="submit" className="inline-flex items-center gap-2 gradient-primary text-primary-foreground rounded-xl px-8 py-3.5 font-semibold text-sm hover:opacity-90 transition-opacity">
                  <Send className="h-4 w-4" /> {formType === "appointment" ? "Book Appointment" : "Send Message"}
                </button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <SectionHeading title="Branch Contacts" centered={false} />
              {[
                { branch: "Banepa (Head Office)", phone: "+977-011-660123" },
                { branch: "Kathmandu", phone: "+977-01-4567890" },
                { branch: "Pokhara", phone: "+977-061-123456" },
                { branch: "Seoul", phone: "+82-2-1234-5678" },
              ].map((b, i) => (
                <div key={i} className="rounded-xl bg-card p-5 shadow-card border border-border">
                  <p className="font-semibold text-foreground text-sm mb-2">{b.branch}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                    <span>{b.phone}</span>
                  </div>
                </div>
              ))}

              <div className="rounded-xl bg-card p-5 shadow-card border border-border">
                <p className="font-semibold text-foreground text-sm mb-3">General Contact</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-primary" /><span>info@futureminds.edu.np</span></div>
                  <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" /><span>Banepa, Kavrepalanchok, Nepal</span></div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="rounded-xl bg-muted h-48 flex items-center justify-center border border-border">
                <p className="text-sm text-muted-foreground">Google Map Integration</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
