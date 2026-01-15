import { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import pages from "../components/pages/index";

export default function AdminLayout() {
  const [active, setActive] = useState("Dashboard");

  const ActivePage = pages[active];

  return (
    <div className="flex">
      <Sidebar active={active} setActive={setActive} />
      <main className="ml-16 group-hover:ml-60 transition-all duration-300 p-6 w-full bg-gray-50 min-h-screen">
        <ActivePage />
      </main>
    </div>
  );
}
