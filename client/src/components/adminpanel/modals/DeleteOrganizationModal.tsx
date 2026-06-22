import { Button } from "@/components/ui/button";

interface Props {
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function DeleteOrganizationModal({
  onClose,
  onConfirm,
  loading = false,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[380px] shadow-xl">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Delete Organization
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete this organization? This action cannot
          be undone.
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}