import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash } from "lucide-react";
import { API_URL } from "@/config/api";
import AddOrganizationModal from "@/components/adminpanel/modals/AddOrganizationModal";
import EditOrganizationModal from "@/components/adminpanel/modals/EditOrganizationModal";
import DeleteOrganizationModal from "@/components/adminpanel/modals/DeleteOrganizationModal";
import { useToast } from "@/components/ui/use-toast";

interface Organization {
  _id: string;
  name: string;
  purposeType: "social_welfare" | "business";
  formType: "type1" | "type2";
  registrationNumber: string;
  logo?: string;
  memberCount: number;
}

export default function OrganizationsPage() {
  const { toast } = useToast();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);

  const [deleting, setDeleting] = useState(false);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/api/organizations`);
      setOrganizations(res.data);
    } catch (err) {
      console.error("Failed to fetch organizations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const getPurposeLabel = (purposeType: Organization["purposeType"]) => {
    return purposeType === "business" ? "Business" : "Social Welfare";
  };

  const getLogoUrl = (logo?: string) => {
    if (!logo) return null;
    return `${API_URL}${logo}`;
  };

  const openEditModal = (organization: Organization) => {
    setSelectedOrganization(organization);
    setShowEditModal(true);
  };

  const openDeleteModal = (organization: Organization) => {
    setSelectedOrganization(organization);
    setShowDeleteModal(true);
  };

  const handleDeleteOrganization = async () => {
    if (!selectedOrganization) return;

    try {
      setDeleting(true);

      await axios.delete(
        `${API_URL}/api/organizations/${selectedOrganization._id}`
      );

      setOrganizations((prev) =>
        prev.filter((org) => org._id !== selectedOrganization._id)
      );

      toast({
        title: "Deleted",
        description: "Organization deleted successfully.",
        variant: "success",
      });

      setShowDeleteModal(false);
      setSelectedOrganization(null);
    } catch (err: any) {
      console.error("Failed to delete organization", err);

      toast({
        title: "Delete failed",
        description:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to delete organization.",
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
              All Organizations
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              {organizations.length.toString().padStart(2, "0")} organizations
            </p>
          </div>

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} />
            Add New Organization
          </Button>
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-500">
            Loading organizations...
          </div>
        ) : organizations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {organizations.map((org) => (
              <div
                key={org._id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden mb-4">
                  {getLogoUrl(org.logo) ? (
                    <img
                      src={getLogoUrl(org.logo) || ""}
                      alt={org.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-semibold text-gray-400">
                      {org.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <h2 className="text-base font-semibold text-gray-800 min-h-[48px] flex items-center">
                  {org.name}
                </h2>

                <span
                  className={`mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                    org.purposeType === "business"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {getPurposeLabel(org.purposeType)}
                </span>

                <p className="text-sm text-gray-500 mt-4">
                  No. of Members :{" "}
                  <span className="font-semibold text-gray-700">
                    {org.memberCount || 0}
                  </span>
                </p>

                <div className="flex items-center justify-center gap-3 mt-5">
                  <Button
                    size="icon"
                    className="bg-green-500 hover:bg-green-600 text-white h-9 w-9"
                    onClick={() => openEditModal(org)}
                  >
                    <Pencil size={16} />
                  </Button>

                  <Button
                    size="icon"
                    className="bg-red-500 hover:bg-red-600 text-white h-9 w-9"
                    onClick={() => openDeleteModal(org)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-gray-500 italic">
            No organizations found.
          </div>
        )}
      </div>

      {showAddModal && (
        <AddOrganizationModal
          onClose={() => setShowAddModal(false)}
          onCreated={fetchOrganizations}
        />
      )}

      {showEditModal && selectedOrganization && (
        <EditOrganizationModal
          organization={selectedOrganization}
          onClose={() => {
            setShowEditModal(false);
            setSelectedOrganization(null);
          }}
          onUpdated={fetchOrganizations}
        />
      )}

      {showDeleteModal && selectedOrganization && (
        <DeleteOrganizationModal
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedOrganization(null);
          }}
          onConfirm={handleDeleteOrganization}
          loading={deleting}
        />
      )}
    </>
  );
}