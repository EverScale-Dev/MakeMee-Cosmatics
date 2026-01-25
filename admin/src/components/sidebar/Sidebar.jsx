import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Star,
  Ticket,
  Settings
} from "lucide-react";

import SidebarItem from "./SidebarItem";

export default function Sidebar({ active, setActive }) {
  const menu = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Orders", icon: ShoppingCart },
    { label: "Products", icon: Package },
    { label: "Customers", icon: Users },
    { label: "Coupons", icon: Ticket },
    { label: "Reviews", icon: Star },
    { label: "Settings", icon: Settings }
  ];

  return (
    <aside
      className="
        fixed left-0 top-0 z-40
        h-screen
        bg-white
        border-r
        transition-all duration-300
        w-16 hover:w-60
        group
      "
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b">
        <div className="w-8 h-8 bg-black rounded-md shrink-0" />
        <span className="ml-3 text-sm font-semibold text-black opacity-0 group-hover:opacity-100 transition">
          MyAdmin
        </span>
      </div>

      {/* Menu */}
      <nav className="mt-4 space-y-1 px-2">
        {menu.map((item) => (
          <SidebarItem
            key={item.label}
            label={item.label}
            Icon={item.icon}
            active={active === item.label}
            onClick={() => setActive(item.label)}
          />
        ))}
      </nav>
    </aside>
  );
}
