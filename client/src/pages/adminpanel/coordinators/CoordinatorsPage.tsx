import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash } from "lucide-react";
import { API_URL } from "@/config/api";
import AddCoordinatorModal from "@/components/adminpanel/modals/AddCoordinatorModal";
import EditCoordinatorModal from "@/components/adminpanel/modals/EditCoordinatorModal";
import DeleteCoordinatorModal from "@/components/adminpanel/modals/DeleteCoordinatorModal";
import { useToast } from "@/components/ui/use-toast";

interface Coordinator {
  _id: string;
  name: string;
  coordinatorId: string;
  phoneNumber?: string;
  photo?: string;
  customerCount: number;
}

export default function CoordinatorsPage() {
  const { toast } = useToast();

  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedCoordinator, setSelectedCoordinator] =
    useState<Coordinator | null>(null);

  const [deleting, setDeleting] = useState(false);

  const fetchCoordinators = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/api/coordinators`);
      setCoordinators(res.data);
    } catch (err) {
      console.error("Failed to fetch coordinators", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoordinators();
  }, []);

  const getPhotoUrl = (photo?: string) => {
    if (!photo) return null;
    return `${API_URL}${photo}`;
  };

  const openEditModal = (coordinator: Coordinator) => {
    setSelectedCoordinator(coordinator);
    setShowEditModal(true);
  };

  const openDeleteModal = (coordinator: Coordinator) => {
    setSelectedCoordinator(coordinator);
    setShowDeleteModal(true);
  };

  const handleDeleteCoordinator = async () => {
    if (!selectedCoordinator) return;

    try {
      setDeleting(true);

      await axios.delete(
        `${API_URL}/api/coordinators/${selectedCoordinator._id}`
      );

      setCoordinators((prev) =>
        prev.filter((coord) => coord._id !== selectedCoordinator._id)
      );

      toast({
        title: "Deleted",
        description: "Coordinator deleted successfully.",
        variant: "success",
      });

      setShowDeleteModal(false);
      setSelectedCoordinator(null);
    } catch (err: any) {
      console.error("Failed to delete coordinator", err);

      toast({
        title: "Delete failed",
        description:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to delete coordinator.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-700">
              All Coordinators
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              {coordinators.length.toString().padStart(2, "0")} coordinators
            </p>
          </div>

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} />
            Add New Coordinator
          </Button>
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-500">
            Loading coordinators...
          </div>
        ) : coordinators.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {coordinators.map((coord) => (
              <div
                key={coord._id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col items-center text-center"
              >
                <div className="w-28 h-28 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden mb-4">
                  {getPhotoUrl(coord.photo) ? (
                    <img
                      src={getPhotoUrl(coord.photo) || ""}
                      alt={coord.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-semibold text-gray-400">
                      {coord.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-semibold text-gray-800">
                  {coord.name}
                </h2>

                <p className="text-sm text-gray-600 mt-2">
                  ID: {coord.coordinatorId}
                </p>

                <p className="text-sm text-gray-600 mt-2">
                  Phone No. : {coord.phoneNumber || "-"}
                </p>

                <p className="text-sm text-gray-800 font-semibold mt-2">
                  No. of Customers : {coord.customerCount || 0}
                </p>

                <div className="flex items-center justify-center gap-3 mt-5">
                  <Button
                    size="icon"
                    className="bg-green-500 hover:bg-green-600 text-white h-9 w-9"
                    onClick={() => openEditModal(coord)}
                  >
                    <Pencil size={16} />
                  </Button>

                  <Button
                    size="icon"
                    className="bg-red-500 hover:bg-red-600 text-white h-9 w-9"
                    onClick={() => openDeleteModal(coord)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-gray-500 italic">
            No coordinators found.
          </div>
        )}
      </div>

      {showAddModal && (
        <AddCoordinatorModal
          onClose={() => setShowAddModal(false)}
          onCreated={fetchCoordinators}
        />
      )}

      {showEditModal && selectedCoordinator && (
        <EditCoordinatorModal
          coordinator={selectedCoordinator}
          onClose={() => {
            setShowEditModal(false);
            setSelectedCoordinator(null);
          }}
          onUpdated={fetchCoordinators}
        />
      )}

      {showDeleteModal && selectedCoordinator && (
        <DeleteCoordinatorModal
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedCoordinator(null);
          }}
          onConfirm={handleDeleteCoordinator}
          loading={deleting}
        />
      )}
    </>
  );
}