import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { API_URL } from "@/config/api";

export default function MemberProfile() {
  const { id } = useParams();
  const [member, setMember] = useState<any>(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/members/${id}`)
      .then(res => setMember(res.data));
  }, [id]);

  if (!member) return <div>Loading...</div>;

  return (
    <div className="min-h-screen">
    <Navbar />
    <PageBanner title="Member Profile" breadcrumb={`Members / ${member.name}`} />

      {/* Member Profile Section */}
      <section className="py-28 lg:px-8 bg-background text-foreground">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Image */}
            <div className="flex justify-center lg:justify-start">
              <img
                src={member.photo ? `${API_URL}${member.photo}` : "/placeholder-user.png"}
                alt={member.name}
                className="w-full max-w-sm h-96 lg:h-full lg:min-h-96 rounded-3xl object-cover shadow-lg"
              />
            </div>

            {/* Right Side - Content */}
            <div className="flex flex-col justify-center">
              {/* Label */}
              <span className="inline-flex items-center justify-center gold-gradient-bg text-black text-lg font-semibold uppercase tracking-wide px-4 py-1 rounded-full">
                Member
              </span>

              <br />

              {/* Name */}
              <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                {member.name}
              </h1>

              {/* Title */}
              <h2 className="text-xl font-semibold text-muted-foreground mb-6">
                {member.title || "Member of Sri Rajakeeya Padanama"}
              </h2>

              {/* Details Section */}
              <div className="space-y-6 mb-8">
                {/* Reg No */}
                <div className="flex items-baseline gap-3">
                  <span className="text-sm font-semibold text-muted-foreground min-w-fit">
                    Reg No:
                  </span>
                  <span className="text-lg font-semibold text-foreground">
                    {member.regNo}
                  </span>
                </div>

                {/* Membership Date */}
                <div className="flex items-baseline gap-3">
                  <span className="text-sm font-semibold text-muted-foreground min-w-fit">
                    Membership Date:
                  </span>
                  <span className="text-lg font-semibold text-foreground">
                    {member.memberSince || new Date().getFullYear()}
                  </span>
                </div>
              </div>

              {/* Description */}
              {/*<div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  Description
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground max-w-xl">
                  {member.description || "No description available"}
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>

  );
}