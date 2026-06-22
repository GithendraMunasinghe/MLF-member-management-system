import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Plus, Eye } from "lucide-react";
import EditMemberModal from "./modals/EditMemberModal";
import { Member } from "@/types/member";
import DeleteMemberModal from "./modals/DeleteMemberModal";
import { useToast } from "@/components/ui/use-toast";
import { Search } from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function MembersTable() {

  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRegNo, setNewMemberRegNo] = useState("");
  const [newMemberImage, setNewMemberImage] = useState<string | null>(null);
  const [newMemberDescription, setNewMemberDescription] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 12;

  const [members, setMembers] = useState<Member[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // edit modal state
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editMemberName, setEditMemberName] = useState("");
  const [editMemberRegNo, setEditMemberRegNo] = useState("");
  const [editMemberImagePreview, setEditMemberImagePreview] = useState<string | null>(null);
  const [editMemberImageFile, setEditMemberImageFile] = useState<File | null>(null);
  const [editMemberId, setEditMemberId] = useState<string | null>(null);

  //edit notification state
  const [notification, setNotification] = useState<string | null>(null);

  //search state
  const [searchTerm, setSearchTerm] = useState("");

  const openEditModal = (member: Member) => {
    setEditMemberName(member.personalInfo?.fullName || "");
    setEditMemberRegNo(member.regNo.toString());
    setEditMemberImagePreview(member.photo); // existing image URL
    setEditMemberImageFile(null);
    setShowEditModal(true);
    setEditMemberId(member._id);
  };

  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchMembers(searchTerm);
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const fetchMembers = async (query = "") => {
    try {
      const url = query
        ? `http://localhost:5000/api/members/search?q=${query}`
        : `http://localhost:5000/api/members`;

      const res = await axios.get(url);
      setMembers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [members, sortOrder]);

  const totalPages = Math.ceil(sortedMembers.length / membersPerPage);

  useEffect(() => {
  if (currentPage > totalPages) {
    setCurrentPage(1);
  }
  }, [totalPages]);

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * membersPerPage;
    return sortedMembers.slice(startIndex, startIndex + membersPerPage);
  }, [sortedMembers, currentPage, membersPerPage]);

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const openDeleteModal = (id: string) => {
    setSelectedId(id);
    setShowModal(true);
  };

  //handle delete function
  const handleDelete = async () => {
    if (!selectedId) return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `http://localhost:5000/api/members/${selectedId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Deleted",
        description: "Member deleted successfully.",
        variant: "success",
      });

      setShowModal(false);
      setSelectedId(null);
      fetchMembers();

    } catch (err) {
      console.log(err);

      toast({
        title: "Error",
        description: "Failed to delete member.",
        variant: "destructive",
      });
    }
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];

    setEditMemberImageFile(file);
    setEditMemberImagePreview(URL.createObjectURL(file));
  }
  };

  return (
    <>
      <div className="flex-1 flex flex-col bg-white rounded-xl p-4 overflow-hidden border border-gray-200">

        {/* Top Section - Title + Add Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Members Directory
          </h2>

          <div className="flex items-center gap-2">
            <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search name or reg no ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>
          
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              onClick={() => navigate("/admin-dashboard/add-member")}
            >
              <Plus size={18} />
              Add New Member
            </Button>
            </div>
          </div>

        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-[#F2F2F2]">
              <th className="px-6 py-2 border-b font-medium">Name</th>
              <th className="px-6 py-2 border-b font-medium">Reg No</th>
              <th
                className="px-6 py-2 border-b cursor-pointer font-medium"
                onClick={handleSort}
              >
                Registered Date {sortOrder === "asc" ? "↑" : "↓"}
              </th>
              <th className="px-6 py-2 border-b font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedMembers.length > 0 ? (
              paginatedMembers.map((member) => (
                <tr key={member._id} className="hover:bg-gray-50">
                  <td
                    className="px-6 py-2 border-b"
                    title={member.personalInfo?.fullName || ""}
                  >
                    {member.personalInfo?.fullName
                      ? member.personalInfo.fullName.length > 25
                        ? `${member.personalInfo.fullName.substring(0, 25)}...`
                        : member.personalInfo.fullName
                      : "-"}
                  </td>
                  <td className="px-6 py-2 border-b">{member.regNo}</td>
                  <td className="px-6 py-2 border-b">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-2 border-b">
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        className="bg-blue-500 hover:bg-blue-600 text-white h-8 w-8"
                        onClick={() =>
                          navigate(`/admin-dashboard/members/profile/${member._id}`)
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        className="bg-green-500 hover:bg-green-600 text-white h-8 w-8"
                        onClick={() => {
                          setSelectedMember(member);
                          setShowEditModal(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        className="bg-red-500 hover:bg-red-600 text-white h-8 w-8"
                        onClick={() => {
                          setSelectedId(member._id);
                          setShowModal(true);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-4 text-center text-gray-500 italic"
                >
                  No members found. Add some members to see them here.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4 px-2">
            
            {/* Left - Showing info */}
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * membersPerPage + 1} to{" "}
              {Math.min(currentPage * membersPerPage, sortedMembers.length)} of{" "}
              {sortedMembers.length} members
            </div>

            {/* Right - Page Controls */}
            <div className="flex items-center gap-2">

              {/* Previous Button */}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>

              {/* Page Numbers */}
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

              {/* Next Button */}
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

      {showEditModal && selectedMember && (
        <EditMemberModal
          member={selectedMember} 
          onClose={() => setShowEditModal(false)}
          onUpdated={fetchMembers}
        />
      )}

      {showModal && (
        <DeleteMemberModal
          onClose={() => setShowModal(false)}
          onConfirm={handleDelete}
        />
      )}

    </>
  );
}