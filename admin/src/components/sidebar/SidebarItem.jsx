export default function SidebarItem({ label, Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        group/item
        flex items-center
        w-full
        px-3 py-2.5
        rounded-md
        transition
        ${
          active
            ? "bg-gray-100 border-l-4 border-black"
            : "hover:bg-gray-50"
        }
      `}
    >
      {/* Icon */}
      <Icon className="w-5 h-5 text-gray-800 shrink-0" />

      {/* Text */}
      <span
        className="
          ml-3
          text-sm
          text-gray-800
          whitespace-nowrap
          opacity-0
          group-hover:opacity-100
          transition
        "
      >
        {label}
      </span>
    </button>
  );
}
