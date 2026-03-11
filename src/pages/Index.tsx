import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  GraduationCap, Users, Globe, Award, Compass, FileCheck, BookOpen,
  DollarSign, MapPin, ArrowRight, CheckCircle, Star, HelpCircle, Zap, Shield,
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import TestimonialSlider from "@/components/TestimonialSlider";
import GalleryCarousel from "@/components/GalleryCarousel";
import {
  getStatistics,
  getWhyChooseUs,
  getServices,
  getPartners,
  getBranches
} from "@/lib/api";

// Map icon name strings from DB to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users, GraduationCap, Globe, Award, Compass, FileCheck, BookOpen,
  DollarSign, MapPin, CheckCircle, Star, HelpCircle, Zap, Shield,
};

function getIcon(name: string): React.ComponentType<{ className?: string }> {
  return iconMap[name] || CheckCircle;
}

interface Stat { id: number; label: string; value: string; suffix: string; icon: string; }
interface WhyItem { id: number; title: string; description: string; icon: string; }
interface Service { id: number; title: string; description: string; icon: string; }
interface Partner { id: number; university_name: string; logo_url?: string; website_link?: string; }
interface Branch { id: number; branch_name: string; address: string; phone: string; }

// Simple animated number counter
function AnimatedNum({ end, suffix, label, Icon }: { end: number; suffix: string; label: string; Icon: React.FC<{ className?: string }> }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const duration = 1800;
        const step = Math.ceil(end / (duration / 16));
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(start);
        }, 16);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <div className="h-12 w-12 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground mb-3">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-3xl font-bold text-foreground">{count.toLocaleString()}{suffix}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [stats, setStats] = useState<Stat[]>([]);
  const [whyUs, setWhyUs] = useState<WhyItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    getStatistics().then(setStats).catch(() => { });
    getWhyChooseUs().then(setWhyUs).catch(() => { });
    getServices().then(setServices).catch(() => { });
    getPartners().then(setPartners).catch(() => { });
    getBranches().then(setBranches).catch(() => { });
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img src={heroBg} alt="Students celebrating" className="w-full h-full object-cover" />
          <div className="absolute inset-0 gradient-hero" />
        </motion.div>
        <motion.div style={{ opacity: heroOpacity }} className="relative container mx-auto px-6 py-24">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/20">
                Nepal's Trusted Educational Partner
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6"
            >
              We Inspire. We Guide.{" "}
              <span className="text-cyan">We Empower.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-primary-foreground/85 mb-8 leading-relaxed max-w-lg"
            >
              Your journey to world-class education begins here. Future Minds Educational Consultancy is your gateway to
              top universities across South Korea, UK, and Europe.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-7 py-3.5 text-sm font-semibold text-primary hover:bg-primary-foreground/90 transition-colors"
              >
                Get Appointment <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/study-abroad/south-korea"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-primary-foreground/30 px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
              >
                Explore Study Abroad
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats — dynamic from DB */}
      <section className="py-16 -mt-16 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-card rounded-2xl p-8 md:p-12 shadow-elevated">
            {stats.length > 0 ? stats.map((s) => {
              const Icon = getIcon(s.icon);
              return (
                <AnimatedNum key={s.id} end={parseInt(s.value) || 0} suffix={s.suffix} label={s.label} Icon={Icon} />
              );
            }) : (
              // Skeleton placeholders while loading
              [1, 2, 3, 4].map(i => (
                <div key={i} className="flex flex-col items-center text-center animate-pulse">
                  <div className="h-12 w-12 rounded-2xl bg-muted mb-3" />
                  <div className="h-8 w-20 bg-muted rounded mb-2" />
                  <div className="h-4 w-24 bg-muted rounded" />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us — dynamic from DB */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <SectionHeading
            badge="Why Choose Us"
            title="Your Success Is Our Mission"
            description="We combine expertise, technology, and personalized care to guide every student toward their dream university."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map((item, i) => {
              const Icon = getIcon(item.icon);
              return (
                <ServiceCard key={item.id} icon={Icon} title={item.title} description={item.description} delay={i * 0.08} />
              );
            })}
          </div>
        </div>
      </section>

      {/* Services — dynamic from DB */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-6">
          <SectionHeading badge="Our Services" title="Comprehensive Student Services" description="Everything you need for a successful academic journey abroad." />
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {services.map((s, i) => {
              const Icon = getIcon(s.icon);
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group flex flex-col items-center text-center p-6 rounded-2xl bg-card shadow-card border border-border hover:shadow-elevated transition-all"
                >
                  <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground mb-4 transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-2">{s.title}</h3>
                  <Link to="/services" className="text-xs text-primary font-medium hover:underline">Learn More</Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partner Universities — dynamic from DB */}
      <section className="py-20 overflow-hidden">
        <div className="container mx-auto px-6 mb-10">
          <SectionHeading badge="Our Partners" title="Partner Universities" description="We collaborate with top-ranked institutions across the globe." />
        </div>
        {partners.length > 0 && (
          <div className="relative">
            <div className="flex animate-scroll-x gap-6 w-max">
              {[...partners, ...partners].map((p, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-64 rounded-xl bg-card border border-border p-6 shadow-card hover:shadow-elevated transition-shadow"
                >
                  {p.logo_url ? (
                    <img src={p.logo_url} alt={p.university_name} className="h-8 object-contain mb-3" />
                  ) : (
                    <GraduationCap className="h-8 w-8 text-primary mb-3" />
                  )}
                  <p className="font-semibold text-sm text-foreground">{p.university_name}</p>
                  {p.website_link && (
                    <a href={p.website_link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 block">Visit website</a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Testimonials — dynamic from DB + submit form */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-6">
          <SectionHeading badge="Testimonials" title="What Our Students Say" description="Hear from students who achieved their dreams with Future Minds." />
          <TestimonialSlider />
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <SectionHeading badge="Gallery" title="Moments That Matter" description="A visual journey through our community of learners and achievers." />
          <GalleryCarousel />
        </div>
      </section>

      {/* Branches — dynamic from DB */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-6">
          <SectionHeading badge="Our Branches" title="Find Us Near You" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {branches.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl bg-card p-6 shadow-card border border-border hover:shadow-elevated transition-all"
              >
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground mb-4">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-foreground text-lg mb-1">{b.branch_name}</h3>
                <p className="text-sm text-muted-foreground mb-1">{b.address}</p>
                <p className="text-sm text-primary font-medium">{b.phone}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="rounded-3xl gradient-primary p-12 md:p-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4"
            >
              Ready to Begin Your Journey?
            </motion.h2>
            <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
              Take the first step toward your international education. Book a free consultation with our expert counsellors today.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-8 py-4 text-sm font-semibold text-primary hover:bg-primary-foreground/90 transition-colors"
            >
              Book Free Consultation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
