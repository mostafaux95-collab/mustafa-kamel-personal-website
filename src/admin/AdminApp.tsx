import { Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { adminQueryClient } from "./lib/queryClient";
import { AdminAuthProvider, RequireAuth } from "./lib/auth";
import AdminLayout from "./layout/AdminLayout";
import AdminLogin from "./pages/Login";
import AdminDashboard from "./pages/Dashboard";
import ProjectsList from "./pages/projects/ProjectsList";
import ProjectForm from "./pages/projects/ProjectForm";

// Mounted at /admin/* by the main App router. Deliberately isolated from
// the public site's providers (i18n, sound, GSAP scroll setup, cursor) —
// the admin dashboard is a plain, LTR-only, non-animated tool UI.
export default function AdminApp() {
  return (
    // The public site can leave document.dir="rtl" behind (persisted
    // Arabic preference). Tailwind's logical-property classes (ps-/pe-)
    // used throughout the admin UI resolve off the nearest `dir`
    // ancestor, not just <html>, so pinning it here keeps the admin
    // panel LTR regardless of what the visitor last set on the public
    // site — without needing to rewrite every class to physical sides.
    <div dir="ltr">
      <QueryClientProvider client={adminQueryClient}>
        <AdminAuthProvider>
          <Routes>
            <Route path="login" element={<AdminLogin />} />
            <Route
              element={
                <RequireAuth>
                  <AdminLayout />
                </RequireAuth>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="projects" element={<ProjectsList />} />
              <Route path="projects/new" element={<ProjectForm />} />
              <Route path="projects/:id" element={<ProjectForm />} />
            </Route>
          </Routes>
        </AdminAuthProvider>
      </QueryClientProvider>
    </div>
  );
}
