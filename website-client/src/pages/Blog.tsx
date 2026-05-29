import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import SectionHeading from "@/components/SectionHeading";
import { ChevronLeft, ChevronRight } from "lucide-react";

const allPosts = [
  { title: "Our support for the Poson Dansala held on June 10.", image: "/images/blog-1.webp", date: "Jun 20, 2025", excerpt: "On June 10th, 300 kilograms of flour were donated from…" },
  { title: "Our foundation's model preschool for the village of Lihiniyawa…!", image: "/images/lihiniyawa-preschool-01.webp", date: "Jun 20, 2025", excerpt: "On January 10, 2025, the foundation established a model preschool…" },
  { title: "Our foundation's model preschool for the village of Moragala…!", image: "/images/moragala-preschool-01.webp", date: "Jun 20, 2025", excerpt: "On January 10, 2025, the foundation established a model preschool…" },
  { title: "Our foundation's model preschool for the village of Bambarella…!", image: "/images/blog-4.webp", date: "Jun 20, 2025", excerpt: "A New Chapter Begins... On January 10, 2025…" },
  { title: "School supplies were distributed to 25 children of Sambodhi Preschool.", image: "/images/Model-Preschools-2.webp", date: "Jun 20, 2025", excerpt: "Under the 'Lak Daru Diriya' project, on January 21, 2024…" },
  { title: "School supplies were provided to 51 Tamil sons and daughters in Hatton.", image: "/images/hatton-preschool.webp", date: "Jan 14, 2024", excerpt: "Under the 'Path to Reconciliation' project, on January 14, 2024…" },
  { title: "Free education provided to children of Yalagala Sarvodaya Pubudu Preschool.", image: "/images/yalagala-pubudu-01.webp", date: "Jan 09, 2024", excerpt: "Under the 'Lak Daru Diriya' project, on January 9, 2024…" },
  { title: 'A donation was made to the "GOD IS GOOD" Church.', image: "/images/blog-7.jpg", date: "Jun 20, 2025", excerpt: "On 31.12.2023, at the religious service organized by the 'GOD…" },
  { title: "Full sponsorship for science exhibition at Meegahathenna College.", image: "/images/blog-8.jpg", date: "Jun 20, 2025", excerpt: "On 24.11.2023, our foundation provided full sponsorship for the science…" },
  { title: "Support for National Youth Services Council's Youth Exchange Program.", image: "/images/blog-9.jpg", date: "Jun 20, 2025", excerpt: "For the 'Youth Exchange Program 2023' organized by the National…" },
  { title: "Support provided to a businessman in Naanneriya, Kurunegala.", image: "/images/blog-19.jpg", date: "Jun 20, 2025", excerpt: "Financial and advisory support was provided to help an entrepreneur…" },
  { title: "Rs. 250,000 sponsorship to Meegahathenna Central College.", image: "/images/blog-10.jpg", date: "Jun 20, 2025", excerpt: "A financial sponsorship of Rs. 250,000 was provided to help…" },
  { title: "Support for Esala Dansala in Bogahahena area.", image: "/images/blog-11.jpg", date: "Jun 20, 2025", excerpt: "On 2023.07.04, support was provided for the Esala Dansala…" },
  { title: "Donation to Poson Dan Sela in Yalagala village.", image: "/images/blog-12.jpg", date: "Jun 20, 2025", excerpt: "On June 4, 2023, a donation was made to support…" },
  { title: "An awards ceremony was held on April 26, 2023.", image: "/images/blog-13.jpg", date: "Jun 20, 2025", excerpt: "A grand awards ceremony was organized to recognize…" },
  { title: "An awards ceremony was held on February 11, 2023.", image: "/images/blog-14.jpg", date: "Jun 20, 2025", excerpt: "Distinguished social workers and community leaders were honored…" },
  { title: "Gifts distributed to 120 students from 12 Dhamma schools.", image: "/images/blog-16.jpg", date: "Jun 20, 2025", excerpt: "On 2023.08.04, gifts and supplies were distributed to students…" },
  { title: "75th National Independence Day celebration.", image: "/images/blog-17.jpg", date: "Jun 20, 2025", excerpt: "The 75th National Independence Day celebration was held on 2023.02.04…" },
];

const POSTS_PER_PAGE = 9;

const Blog = () => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const currentPosts = allPosts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageBanner title="Blog & News" breadcrumb="Blog" />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading subtitle="Stay Updated" title="Latest News" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPosts.map((post, i) => (
              <motion.article
                key={`${post.title}-${page}`}
                className="group rounded-xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="overflow-hidden aspect-[16/10]">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <span className="text-primary text-xs font-medium uppercase tracking-wider">{post.date}</span>
                  <h3 className="font-semibold mt-2 mb-2 line-clamp-2 text-[#f2f2f2] group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-[#D9D9D9] text-sm line-clamp-2">{post.excerpt}</p>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-12">

              {/* Previous Button */}
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`
                  flex items-center justify-center
                  w-10 h-10 rounded-xl
                  border transition-all duration-300
                  ${
                    page === 1
                      ? "bg-gray-500 border-gray-500 text-gray-300 cursor-not-allowed"
                      : `
                        bg-[#090909]
                        border-[#1f1f1f]
                        text-[#f2f2f2]
                        hover:border-[#d4af37]
                        hover:text-[#d4af37]
                        hover:-translate-y-[1px]
                      `
                  }
                `}
              >
                <ChevronLeft size={18} />
              </button>

              {/* Page Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`
                    w-10 h-10 rounded-xl
                    text-sm font-semibold
                    border transition-all duration-300
                    ${
                      p === page
                        ? `
                          text-[#090909]
                          border-transparent
                          shadow-[0_0_18px_rgba(212,175,55,0.35)]
                        `
                        : `
                          bg-[#090909]
                          border-[#1f1f1f]
                          text-[#f2f2f2]
                          hover:border-[#d4af37]
                          hover:text-[#d4af37]
                          hover:-translate-y-[1px]
                        `
                    }
                  `}
                  style={
                    p === page
                      ? {
                          background: `
                            linear-gradient(
                              135deg,
                              hsl(43, 90%, 55%) 0%,
                              hsl(38, 85%, 45%) 50%,
                              hsl(30, 80%, 35%) 100%
                            )
                          `,
                        }
                      : {}
                  }
                >
                  {p}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={`
                  flex items-center justify-center
                  w-10 h-10 rounded-xl
                  border transition-all duration-300
                  ${
                    page === totalPages
                      ? "bg-gray-500 border-gray-500 text-gray-300 cursor-not-allowed"
                      : `
                        bg-[#090909]
                        border-[#1f1f1f]
                        text-[#f2f2f2]
                        hover:border-[#d4af37]
                        hover:text-[#d4af37]
                        hover:-translate-y-[1px]
                      `
                  }
                `}
              >
                <ChevronRight size={18} />
              </button>

            </div>
          )}

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
