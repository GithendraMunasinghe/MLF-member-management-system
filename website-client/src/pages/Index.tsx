import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Heart, BookOpen, Award, Star, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSlideshow from "@/components/HeroSlideshow";
import SectionHeading from "@/components/SectionHeading";
import SectionHeadingtwo from "@/components/SectionHeadingtwo";
import CounterCard from "@/components/CounterCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const blogPosts = [
  { title: "Our support for the Poson Dansala held on June 10.", image: "/images/blog-1.webp", date: "Jun 20, 2025" },
  { title: "Our foundation's model preschool for the village of Lihiniyawa…!", image: "/images/lihiniyawa-preschool-01.webp", date: "Jun 20, 2025" },
  { title: "Our foundation's model preschool for the village of Moragala…!", image: "/images/moragala-preschool-01.webp", date: "Jun 20, 2025" },
];

const testimonials = [
  {
    name: "Dr. Priyantha Fernando",
    role: "Community Leader",
    content: "Maha Lankeshwara Foundation has transformed our community through their unwavering commitment to social welfare. Their educational initiatives have given hope to countless children."
  },
  {
    name: "Mrs. Kumari Jayasinghe",
    role: "Parent",
    content: "The preschool program has been a blessing for our family. The quality of education and care provided is exceptional. Thank you for making a difference in our children's lives."
  },
  {
    name: "Mr. Roshan Perera",
    role: "Social Worker",
    content: "Working alongside Maha Lankeshwara Foundation has been an honor. Their dedication to humanitarian causes and community development is truly inspiring."
  },
  {
    name: "Prof. Nimali Gunawardena",
    role: "Educator",
    content: "The foundation's approach to education is holistic and impactful. They've successfully bridged gaps in rural education and created sustainable change."
  },
  {
    name: "Mr. Chaminda Silva",
    role: "Volunteer",
    content: "Being part of this organization has taught me the true meaning of service. Their projects touch lives in ways that create lasting positive change."
  },
  {
    name: "Mrs. Anura Rathnayake",
    role: "Beneficiary",
    content: "From the Poson Dansala to the award ceremonies, every initiative shows their genuine care for humanity. They are truly making the world a better place."
  }
];

const quickLinks = [
  { icon: Heart, label: "Social Welfare", desc: "Community development & charity programs", path: "/projects" },
  { icon: Award, label: "Award Ceremonies", desc: "Honoring outstanding social workers", path: "/events" },
  { icon: BookOpen, label: "Education", desc: "Preschools & educational support", path: "/projects" },
];

