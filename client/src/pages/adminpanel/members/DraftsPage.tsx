import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Pencil, RefreshCcw } from "lucide-react";

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

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchDrafts = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:5000/api/members/drafts/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDrafts(res.data);
    } catch (err) {
      console.error("Failed to fetch drafts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

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
            ) : drafts.length > 0 ? (
              drafts.map((draft) => (
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
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-6 text-center text-gray-500 italic"
                >
                  No draft members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}