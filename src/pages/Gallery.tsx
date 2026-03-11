import SectionHeading from "@/components/SectionHeading";
import GalleryCarousel from "@/components/GalleryCarousel";
import { motion } from "framer-motion";

const Gallery = () => (
  <div>
    <section className="gradient-primary py-20 lg:py-28">
      <div className="container mx-auto px-6 text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Gallery</motion.h1>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto">A visual journey through our students' experiences and achievements.</p>
      </div>
    </section>
    <section className="py-20">
      <div className="container mx-auto px-6">
        <SectionHeading title="Moments That Matter" description="Explore photos from events, campus visits, graduations, and more." />
        <GalleryCarousel />
      </div>
    </section>
  </div>
);

export default Gallery;