const Index = () => {
  return ( 
    <div className="min-h-screen">
      <Navbar />
      <HeroSlideshow />

      {/* Quick Links */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickLinks.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Link
                  to={item.path}
                  className="group block p-8 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                >
                  <item.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg text-[#f2f2f2] group-hover:text-primary font-bold mb-2">{item.label}</h3>
                  <p className="text-sm text-[#f2f2f2]">{item.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          
          {/* Top About Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-primary uppercase tracking-[0.2em] text-sm font-medium mb-3">
                Few words about us
              </p>

              <h2 className="text-3xl text-[#D9D9D9] md:text-4xl font-bold mb-6">
                What is <span className="gold-gradient-text">Maha Lankeshwara Foundation</span>?
              </h2>

              <p className="text-[#D9D9D9] leading-relaxed mb-6">
                Maha Lankeshwara Foundation is dedicated to building a modern and empowered Sri Lanka by enhancing the lifestyle of all Sri Lankans through the blend of advanced technology, national values, and the proud wisdom and heritage of our nation.
              </p>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
              >
                View More <ArrowRight size={18} />
              </Link>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute -inset-4 rounded-2xl gold-gradient-bg opacity-10 blur-3xl" />
              <img
                src="/images/about-preview.webp"
                alt="Foundation history"
                className="relative rounded-xl w-full object-cover aspect-[4/3]"
              />
            </motion.div>
          </div>

          {/* Counter Section Added Here */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <CounterCard
                end={3500}
                title="NUMBER OF MEMBERS"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <CounterCard
                end={200}
                title="SOCIAL WELFARE PROJECTS CARRIED OUT"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <CounterCard
                end={15}
                title="APPRECIATION CEREMONIES"
              />
            </motion.div>

          </div>
          {/* End Counter Section */}

        </div>
      </section>


      {/* Founder Message */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="order-2 lg:order-1 flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <div className="absolute -inset-2 rounded-full gold-gradient-bg opacity-30 blur-xl" />
                <img
                  src="/images/founder.webp"
                  alt="Prof. Dr. Chinthaka Saman Kumara"
                  className="relative rounded-full w-64 h-64 md:w-80 md:h-80 object-cover border-4 border-primary/30"
                />
                </div>
            </motion.div>
            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-primary uppercase tracking-[0.2em] text-sm font-medium mb-3">Founder & Director General</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                A Message to <span className="gold-gradient-text">Humanity</span>
              </h2>
              <blockquote className="text-muted-foreground leading-relaxed mb-4 italic border-l-2 border-primary/30 pl-4">
                "We have been entrusted with a great responsibility that is, to gift a beautiful world to future generations. We must fulfill that duty, no matter what."
              </blockquote>
              <p className="text-muted-foreground leading-relaxed mb-4 text-sm">
                Let us love one another. Let us make sacrifices for each other. Let us rid ourselves of jealousy, anger, and hatred and create a world filled with love and peace.
              </p>
              <p className="font-semibold gold-gradient-text text-lg">
                Prof. Dr. Chinthaka Saman Kumara
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Event */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeadingtwo subtitle="Upcoming" title="Featured Event" />
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="rounded-xl overflow-hidden">
              <img
                src="/images/03-screen.webp"
                alt="Maha Lankeshwara Excellencies Awards 2026"
                className="w-full h-full object-cover aspect-[16/10] border-4 border-primary/30"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">June 28, 2026</span>
              <h3 className="text-2xl text-[#D9D9D9] md:text-3xl font-bold mb-4">Maha Lankeshwara Excellencies Awards - 2026</h3>
              <p className="text-[#f2f2f2] leading-relaxed mb-6 text-sm">
                At this awards ceremony, professionals and social workers who have made significant contributions to society are recognized. Honorary titles are awarded to distinguished individuals and honorary doctorate degrees are conferred by the American National Peace University.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">BMICH</span>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">100+ Awards</span>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">9:00 AM</span>
              </div>
              <Link to="/events" className="mt-6 inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                View All Events <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading subtitle="What People Say" title="Testimonials" />
          
          <div className="relative max-w-4xl mx-auto">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="h-full"
                    >
                      <Card className="h-full bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="flex items-center mb-4">
                            <div className="flex text-primary mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current" />
                              ))}
                            </div>
                          </div>
                          
                          <blockquote className="text-[#FFF7CC] leading-relaxed mb-6 flex-grow">
                            "{testimonial.content}"
                          </blockquote>
                          
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                              <User className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-[#f2f2f2]">{testimonial.name}</p>
                              <p className="text-sm text-[#D9D9D9]">{testimonial.role}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              <CarouselPrevious className="left-4 bg-background/80 backdrop-blur-sm border-border hover:bg-primary hover:text-primary-foreground" />
              <CarouselNext className="right-4 bg-background/80 backdrop-blur-sm border-border hover:bg-primary hover:text-primary-foreground" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Latest Blog */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeadingtwo subtitle="Latest" title="News & Blog" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post, i) => (
              <motion.div
                key={post.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Link to="/blog" className="group block rounded-xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                  <div className="overflow-hidden aspect-[16/10]">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-primary text-xs font-medium uppercase tracking-wider">{post.date}</span>
                    <h3 className="font-semibold mt-2 line-clamp-2 text-[#f2f2f2] group-hover:text-primary transition-colors">{post.title}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/blog" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
              View All Posts <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
