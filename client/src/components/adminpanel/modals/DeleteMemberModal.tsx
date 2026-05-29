import { Button } from "@/components/ui/button";

interface DeleteMemberModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteMemberModal({
  onClose,
  onConfirm,
}: DeleteMemberModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">
          Confirm Deletion
        </h2>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this member?
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}