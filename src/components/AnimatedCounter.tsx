import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  label: string;
  icon: React.ReactNode;
}

const AnimatedCounter = ({ end, duration = 2, suffix = "", label, icon }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl gradient-primary text-primary-foreground mb-4">
        {icon}
      </div>
      <div className="text-4xl font-bold gradient-text mb-1">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </motion.div>
  );
};

export default AnimatedCounter;
