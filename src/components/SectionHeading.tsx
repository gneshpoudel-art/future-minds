import { motion } from "framer-motion";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  centered?: boolean;
}

const SectionHeading = ({ badge, title, description, centered = true }: SectionHeadingProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className={`mb-12 ${centered ? "text-center" : ""}`}
  >
    {badge && (
      <span className="inline-block mb-3 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider gradient-primary text-primary-foreground">
        {badge}
      </span>
    )}
    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">{title}</h2>
    {description && (
      <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">{description}</p>
    )}
  </motion.div>
);

export default SectionHeading;
