import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Images,
  Pencil,
  Save,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { API_URL } from "@/config/api";

import Type1MembersTable from "./components/Type1MembersTable";
import Type2MembersTable from "./components/Type2MembersTable";

import exportMembersToExcel from "./utils/exportMembersToExcel";
import { type1MemberColumns } from "./utils/type1MemberColumns";
import { type2MemberColumns } from "./utils/type2MemberColumns";

const getRowKey = (member: any) =>
  `${member.memberId || member._id}::${member.title || ""}`;

const applySequentialOrders = (rows: any[]) =>
  rows.map((row, index) => ({
    ...row,
    order: index + 1,
  }));

const sanitizeFileName = (value: string) =>
  value
    .trim()
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, "_");

export default function EventCategoryMembersPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [event, setEvent] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [loading, setLoading] = useState(false);
  const [membersLoading, setMembersLoading] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [downloadingPhotos, setDownloadingPhotos] = useState(false);

  const [members, setMembers] = useState<any[]>([]);
  const [editableMembers, setEditableMembers] = useState<any[]>([]);
  const [orderValues, setOrderValues] = useState<Record<string, number>>({});

  const [searchTerm, setSearchTerm] = useState("");
  const [isOrderEditing, setIsOrderEditing] = useState(false);

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

      toast({
        title: "Error",
        description: "Failed to load event details.",
        variant: "destructive",
      });
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

      const receivedMembers = applySequentialOrders(
        res.data.members || []
      );

      setMembers(receivedMembers);
      setEditableMembers([]);
      setOrderValues({});
      setIsOrderEditing(false);
    } catch (err) {
      console.error("Failed to fetch category members", err);

      toast({
        title: "Error",
        description: "Failed to load category members.",
        variant: "destructive",
      });
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

  const tableMembers = isOrderEditing ? editableMembers : members;

  const filteredMembers = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) return tableMembers;

    return tableMembers.filter((member) =>
      JSON.stringify(member).toLowerCase().includes(keyword)
    );
  }, [tableMembers, searchTerm]);

  const isType1 = event?.organizationType === "Foundation";
  const isType2 = event?.organizationType === "IBDF";

  const handleStartOrderEditing = () => {
    if (members.length === 0) {
      toast({
        title: "No Members",
        description: "There are no rows available to reorder.",
        variant: "destructive",
      });

      return;
    }

    const orderedRows = applySequentialOrders([...members]);
    const initialOrderValues: Record<string, number> = {};

    orderedRows.forEach((member, index) => {
      initialOrderValues[getRowKey(member)] = index + 1;
    });

    setSearchTerm("");
    setEditableMembers(orderedRows);
    setOrderValues(initialOrderValues);
    setIsOrderEditing(true);
  };

  const handleCancelOrderEditing = () => {
    setEditableMembers([]);
    setOrderValues({});
    setIsOrderEditing(false);
  };

  const handleOrderChange = (
    rowKey: string,
    requestedOrder: number
  ) => {
    setEditableMembers((currentRows) => {
      if (currentRows.length === 0) return currentRows;

      const currentIndex = currentRows.findIndex(
        (member) => getRowKey(member) === rowKey
      );

      if (currentIndex === -1) return currentRows;

      const targetOrder = Math.max(
        1,
        Math.min(requestedOrder, currentRows.length)
      );

      const targetIndex = targetOrder - 1;

      if (currentIndex === targetIndex) {
        return currentRows;
      }

      const reorderedRows = [...currentRows];
      const [movedRow] = reorderedRows.splice(currentIndex, 1);

      reorderedRows.splice(targetIndex, 0, movedRow);

      const normalizedRows = applySequentialOrders(reorderedRows);
      const updatedOrderValues: Record<string, number> = {};

      normalizedRows.forEach((member, index) => {
        updatedOrderValues[getRowKey(member)] = index + 1;
      });

      setOrderValues(updatedOrderValues);

      return normalizedRows;
    });
  };

  const handleSaveOrder = async () => {
    if (!eventId || !selectedCategory) return;

    if (editableMembers.length === 0) {
      toast({
        title: "No Rows",
        description: "There are no rows available to save.",
        variant: "destructive",
      });

      return;
    }

    try {
      setSavingOrder(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in again.",
          variant: "destructive",
        });

        return;
      }

      const rows = editableMembers.map((member) => ({
        memberId: member.memberId || member._id,
        title: member.title,
      }));

      await axios.put(
        `${API_URL}/api/category-row-orders/${eventId}/category/${encodeURIComponent(
          selectedCategory
        )}`,
        { rows },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Saved",
        description: "Category table order updated successfully.",
        variant: "success",
      });

      setIsOrderEditing(false);
      setEditableMembers([]);
      setOrderValues({});

      await fetchMembersByCategory();
    } catch (err: any) {
      console.error("Failed to save category row order", err);

      toast({
        title: "Save Failed",
        description:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to save the category table order.",
        variant: "destructive",
      });
    } finally {
      setSavingOrder(false);
    }
  };

  const handleExportExcel = () => {
    try {
      if (filteredMembers.length === 0) {
        toast({
          title: "No Members",
          description: "There are no members to export.",
          variant: "destructive",
        });

        return;
      }

      exportMembersToExcel({
        members: filteredMembers,
        columns: isType1
          ? type1MemberColumns
          : type2MemberColumns,
        eventName: event.name,
        category: selectedCategory,
      });

      toast({
        title: "Success",
        description: "Excel file downloaded successfully.",
        variant: "success",
      });
    } catch (err: any) {
      console.error("Excel export failed", err);

      toast({
        title: "Export Failed",
        description:
          err.message || "Failed to export Excel file.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPhotos = async () => {
    if (!eventId || !selectedCategory) return;

    if (members.length === 0) {
      toast({
        title: "No Members",
        description: "There are no member photos to download.",
        variant: "destructive",
      });

      return;
    }

    try {
      setDownloadingPhotos(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in again.",
          variant: "destructive",
        });

        return;
      }

      /*
       * Always send the complete saved category order.
       * Do not use filteredMembers here, because searching should not
       * accidentally produce a partial or incorrectly numbered ZIP.
       */
      const rows = members.map((member, index) => ({
        memberId: member.memberId || member._id,
        title: member.title || "",
        order: member.order || index + 1,
      }));

      const response = await axios.post(
        `${API_URL}/api/photo-downloads/${eventId}/category/${encodeURIComponent(
          selectedCategory
        )}`,
        { rows },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const contentDisposition =
        response.headers["content-disposition"];

      const fileNameMatch =
        contentDisposition?.match(/filename="?([^"]+)"?/i);

      const fallbackFileName = `${sanitizeFileName(
        event.name || "Event"
      )}_${sanitizeFileName(selectedCategory)}_Photos.zip`;

      const fileName = fileNameMatch?.[1] || fallbackFileName;

      const downloadUrl = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "application/zip",
        })
      );

      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);

      toast({
        title: "Success",
        description: "Member photos downloaded successfully.",
        variant: "success",
      });
    } catch (err: any) {
      console.error("Photo ZIP download failed", err);

      let description = "Failed to download member photos.";

      if (err.response?.data instanceof Blob) {
        try {
          const errorText = await err.response.data.text();
          const errorData = JSON.parse(errorText);

          description =
            errorData.message ||
            errorData.error ||
            description;
        } catch {
          // Keep the default description.
        }
      } else {
        description =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          description;
      }

      toast({
        title: "Download Failed",
        description,
        variant: "destructive",
      });
    } finally {
      setDownloadingPhotos(false);
    }
  };

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
      {/* Header */}
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

      {/* Categories */}
      <div className="border-b border-gray-300 mb-8 pb-3">
        <div className="flex gap-2 overflow-x-auto">
          {event.categories?.map((category: string) => (
            <button
              key={category}
              type="button"
              disabled={
                isOrderEditing ||
                savingOrder ||
                downloadingPhotos
              }
              onClick={() => {
                setSelectedCategory(category);
                setSearchTerm("");
              }}
              className={`px-5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 disabled:cursor-not-allowed ${
                selectedCategory === category
                  ? "bg-[#1c1c1c] text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-100 hover:text-black disabled:opacity-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 mb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search member..."
            value={searchTerm}
            disabled={isOrderEditing}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isOrderEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancelOrderEditing}
                disabled={savingOrder}
                className="flex items-center gap-2"
              >
                <X size={16} />
                Cancel
              </Button>

              <Button
                onClick={handleSaveOrder}
                disabled={savingOrder}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <Save size={16} />
                {savingOrder ? "Saving..." : "Save Order"}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleStartOrderEditing}
                disabled={
                  membersLoading ||
                  members.length === 0 ||
                  downloadingPhotos
                }
                className="flex items-center gap-2"
              >
                <Pencil size={16} />
                Edit Order
              </Button>

              <Button
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                onClick={handleExportExcel}
                disabled={
                  membersLoading ||
                  filteredMembers.length === 0 ||
                  downloadingPhotos
                }
              >
                <Download size={16} />
                Download Excel
              </Button>

              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                onClick={handleDownloadPhotos}
                disabled={
                  membersLoading ||
                  members.length === 0 ||
                  downloadingPhotos
                }
              >
                <Images size={16} />
                {downloadingPhotos
                  ? "Preparing ZIP..."
                  : "Download Photos"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Type 1 Table */}
      {isType1 && (
        <Type1MembersTable
          members={filteredMembers}
          loading={membersLoading}
          isOrderEditing={isOrderEditing}
          orderValues={orderValues}
          onOrderChange={handleOrderChange}
        />
      )}

      {/* Type 2 Table */}
      {isType2 && (
        <Type2MembersTable
          members={filteredMembers}
          loading={membersLoading}
          isOrderEditing={isOrderEditing}
          orderValues={orderValues}
          onOrderChange={handleOrderChange}
        />
      )}
    </div>
  );
}