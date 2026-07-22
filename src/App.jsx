import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import AcademicStagesPage from './pages/AcademicStagesPage';
import AttendancePage from './pages/AttendancePage';
import BackupPage from './pages/BackupPage';
import BookingsPage from './pages/BookingsPage';
import DashboardPage from './pages/DashboardPage';
import ExamsPage from './pages/ExamsPage';
import ExpensesPage from './pages/ExpensesPage';
import GroupsPage from './pages/GroupsPage';
import InventoryPage from './pages/InventoryPage';
import LoginPage from './pages/LoginPage';
import PaymentsPage from './pages/PaymentsPage';
import ReportsPage from './pages/ReportsPage';
import SalariesPage from './pages/SalariesPage';
import SignupPage from './pages/SignupPage';
import StudentsPage from './pages/StudentsPage';
import SubjectsPage from './pages/SubjectsPage';
import UsersPage from './pages/UsersPage';

function ShellPage({ children }) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/dashboard"
        element={
          <ShellPage>
            <DashboardPage />
          </ShellPage>
        }
      />
      <Route
        path="/stages"
        element={
          <ShellPage>
            <AcademicStagesPage />
          </ShellPage>
        }
      />
      <Route
        path="/subjects"
        element={
          <ShellPage>
            <SubjectsPage />
          </ShellPage>
        }
      />
      <Route
        path="/groups"
        element={
          <ShellPage>
            <GroupsPage />
          </ShellPage>
        }
      />
      <Route
        path="/students"
        element={
          <ShellPage>
            <StudentsPage />
          </ShellPage>
        }
      />
      <Route
        path="/bookings"
        element={
          <ShellPage>
            <BookingsPage />
          </ShellPage>
        }
      />
      <Route
        path="/attendance"
        element={
          <ShellPage>
            <AttendancePage />
          </ShellPage>
        }
      />
      <Route
        path="/payments"
        element={
          <ShellPage>
            <PaymentsPage />
          </ShellPage>
        }
      />
      <Route
        path="/salaries"
        element={
          <ShellPage>
            <SalariesPage />
          </ShellPage>
        }
      />
      <Route
        path="/exams"
        element={
          <ShellPage>
            <ExamsPage />
          </ShellPage>
        }
      />
      <Route
        path="/expenses"
        element={
          <ShellPage>
            <ExpensesPage />
          </ShellPage>
        }
      />
      <Route
        path="/inventory"
        element={
          <ShellPage>
            <InventoryPage />
          </ShellPage>
        }
      />
      <Route
        path="/reports"
        element={
          <ShellPage>
            <ReportsPage />
          </ShellPage>
        }
      />
      <Route
        path="/users"
        element={
          <ShellPage>
            <UsersPage />
          </ShellPage>
        }
      />
      <Route
        path="/backup"
        element={
          <ShellPage>
            <BackupPage />
          </ShellPage>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <AppRoutes />
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
