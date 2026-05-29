import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import SectionHeading from "@/components/SectionHeading";
import { School, HandHeart, Award, BookOpen } from "lucide-react";

const projects = [
  {
    icon: School,
    title: "Model Preschools",
    description: "Establishing model preschools in villages including Lihiniyawa, Moragala, and Bambarella, providing free quality education to underprivileged children.",
    images: ["/images/Model-Preschools-1.webp", "/images/Model-Preschools-2.webp"],
  },
  {
    icon: BookOpen,
    title: "Lak Daru Diriya – Educational Support",
    description: "Under the 'Lak Daru Diriya' project, school supplies have been distributed to hundreds of children. Free education is provided to preschool children across multiple villages.",
    images: ["/images/lakdaru-diriya-01.webp", "/images/blog-6-2.webp"],
  },
  {
    icon: HandHeart,
    title: "Path to Reconciliation",
    description: "Under the 'Path to Reconciliation' project, school supplies were provided to Tamil children in the Hatton area, bridging communities through education.",
    images: ["/images/Path to Reconciliation.webp",],
  },
  {
    icon: Award,
    title: "Honorary Award Ceremonies",
    description: "Recognizing social workers and professionals through various honorary award ceremonies and business award events, both locally and internationally.",
    images: ["/images/blog-13.jpg", "/images/blog-14.jpg", "/images/blog-15.jpg"],
  },
  {
    icon: HandHeart,
    title: "Community Support Programs",
    description: "Supporting religious and community events including Dansala sponsorships, financial aid to schools, and support for entrepreneurs in rural areas.",
    images: ["/images/blog-7.jpg", "/images/blog-10.jpg", "/images/blog-19.jpg"],
  },
];

const Projects = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageBanner title="Projects & Initiatives" breadcrumb="Projects" />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            subtitle="Our Works"
            title="Community Projects"
            description="Showcasing our ongoing community development projects and initiatives aimed at uplifting lives across Sri Lanka."
          />

          <div className="space-y-16">
            {projects.map((project, i) => (
              <motion.div
                key={project.title}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${
                  i % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <project.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                </div>
                <div className={`grid ${project.images.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-3 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  {project.images.slice(0, 2).map((img, j) => (
                    <div key={j} className="relative rounded-xl overflow-hidden aspect-[4/3]">
                      <img src={img} alt={project.title} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Projects;
