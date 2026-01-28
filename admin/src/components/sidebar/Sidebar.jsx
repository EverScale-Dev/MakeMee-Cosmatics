import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Star,
  Ticket,
  Settings,
  Mail,
  ShieldCheck
} from "lucide-react";

import SidebarItem from "./SidebarItem";

const allMenu = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Orders", icon: ShoppingCart },
  { label: "Products", icon: Package },
  { label: "Customers", icon: Users },
  { label: "Coupons", icon: Ticket },
  { label: "Reviews", icon: Star },
  { label: "Messages", icon: Mail },
  { label: "Settings", icon: Settings },
  { label: "Admin Access", icon: ShieldCheck, superAdminOnly: true }
];

export default function Sidebar({ active, setActive, isSuperAdmin, allowedPages }) {
  const menu = allMenu.filter((item) => {
    if (item.superAdminOnly) return isSuperAdmin;
    if (isSuperAdmin) return true;
    return allowedPages && allowedPages.includes(item.label);
  });

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
