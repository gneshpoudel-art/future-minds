import SectionHeading from "@/components/SectionHeading";
import GalleryCarousel from "@/components/GalleryCarousel";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const Gallery = () => {
  const { t } = useLanguage();
  return (
    <div>
      <section className="gradient-primary py-20 lg:py-28">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            {t('gallery.hero.title')}
          </motion.h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            {t('gallery.hero.description')}
          </p>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto px-6">
          <SectionHeading title={t('gallery.main.title')} description={t('gallery.main.description')} />
          <GalleryCarousel />
        </div>
      </section>
    </div>
  );
};

export default Gallery;
