import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import SectionHeading from "@/components/SectionHeading";
import { Target, Eye, Heart, Globe, Award, Users } from "lucide-react";
import SectionHeadingtwo from "@/components/SectionHeadingtwo";

const objectives = [
  { icon: Users, text: "To organize welfare programs by bringing members together." },
  { icon: Heart, text: "To launch various projects for the welfare of Sri Lankan children." },
  { icon: Target, text: "To launch projects to uplift the poor." },
  { icon: Globe, text: "To organize local and foreign pilgrimages." },
  { icon: Award, text: "To organize award ceremonies and confer honorary titles." },
];

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageBanner title="About Us" breadcrumb="About" />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our <span className="gold-gradient-text">Story</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
                <p>The roots of our foundation trace back to 2012, when our founder and Director General, the esteemed Prof. Dr. Chinthaka Saman Kumara, began engaging in social welfare activities after completing his school education and pursuing higher education. One of his earliest community service initiatives was donating a computer to Sri Gunarathana Dhamma School, operated by the Sri Pushparama Temple in Yalagala village.</p>
                <p>His dedication did not stop there. While serving through the National Youth Services Council, he launched numerous technical workshops and social welfare initiatives in collaboration with government institutions, including the Ministry of Science and Technology. With the vision of expanding and streamlining these efforts, a new organization was officially formed in 2015.</p>
                <p>In 2018, our founder gained the opportunity to contribute to the “National Language Equality Improvement Project,” an international Canadian initiative implemented in Sri Lanka. Inspired by the global perspective and social welfare approaches experienced through this project, he strengthened his commitment to serving the nation by creating a platform focused on empowering Sri Lankan society through innovation, knowledge, and national heritage.</p>
                <p>Today, Maha Lankeshwara Foundation stands as a growing national-level organization dedicated to enhancing the lifestyle of all Sri Lankans by blending modern technology with the wisdom, values, and proud historical heritage of our nation. Through continuous social welfare activities, educational initiatives, and technological empowerment, we continue moving forward with international vision and national pride.</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-2xl gold-gradient-bg opacity-15 blur-2xl" />
                <img
                  src="/images/about-us-main-image.webp"
                  alt="Organization History"
                  className="relative rounded-xl w-full object-cover aspect-[4/3]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeadingtwo subtitle="Our Purpose" title="Main Objectives" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((obj, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <obj.icon className="w-8 h-8 text-primary mb-3" />
                <p className="text-sm text-[#f2f2f2] leading-relaxed">{obj.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="p-8 rounded-xl bg-card border border-border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Eye className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4 gold-gradient-text">Our Vision</h3>
              <p className="text-[#D9D9D9] leading-relaxed">
                Building a modern, empowered, and prosperous future by uplifting lifestyles through innovation and Sri Lankan heritage.
              </p>
            </motion.div>
            <motion.div
              className="p-8 rounded-xl bg-card border border-border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <Target className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4 gold-gradient-text">Our Mission</h3>
              <p className="text-[#D9D9D9] leading-relaxed">
                Empowering communities through innovation, social welfare, and the proud heritage of Sri Lanka to create a better future for all.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute -inset-2 rounded-full gold-gradient-bg opacity-25 blur-xl" />
                <img
                  src="/images/founder.webp"
                  alt="Prof. Dr. Chinthaka Saman Kumara"
                  className="relative rounded-full w-64 h-64 md:w-80 md:h-80 object-cover border-4 border-primary/30"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-primary uppercase tracking-[0.2em] text-sm font-medium mb-3">Founder & Director General</p>
              <h2 className="text-3xl font-bold mb-6 gold-gradient-text">Prof. Dr. Chinthaka Saman Kumara</h2>
              <div className="space-y-4 text-[#f2f2f2] leading-relaxed text-sm">
                <p className="italic border-l-2 border-primary/30 pl-4">
                  "We have been entrusted with a great responsibility, that is, to gift a beautiful world to future generations. We must fulfill that duty, no matter what."
                </p>
                <p>Nature has already provided us with a beautiful world. We should not destroy it. Humanity is the most precious gift we have received. Yet, even that gift is being destroyed.</p>
                <p>Let us love one another. Let us make sacrifices for each other. Let us rid ourselves of jealousy, anger, and hatred and create a world filled with love and peace. Through that, we can easily bring forth a developed world upon this very Earth.</p>
                <p>Come, dear people, join hands. Let us unite with the Maha Lankeshwara Foundation and build a day where everyone is crowned and reigns with dignity.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
