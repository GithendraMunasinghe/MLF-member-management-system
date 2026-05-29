import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import PageBanner from "@/components/PageBanner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/config/api";
import { set } from "date-fns";

interface Member {
  _id: string;
  name: string;
  regNo: number;
  photo: string;
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 24; // 24 cards per page
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
  const [searchQuery, setSearchQuery] = useState("");



  useEffect(() => {
    axios.get(`${API_URL}/api/members`)
      .then(res => {
        setMembers(res.data);
        setFilteredMembers(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setFilteredMembers(members);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = members.filter(member =>
        member.name.toLowerCase().includes(query) ||
        member.regNo.toString().includes(query)
      );
      setFilteredMembers(filtered);
    }
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageBanner title="Member Directory" breadcrumb="Members" />
        
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading subtitle="All Members" title="Our Members" />

          {/* Search Bar */}
          <div className="mb-10 flex flex-col sm:flex-row gap-3 justify-center">
            <div className="relative flex-1 max-w-md">
              <Input
                type="text"
                placeholder="Search by name or registration number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-12 pl-4 py-2.5 rounded-lg border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
            <Button
              onClick={handleSearch}
              className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg px-6 transition-all"
            >
              Search
            </Button>
            <Button
              onClick={() => {
                setSearchQuery("");
                setFilteredMembers(members);
                setCurrentPage(1);
              }}
              variant="outline"
              className="rounded-lg px-6"
            >
              Reset
            </Button>
          </div>

          {/* Results Count */}
          <div className="mb-6 text-center text-muted-foreground">
            {filteredMembers.length === 0 ? (
              <p className="text-red-500">No members found matching{searchQuery}</p>
            ) : (
              <p>Found {filteredMembers.length} member{filteredMembers.length !== 1 ? "s" : ""}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentMembers.map(member => (
            <Link to={`/members/${member._id}`} key={member._id}>
              <div className="bg-card border border-border hover:border-primary/30 backdrop-blur-md p-6 rounded-2xl hover:scale-105 transition duration-300 hover:shadow-lg">
                <img
                  src={member.photo ? `${API_URL}${member.photo}` : "/placeholder-user.png"}
                  alt={member.name}
                  className="w-32 h-32 object-cover rounded-full mx-auto"
                />
                <h2 className="text-center mt-4 text-xl font-semibold">
                  {member.name}
                </h2>
                <p className="text-center text-sm opacity-70">
                  Reg No: {member.regNo}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-10 gap-2 items-center">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          {Array.from({ length: Math.ceil(filteredMembers.length / membersPerPage) }, (_, i) => (
            <Button
              key={i + 1}
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredMembers.length / membersPerPage)))}
            disabled={currentPage === Math.ceil(filteredMembers.length / membersPerPage)}
          >
            Next
          </Button>
        </div>


        </div>
      </section>

      <Footer />
    </div>
  );
}