import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import AuthPage from "./components/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import StagesPage from "./pages/StagesPage";
import TopNavbar from "./components/TopNavbar";
import { clearStoredToken, getMe, getStoredToken, setStoredToken } from "./services/api";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getStoredToken());
  const [bootstrapping, setBootstrapping] = useState(Boolean(getStoredToken()));

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      if (!token) {
        setBootstrapping(false);
        return;
      }

      try {
        const me = await getMe();
        if (active) setUser(me);
      } catch (error) {
        clearStoredToken();
        if (active) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (active) setBootstrapping(false);
      }
    }

    bootstrap();
    return () => {
      active = false;
    };
  }, [token]);

  const handleAuthSuccess = (authToken, authUser) => {
    setStoredToken(authToken);
    setToken(authToken);
    setUser(authUser);
    setActivePage("dashboard");
  };

  const handleLogout = () => {
    clearStoredToken();
    setToken(null);
    setUser(null);
  };

  if (bootstrapping) {
    return (
      <div className="boot-screen">
        <div className="boot-card">جارٍ التحقق من الجلسة...</div>
      </div>
    );
  }

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
        onToggleCollapsed={() => setSidebarCollapsed((current) => !current)}
        onLogout={handleLogout}
        user={user}
      />

      <main className={`main-stage ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <TopNavbar user={user} pageTitle={activePage === "stages" ? "المراحل الدراسية" : "الرئيسية"} />
        {activePage === "stages" ? <StagesPage user={user} /> : <DashboardPage user={user} />}
      </main>
    </div>
  );
}
