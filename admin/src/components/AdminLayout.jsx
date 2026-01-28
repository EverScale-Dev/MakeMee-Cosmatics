import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import pages from "../components/pages/index";
import { useAuth } from "../context/AuthContext";
import settingsService from "../services/settingsService";

const DEFAULT_ADMIN_PAGES = ["Orders", "Reviews", "Messages"];

export default function AdminLayout() {
  const [active, setActive] = useState("Dashboard");
  const { user } = useAuth();
  const [allowedPages, setAllowedPages] = useState(null);

  const isSuperAdmin = user?.role === "super_admin";

  useEffect(() => {
    if (!isSuperAdmin) {
      settingsService
        .getAdminPermissions()
        .then((data) => setAllowedPages(data.pages || DEFAULT_ADMIN_PAGES))
        .catch(() => setAllowedPages(DEFAULT_ADMIN_PAGES));
    }
  }, [isSuperAdmin]);

  // Reset to first allowed page if current page becomes inaccessible
  useEffect(() => {
    if (!isSuperAdmin && allowedPages && !allowedPages.includes(active)) {
      setActive(allowedPages[0] || "Dashboard");
    }
  }, [allowedPages, active, isSuperAdmin]);

  const ActivePage = pages[active];

  if (!isSuperAdmin && allowedPages === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar
        active={active}
        setActive={setActive}
        isSuperAdmin={isSuperAdmin}
        allowedPages={allowedPages}
      />
      <main className="ml-16 group-hover:ml-60 transition-all duration-300 p-6 w-full bg-gray-50 min-h-screen">
        {ActivePage ? <ActivePage /> : null}
      </main>
    </div>
  );
}
