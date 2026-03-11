import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

const ServiceCard = ({ icon: Icon, title, description, delay = 0 }: ServiceCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -6 }}
    className="group relative rounded-2xl bg-card p-7 shadow-card border border-border hover:shadow-elevated transition-all duration-300"
  >
    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-primary text-primary-foreground transition-transform group-hover:scale-110">
      <Icon className="h-5 w-5" />
    </div>
    <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
  </motion.div>
);

export default ServiceCard;
