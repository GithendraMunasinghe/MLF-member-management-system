import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Pencil, RefreshCcw, Trash } from "lucide-react";

interface DraftMember {
  _id: string;
  regNo?: string;
  organizationType?: string;
  formType?: string;
  personalInfo?: {
    fullName?: string;
    nicNumber?: string;
  };
  coordinatorId?: {
    name?: string;
  };
  eventId?: {
    name?: string;
  };
  updatedAt: string;
}

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<DraftMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const draftsPerPage = 12;

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchDrafts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/api/members/drafts/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const sortedDrafts = res.data.sort(
        (a: DraftMember, b: DraftMember) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      setDrafts(sortedDrafts);
    } catch (err) {
      console.error("Failed to fetch drafts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDraft = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this draft?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      await axios.delete(`http://localhost:5000/api/members/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDrafts((prev) => prev.filter((draft) => draft._id !== id));
    } catch (err) {
      console.error("Failed to delete draft", err);
      alert("Failed to delete draft.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const totalPages = Math.ceil(drafts.length / draftsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedDrafts = useMemo(() => {
    const startIndex = (currentPage - 1) * draftsPerPage;

    return drafts.slice(startIndex, startIndex + draftsPerPage);
  }, [drafts, currentPage]);

  return (
    <div className="flex-1 flex flex-col bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-700">
            Draft Members
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Continue incomplete member registrations.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={fetchDrafts}
          className="flex items-center gap-2"
        >
          <RefreshCcw size={16} />
          Refresh
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-[#F2F2F2]">
              <th className="px-6 py-3 border-b font-medium">Name</th>
              <th className="px-6 py-3 border-b font-medium">Reg No</th>
              <th className="px-6 py-3 border-b font-medium">Organization</th>
              <th className="px-6 py-3 border-b font-medium">Event</th>
              <th className="px-6 py-3 border-b font-medium">Coordinator</th>
              <th className="px-6 py-3 border-b font-medium">Last Updated</th>
              <th className="px-6 py-3 border-b font-medium">Status</th>
              <th className="px-6 py-3 border-b font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-6 text-center text-gray-500">
                  Loading drafts...
                </td>
              </tr>
            ) : paginatedDrafts.length > 0 ? (
              paginatedDrafts.map((draft) => (
                <tr key={draft._id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 border-b">
                    {draft.personalInfo?.fullName || "Not entered"}
                  </td>

                  <td className="px-6 py-3 border-b">
                    {draft.regNo || "Not entered"}
                  </td>

                  <td className="px-6 py-3 border-b">
                    {draft.organizationType || "Not selected"}
                  </td>

                  <td className="px-6 py-3 border-b">
                    {draft.eventId?.name || "Not selected"}
                  </td>

                  <td className="px-6 py-3 border-b">
                    {draft.coordinatorId?.name || "Not selected"}
                  </td>

                  <td className="px-6 py-3 border-b">
                    {new Date(draft.updatedAt).toLocaleString()}
                  </td>

                  <td className="px-6 py-3 border-b">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                      Draft
                    </span>
                  </td>

                  <td className="px-6 py-3 border-b">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                        onClick={() =>
                          navigate(`/admin-dashboard/add-member/${draft._id}`)
                        }
                      >
                        <Pencil size={14} />
                        Continue
                      </Button>

                      <Button
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
                        disabled={deletingId === draft._id}
                        onClick={() => handleDeleteDraft(draft._id)}
                      >
                        <Trash size={14} />
                        {deletingId === draft._id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-6 text-center text-gray-500 italic">
                  No draft members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 px-2">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * draftsPerPage + 1} to{" "}
            {Math.min(currentPage * draftsPerPage, drafts.length)} of{" "}
            {drafts.length} drafts
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </Button>

            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 rounded-lg text-sm font-medium transition ${
                    currentPage === page
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}