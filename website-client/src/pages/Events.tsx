import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import SectionHeading from "@/components/SectionHeading";
import { Calendar, Clock, MapPin, Award } from "lucide-react";
import SectionHeadingtwo from "@/components/SectionHeadingtwo";

const upcomingEvents = [
  {
    title: "Maha Lankeshwara Excellencies Awards - 2026",
    image: "/images/03-screen.webp",
    date: "June 28, 2026",
    time: "9:00 AM – 1:00 PM",
    venue: "BMICH",
    awards: "100+ Awards",
    description: "At this awards ceremony, professionals and social workers who have made significant contributions to society are recognized. Honorary titles are awarded to distinguished individuals and honorary doctorate degrees are conferred by the American National Peace University.",
  },
  {
    title: "Maha Lankeshwara Gaurawa Prasada Abhisheka - 2026",
    image: "/images/gaurawa-prasada-screen.webp",
    date: "June 28, 2026",
    time: "2:00 PM – 6:00 PM",
    venue: "BMICH",
    awards: "100+ Awards",
    description: "An international-level event organized to honor professionals, social workers, and philanthropists who have rendered significant service to the country, the nation, and the world. Groups such as philanthropists, beauty artists, occult scientists, astrologers, and entrepreneurs will be recognized.",
  },
];

const pastEvents = [
  { title: "Vishwa Abhimanya Honorary Awards Ceremony 2026", date: "March 12, 2026", image: "/images/vishwa-abhimanya-02.webp" },
  { title: '"Sri Abhiman" Honorary Awards Ceremony 2025', date: "Dec 20, 2025", image: "/images/sri-abhiman-2025.webp" },
  { title: "International Peace Awards Night 2025", date: "May 9, 2025", image: "/images/hero-4.webp" },
  { title: "An awards ceremony was held on April 26, 2023.", date: "Apr 26, 2023", image: "/images/blog-13.jpg" },
  { title: "An awards ceremony was held on February 11, 2023.", date: "Feb 11, 2023", image: "/images/blog-14.jpg" },
  { title: "An awards ceremony was held on December 7, 2022.", date: "Dec 7, 2022", image: "/images/blog-15.jpg" },
];

const Events = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageBanner title="Events" breadcrumb="Events" />

      {/* Upcoming Events */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading subtitle="Coming Soon" title="Upcoming Events" />
          <div className="space-y-10">
            {upcomingEvents.map((event, i) => (
              <motion.div
                key={event.title}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-card border border-border rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover aspect-[16/10] lg:aspect-auto"
                />
                <div className="p-6 lg:p-8 flex flex-col justify-center">
                  <h3 className="text-xl text-[#f2f2f2] md:text-2xl font-bold mb-4">{event.title}</h3>
                  <p className="text-[#f2f2f2] text-sm leading-relaxed mb-6">{event.description}</p>
                  <div className="flex flex-wrap gap-3">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      <Calendar size={14} /> {event.date}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      <Clock size={14} /> {event.time}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      <MapPin size={14} /> {event.venue}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      <Award size={14} /> {event.awards}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeadingtwo subtitle="History" title="Past Events" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event, i) => (
              <motion.div
                key={event.title}
                className="group rounded-xl overflow-hidden bg-card border border-[#f2f2f2] hover:border-primary/30 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="overflow-hidden aspect-[16/10]">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <span className="text-primary text-xs font-medium uppercase tracking-wider">{event.date}</span>
                  <h3 className="font-semibold mt-2 text-sm text-[#f2f2f2] line-clamp-2">{event.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading subtitle="Watch" title="Our Special Videos" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "We are the only foundation that does not sell honorary titles for money.", id: "Efjw-JTUohU" },
              { title: 'The pride of the Lankan people — the "Lak Abhiman" Honorary Title Awards Ceremony', id: "YdSoAu_FHMY" },
              { title: '"Lak Abhiman" Honorary Awards Ceremony 2023', id: "Mz6QcxvHQds" },
            ].map((video, i) => (
              <motion.div
                key={video.id}
                className="rounded-xl overflow-hidden bg-card border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium line-clamp-2">{video.title}</p>
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

export default Events;
