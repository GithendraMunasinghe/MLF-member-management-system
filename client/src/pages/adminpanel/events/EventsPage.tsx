import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash } from "lucide-react";
import { API_URL } from "@/config/api";
import AddEventModal from "@/components/adminpanel/modals/AddEventModal";
import EditEventModal from "@/components/adminpanel/modals/EditEventModal";
import DeleteEventModal from "@/components/adminpanel/modals/DeleteEventModal";
import { useToast } from "@/components/ui/use-toast";

interface Organization {
  _id: string;
  name: string;
}

interface EventItem {
  _id: string;
  name: string;
  date?: string;
  description?: string;
  logo?: string;
  organizationId?: Organization;
  memberCount: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  
  const { toast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/api/events`);
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = useMemo(() => {
    return events
      .filter((event) => {
        if (!event.date) return true;

        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);

        return eventDate >= today;
      })
      .sort(
        (a, b) =>
          new Date(a.date || "").getTime() -
          new Date(b.date || "").getTime()
      );
  }, [events]);

  const pastEvents = useMemo(() => {
    return events
      .filter((event) => {
        if (!event.date) return false;

        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);

        return eventDate < today;
      })
      .sort(
        (a, b) =>
          new Date(b.date || "").getTime() -
          new Date(a.date || "").getTime()
      );
  }, [events]);

  const getLogoUrl = (logo?: string) => {
    if (!logo) return null;
    return `${API_URL}${logo}`;
  };

  const visibleEvents =
    activeTab === "upcoming" ? upcomingEvents : pastEvents;

  const openEditModal = (event: EventItem) => {
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  const openDeleteModal = (event: EventItem) => {
  setSelectedEvent(event);
  setShowDeleteModal(true);
};

const handleDeleteEvent = async () => {
  if (!selectedEvent) return;

  try {
    setDeleting(true);

    await axios.delete(`${API_URL}/api/events/${selectedEvent._id}`);

    setEvents((prev) =>
      prev.filter((event) => event._id !== selectedEvent._id)
    );

    toast({
      title: "Deleted",
      description: "Event deleted successfully.",
      variant: "success",
    });

    setShowDeleteModal(false);
    setSelectedEvent(null);
  } catch (err: any) {
    toast({
      title: "Delete failed",
      description:
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to delete event.",
      variant: "destructive",
    });
  } finally {
    setDeleting(false);
  }
};

  return (
    <>
      <div className="flex-1 flex flex-col bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between border-b border-gray-300 mb-8">
          <div className="flex">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-5 py-2 text-sm font-medium border-b-2 ${
                activeTab === "upcoming"
                  ? "bg-gray-200 border-black text-black"
                  : "border-transparent text-gray-600"
              }`}
            >
              UPCOMING EVENTS
            </button>

            <button
              onClick={() => setActiveTab("past")}
              className={`px-5 py-2 text-sm font-medium border-b-2 ${
                activeTab === "past"
                  ? "bg-gray-200 border-black text-black"
                  : "border-transparent text-gray-600"
              }`}
            >
              Past Events
            </button>
          </div>
        </div>

        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-700">
              {activeTab === "upcoming" ? "Upcoming Events" : "Past Events"}
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              {visibleEvents.length.toString().padStart(2, "0")} Events
            </p>
          </div>

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} />
            Create New Event
          </Button>
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-500">
            Loading events...
          </div>
        ) : activeTab === "upcoming" ? (
          upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {upcomingEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col items-center text-center"
                >
                  <div className="w-32 h-32 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden mb-4">
                    {getLogoUrl(event.logo) ? (
                      <img
                        src={getLogoUrl(event.logo) || ""}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-semibold text-gray-400">
                        {event.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-semibold text-gray-800">
                    {event.name}
                  </h2>

                  <span className="mt-3 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {event.organizationId?.name || "No Organization"}
                  </span>

                  <p className="text-sm text-gray-600 mt-3">
                    Event Date :{" "}
                    <span className="font-medium text-gray-800">
                      {event.date ? new Date(event.date).toLocaleDateString() : "-"}
                    </span>
                  </p>

                  <p className="text-sm text-gray-800 mt-2">
                    No. of members : {event.memberCount || 0}
                  </p>

                  <div className="flex items-center justify-center gap-3 mt-5">
                    <Button
                      size="icon"
                      className="bg-green-500 hover:bg-green-600 text-white h-9 w-9"
                      onClick={() => openEditModal(event)}
                    >
                      <Pencil size={16} />
                    </Button>

                    <Button
                      size="icon"
                      className="bg-red-500 hover:bg-red-600 text-white h-9 w-9"
                      onClick={() => openDeleteModal(event)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-gray-500 italic">
              No upcoming events found.
            </div>
          )
        ) : pastEvents.length > 0 ? (
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#F2F2F2]">
                <th className="px-6 py-3 border-b font-medium">Sub. No.</th>
                <th className="px-6 py-3 border-b font-medium">Name</th>
                <th className="px-6 py-3 border-b font-medium">Date</th>
                <th className="px-6 py-3 border-b font-medium">
                  No. of Customers
                </th>
                <th className="px-6 py-3 border-b font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {pastEvents.map((event, index) => (
                <tr key={event._id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 border-b">
                    {(index + 1).toString().padStart(3, "0")}
                  </td>

                  <td className="px-6 py-3 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-gray-100 overflow-hidden border">
                        {getLogoUrl(event.logo) && (
                          <img
                            src={getLogoUrl(event.logo) || ""}
                            alt={event.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <span>{event.name}</span>
                    </div>
                  </td>

                  <td className="px-6 py-3 border-b">
                    {event.date
                      ? new Date(event.date).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="px-6 py-3 border-b">
                    {event.memberCount || 0}
                  </td>

                  <td className="px-6 py-3 border-b">
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        className="bg-green-500 hover:bg-green-600 text-white h-8 w-8"
                        onClick={() => openEditModal(event)}
                      >
                        <Pencil size={14} />
                      </Button>

                      <Button
                        size="icon"
                        className="bg-red-500 hover:bg-red-600 text-white h-8 w-8"
                        onClick={() => openDeleteModal(event)}
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-10 text-center text-gray-500 italic">
            No past events found.
          </div>
        )}
      </div>

      {showAddModal && (
        <AddEventModal
          onClose={() => setShowAddModal(false)}
          onCreated={fetchEvents}
        />
      )}

      {showEditModal && selectedEvent && (
        <EditEventModal
          event={selectedEvent}
          onClose={() => {
            setShowEditModal(false);
            setSelectedEvent(null);
          }}
          onUpdated={fetchEvents}
        />
      )}

      {showDeleteModal && selectedEvent && (
        <DeleteEventModal
            onClose={() => {
            setShowDeleteModal(false);
            setSelectedEvent(null);
            }}
            onConfirm={handleDeleteEvent}
            loading={deleting}
        />
        )}
    </>
  );
}