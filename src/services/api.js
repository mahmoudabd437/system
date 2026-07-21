import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import AuthPage from "./components/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import StagesPage from "./pages/StagesPage";
import TopNavbar from "./components/TopNavbar";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleAuthSuccess = (authToken, authUser) => {
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(authUser));

    setToken(authToken);
    setUser(authUser);
    setActivePage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  if (!token || !user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() =>
          setSidebarCollapsed((current) => !current)
        }
        onLogout={handleLogout}
        user={user}
      />

      <main
        className={`main-stage ${
          sidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
      >
        <TopNavbar
          user={user}
          pageTitle={
            activePage === "stages"
              ? "المراحل الدراسية"
              : "الرئيسية"
          }
        />

        {activePage === "stages" ? (
          <StagesPage user={user} />
        ) : (
          <DashboardPage user={user} />
        )}
      </main>
    </div>
  );
}
