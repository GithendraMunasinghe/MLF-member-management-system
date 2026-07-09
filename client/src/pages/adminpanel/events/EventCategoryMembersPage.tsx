import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { API_URL } from "@/config/api";
import Type1MembersTable from "./components/Type1MembersTable";
import Type2MembersTable from "./components/Type2MembersTable";

export default function EventCategoryMembersPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [loading, setLoading] = useState(false);
  const [membersLoading, setMembersLoading] = useState(false);

  const [members, setMembers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEvent = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/api/events/${eventId}`);

      setEvent(res.data);

      if (res.data.categories?.length > 0) {
        setSelectedCategory(res.data.categories[0]);
      }
    } catch (err) {
      console.error("Failed to fetch event", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembersByCategory = async () => {
    if (!eventId || !selectedCategory) return;

    try {
      setMembersLoading(true);

      const res = await axios.get(
        `${API_URL}/api/events/${eventId}/category/${encodeURIComponent(
          selectedCategory
        )}/members`
      );

      setMembers(res.data.members || []);
    } catch (err) {
      console.error("Failed to fetch category members", err);
    } finally {
      setMembersLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    fetchMembersByCategory();
  }, [eventId, selectedCategory]);

  const filteredMembers = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) return members;

    return members.filter((member) => {
      return JSON.stringify(member).toLowerCase().includes(keyword);
    });
  }, [members, searchTerm]);

  const isType1 = event?.organizationType === "Foundation";
  const isType2 = event?.organizationType === "IBDF";

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 text-center text-gray-500">
        Loading event details...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 text-center text-gray-500">
        Event not found.
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0 flex flex-col bg-white rounded-xl p-6 border border-gray-200 overflow-hidden">
      <div className="flex items-start gap-10 mb-6">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mt-1"
        >
          <ArrowLeft size={16} />
          Back
        </Button>

        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {event.name}
          </h1>

          <p className="text-sm text-gray-500 -mt-1">
            {event.organizationId?.name || "No Organization"}
            {event.date &&
              ` • ${new Date(event.date).toLocaleDateString()}`}
          </p>
        </div>
      </div>

      <div className="border-b border-gray-300 mb-8 pb-3">
        <div className="flex gap-2 overflow-x-auto">
          {event.categories?.map((category: string) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setSearchTerm("");
              }}
              className={`px-5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-[#1c1c1c] text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-100 hover:text-black"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search member..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Button className="bg-green-600 hover:bg-green-700 text-white">
          Download Excel
        </Button>
      </div>

      {isType1 && (
        <Type1MembersTable
          members={filteredMembers}
          loading={membersLoading}
        />
      )}

      {isType2 && (
        <Type2MembersTable
          members={filteredMembers}
          loading={membersLoading}
        />
      )}
    </div>
  );
}