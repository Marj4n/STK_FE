"use client";

type Props = {
  open: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
};

export default function ConfirmDialog({
  open,
  title = "Confirm",
  message,
  onCancel,
  onConfirm,
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded p-4 w-full max-w-sm">
        <h3 className="text-lg font-semibold">{title}</h3>
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-2">
            Cancel
          </button>
          <button
            onClick={async () => {
              await onConfirm();
            }}
            className="bg-red-600 text-white px-3 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
