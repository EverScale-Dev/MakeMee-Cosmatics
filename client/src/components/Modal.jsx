import { X } from "lucide-react";

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">{title}</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
