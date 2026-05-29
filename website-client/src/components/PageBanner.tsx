import { motion } from "framer-motion";

interface PageBannerProps {
  title: string;
  breadcrumb: string;
}

const PageBanner = ({ title, breadcrumb }: PageBannerProps) => {
  return (
    <section className="relative pt-20 bg-secondary">
      <div className="h-48 md:h-56 flex flex-col items-center justify-center text-center px-4">
        <motion.h1
          className="text-3xl md:text-5xl font-bold gold-gradient-text mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h1>
        <motion.p
          className="text-[#f2f2f2] text-sm uppercase tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Home &gt; {breadcrumb}
        </motion.p>
        <motion.div
          className="w-16 h-0.5 gold-gradient-bg mt-4"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        />
      </div>
    </section>
  );
};

export default PageBanner;
