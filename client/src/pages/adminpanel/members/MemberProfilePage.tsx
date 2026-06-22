import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/config/api";
import { ArrowLeft, Pencil, Trash, Save, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MemberProfile {
  _id: string;
  regNo?: string;
  photo?: string;
  formType?: "type1" | "type2";
  organizationType?: string;
  batchNumber?: string;
  registeredYear?: string;
  createdAt?: string;

  organizationId?: { _id?: string; name?: string };
  eventId?: { _id?: string; name?: string };
  coordinatorId?: { _id?: string; name?: string; coordinatorId?: string };

  personalInfo?: {
    fullName?: string;
    certificateName?: string;
    nameWithInitials?: string;
    nicNumber?: string;
    passportNumber?: string;
    drivingLicense?: string;
    gender?: string;
    maritalStatus?: string;
    dateOfBirth?: string;
  };

  contact?: {
    mobilePhone?: string;
    whatsappNumber?: string;
    email?: string;
  };

  address?: {
    permanentAddress?: string;
    province?: string;
    district?: string;
    divisionalSecretariat?: string;
    gramaNiladhariDivision?: string;
    policeDivision?: string;
  };

  professional?: {
    jobStatus?: string;
    workExperience?: string;
    workplaceAddress?: string;
  };

  business?: {
    name?: string;
    about?: string;
    registrationNumber?: string;
    contactNumber?: string;
    email?: string;
    website?: string;
    startedYear?: string;
    address?: string;
    numberOfBranches?: number;
    portalName?: string;
    grade?: number;
  };
}

const DetailRow = ({ label, value }: { label: string; value?: any }) => (
  <div className="border-b border-gray-100 py-3">
    <p className="text-xs text-gray-400">{label}</p>
    <p className="text-sm font-medium text-gray-700">{value || "-"}</p>
  </div>
);

const EditableRow = ({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value?: any;
  onChange: (value: string) => void;
  type?: string;
}) => (
  <div className="border-b border-gray-100 py-3">
    <label className="text-xs text-gray-400">{label}</label>
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
    <h2 className="text-base font-semibold text-gray-700 mb-3">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">{children}</div>
  </div>
);

export default function MemberProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [member, setMember] = useState<MemberProfile | null>(null);
  const [editData, setEditData] = useState<MemberProfile | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchMember = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/members/${id}`);
      setMember(res.data);
      setEditData(res.data);
    } catch (err) {
      console.error("Failed to fetch member profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMember();
  }, [id]);

  const updateNested = (
    section: keyof MemberProfile,
    field: string,
    value: string
  ) => {
    setEditData((prev: any) => ({
      ...prev,
      [section]: {
        ...(prev?.[section] || {}),
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (!editData) return;

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("regNo", editData.regNo || "");
      formData.append("formType", editData.formType || "");
      formData.append("organizationType", editData.organizationType || "");

      if (editData.organizationId?._id) {
        formData.append("organizationId", editData.organizationId._id);
      }

      if (editData.eventId?._id) {
        formData.append("eventId", editData.eventId._id);
      }

      if (editData.coordinatorId?._id) {
        formData.append("coordinatorId", editData.coordinatorId._id);
      }

      formData.append("batchNumber", editData.batchNumber || "");
      formData.append("registeredYear", editData.registeredYear || "");

      formData.append("personalInfo", JSON.stringify(editData.personalInfo || {}));
      formData.append("contact", JSON.stringify(editData.contact || {}));
      formData.append("address", JSON.stringify(editData.address || {}));
      formData.append("professional", JSON.stringify(editData.professional || {}));
      formData.append("business", JSON.stringify(editData.business || {}));

      const token = localStorage.getItem("token");

      await axios.put(`${API_URL}/api/members/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Saved",
        description: "Member profile updated successfully.",
        variant: "success",
      });

      setIsEditing(false);
      fetchMember();
    } catch (err: any) {
      toast({
        title: "Update failed",
        description:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update member profile.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this member?"
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);

      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/api/members/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Deleted",
        description: "Member deleted successfully.",
        variant: "success",
      });

      navigate("/admin-dashboard/members");
    } catch (err: any) {
      toast({
        title: "Delete failed",
        description:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to delete member.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const current = isEditing ? editData : member;
  const photoUrl = current?.photo ? `${API_URL}${current.photo}` : null;

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 text-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (!current) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 text-center text-gray-500">
        Member profile not found.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="w-fit flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          Back
        </Button>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  setEditData(member);
                  setIsEditing(false);
                }}
              >
                <X size={16} />
                Cancel
              </Button>

              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                onClick={handleSave}
                disabled={saving}
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <>
              <Button
                className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                onClick={() => setIsEditing(true)}
              >
                <Pencil size={16} />
                Edit Member
              </Button>

              <Button
                className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash size={16} />
                {deleting ? "Deleting..." : "Delete Member"}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 h-fit lg:sticky lg:top-6 text-center">
          <div className="w-36 h-36 rounded-full bg-gray-100 border mx-auto overflow-hidden flex items-center justify-center">
            {photoUrl ? (
              <img src={photoUrl} alt="Member" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-semibold text-gray-400">
                {current.personalInfo?.certificateName?.charAt(0) || "M"}
              </span>
            )}
          </div>

          <h1 className="text-xl font-semibold text-gray-800 mt-4">
            {current.personalInfo?.certificateName ||
              current.personalInfo?.fullName ||
              "-"}
          </h1>

          <p className="text-sm text-gray-500 mt-1">{current.regNo}</p>

          <div className="mt-5 text-left space-y-3">
            <DetailRow label="Organization" value={current.organizationId?.name} />
            <DetailRow label="Event" value={current.eventId?.name} />
            <DetailRow label="Coordinator" value={current.coordinatorId?.name} />
            <DetailRow
              label="Registered Date"
              value={
                current.createdAt
                  ? new Date(current.createdAt).toLocaleDateString()
                  : "-"
              }
            />
          </div>
        </div>

        <div className="max-h-[calc(100vh-140px)] overflow-y-auto pr-2">
          <Section title="Personal Information">
            {isEditing ? (
              <>
                <EditableRow label="Full Name" value={editData?.personalInfo?.fullName} onChange={(v) => updateNested("personalInfo", "fullName", v)} />
                <EditableRow label="Certificate Name" value={editData?.personalInfo?.certificateName} onChange={(v) => updateNested("personalInfo", "certificateName", v)} />
                <EditableRow label="Name With Initials" value={editData?.personalInfo?.nameWithInitials} onChange={(v) => updateNested("personalInfo", "nameWithInitials", v)} />
                <EditableRow label="NIC Number" value={editData?.personalInfo?.nicNumber} onChange={(v) => updateNested("personalInfo", "nicNumber", v)} />
                <EditableRow label="Passport Number" value={editData?.personalInfo?.passportNumber} onChange={(v) => updateNested("personalInfo", "passportNumber", v)} />
                <EditableRow label="Driving License" value={editData?.personalInfo?.drivingLicense} onChange={(v) => updateNested("personalInfo", "drivingLicense", v)} />
                <EditableRow label="Gender" value={editData?.personalInfo?.gender} onChange={(v) => updateNested("personalInfo", "gender", v)} />
                <EditableRow label="Marital Status" value={editData?.personalInfo?.maritalStatus} onChange={(v) => updateNested("personalInfo", "maritalStatus", v)} />
                <EditableRow label="Date of Birth" type="date" value={editData?.personalInfo?.dateOfBirth?.slice(0, 10)} onChange={(v) => updateNested("personalInfo", "dateOfBirth", v)} />
              </>
            ) : (
              <>
                <DetailRow label="Full Name" value={current.personalInfo?.fullName} />
                <DetailRow label="Certificate Name" value={current.personalInfo?.certificateName} />
                <DetailRow label="Name With Initials" value={current.personalInfo?.nameWithInitials} />
                <DetailRow label="NIC Number" value={current.personalInfo?.nicNumber} />
                <DetailRow label="Passport Number" value={current.personalInfo?.passportNumber} />
                <DetailRow label="Driving License" value={current.personalInfo?.drivingLicense} />
                <DetailRow label="Gender" value={current.personalInfo?.gender} />
                <DetailRow label="Marital Status" value={current.personalInfo?.maritalStatus} />
                <DetailRow label="Date of Birth" value={current.personalInfo?.dateOfBirth ? new Date(current.personalInfo.dateOfBirth).toLocaleDateString() : "-"} />
              </>
            )}
          </Section>

          <Section title="Contact Information">
            {isEditing ? (
              <>
                <EditableRow label="Mobile Phone" value={editData?.contact?.mobilePhone} onChange={(v) => updateNested("contact", "mobilePhone", v)} />
                <EditableRow label="WhatsApp Number" value={editData?.contact?.whatsappNumber} onChange={(v) => updateNested("contact", "whatsappNumber", v)} />
                <EditableRow label="Email" value={editData?.contact?.email} onChange={(v) => updateNested("contact", "email", v)} />
              </>
            ) : (
              <>
                <DetailRow label="Mobile Phone" value={current.contact?.mobilePhone} />
                <DetailRow label="WhatsApp Number" value={current.contact?.whatsappNumber} />
                <DetailRow label="Email" value={current.contact?.email} />
              </>
            )}
          </Section>

          <Section title="Address Information">
            {isEditing ? (
              <>
                <EditableRow label="Permanent Address" value={editData?.address?.permanentAddress} onChange={(v) => updateNested("address", "permanentAddress", v)} />
                <EditableRow label="Province" value={editData?.address?.province} onChange={(v) => updateNested("address", "province", v)} />
                <EditableRow label="District" value={editData?.address?.district} onChange={(v) => updateNested("address", "district", v)} />
                <EditableRow label="Divisional Secretariat" value={editData?.address?.divisionalSecretariat} onChange={(v) => updateNested("address", "divisionalSecretariat", v)} />
                <EditableRow label="Grama Niladhari Division" value={editData?.address?.gramaNiladhariDivision} onChange={(v) => updateNested("address", "gramaNiladhariDivision", v)} />
                <EditableRow label="Police Division" value={editData?.address?.policeDivision} onChange={(v) => updateNested("address", "policeDivision", v)} />
              </>
            ) : (
              <>
                <DetailRow label="Permanent Address" value={current.address?.permanentAddress} />
                <DetailRow label="Province" value={current.address?.province} />
                <DetailRow label="District" value={current.address?.district} />
                <DetailRow label="Divisional Secretariat" value={current.address?.divisionalSecretariat} />
                <DetailRow label="Grama Niladhari Division" value={current.address?.gramaNiladhariDivision} />
                <DetailRow label="Police Division" value={current.address?.policeDivision} />
              </>
            )}
          </Section>

          {current.formType === "type1" ? (
            <Section title="Professional Information">
              {isEditing ? (
                <>
                  <EditableRow label="Job Status" value={editData?.professional?.jobStatus} onChange={(v) => updateNested("professional", "jobStatus", v)} />
                  <EditableRow label="Work Experience" value={editData?.professional?.workExperience} onChange={(v) => updateNested("professional", "workExperience", v)} />
                  <EditableRow label="Workplace Address" value={editData?.professional?.workplaceAddress} onChange={(v) => updateNested("professional", "workplaceAddress", v)} />
                </>
              ) : (
                <>
                  <DetailRow label="Job Status" value={current.professional?.jobStatus} />
                  <DetailRow label="Work Experience" value={current.professional?.workExperience} />
                  <DetailRow label="Workplace Address" value={current.professional?.workplaceAddress} />
                </>
              )}
            </Section>
          ) : (
            <Section title="Business Information">
              {isEditing ? (
                <>
                  <EditableRow label="Business Name" value={editData?.business?.name} onChange={(v) => updateNested("business", "name", v)} />
                  <EditableRow label="About" value={editData?.business?.about} onChange={(v) => updateNested("business", "about", v)} />
                  <EditableRow label="Business Registration Number" value={editData?.business?.registrationNumber} onChange={(v) => updateNested("business", "registrationNumber", v)} />
                  <EditableRow label="Contact Number" value={editData?.business?.contactNumber} onChange={(v) => updateNested("business", "contactNumber", v)} />
                  <EditableRow label="Business Email" value={editData?.business?.email} onChange={(v) => updateNested("business", "email", v)} />
                  <EditableRow label="Website" value={editData?.business?.website} onChange={(v) => updateNested("business", "website", v)} />
                  <EditableRow label="Started Year" value={editData?.business?.startedYear} onChange={(v) => updateNested("business", "startedYear", v)} />
                  <EditableRow label="Business Address" value={editData?.business?.address} onChange={(v) => updateNested("business", "address", v)} />
                  <EditableRow label="Number of Branches" value={editData?.business?.numberOfBranches} onChange={(v) => updateNested("business", "numberOfBranches", v)} />
                  <EditableRow label="Portal Name" value={editData?.business?.portalName} onChange={(v) => updateNested("business", "portalName", v)} />
                  <EditableRow label="Grade" value={editData?.business?.grade} onChange={(v) => updateNested("business", "grade", v)} />
                </>
              ) : (
                <>
                  <DetailRow label="Business Name" value={current.business?.name} />
                  <DetailRow label="About" value={current.business?.about} />
                  <DetailRow label="Business Registration Number" value={current.business?.registrationNumber} />
                  <DetailRow label="Contact Number" value={current.business?.contactNumber} />
                  <DetailRow label="Business Email" value={current.business?.email} />
                  <DetailRow label="Website" value={current.business?.website} />
                  <DetailRow label="Started Year" value={current.business?.startedYear} />
                  <DetailRow label="Business Address" value={current.business?.address} />
                  <DetailRow label="Number of Branches" value={current.business?.numberOfBranches} />
                  <DetailRow label="Portal Name" value={current.business?.portalName} />
                  <DetailRow label="Grade" value={current.business?.grade} />
                </>
              )}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}