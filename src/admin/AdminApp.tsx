import { Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { adminQueryClient } from "./lib/queryClient";
import { AdminAuthProvider, RequireAuth } from "./lib/auth";
import { AdminLangProvider, useAdminLang } from "./lib/adminI18n";
import AdminLayout from "./layout/AdminLayout";
import AdminLogin from "./pages/Login";
import AdminDashboard from "./pages/Dashboard";
import ProjectsList from "./pages/projects/ProjectsList";
import ProjectForm from "./pages/projects/ProjectForm";
import TestimonialsList from "./pages/testimonials/TestimonialsList";
import TestimonialForm from "./pages/testimonials/TestimonialForm";
import ClientsList from "./pages/clients/ClientsList";
import ClientForm from "./pages/clients/ClientForm";
import ServicesList from "./pages/services/ServicesList";
import ServiceForm from "./pages/services/ServiceForm";
import SkillsList from "./pages/skills/SkillsList";
import SkillForm from "./pages/skills/SkillForm";
import ExperienceList from "./pages/experience/ExperienceList";
import ExperienceForm from "./pages/experience/ExperienceForm";
import MessagesList from "./pages/messages/MessagesList";

// Mounted at /admin/* by the main App router. Deliberately isolated from
// the public site's providers (i18n, sound, GSAP scroll setup, cursor) —
// the admin dashboard has its own language state (AdminLangProvider,
// persisted separately from the public site's) and a non-animated tool UI.
export default function AdminApp() {
  return (
    <AdminLangProvider>
      <AdminAppShell />
    </AdminLangProvider>
  );
}

function AdminAppShell() {
  const { dir, lang } = useAdminLang();

  return (
    // The public site can leave document.dir="rtl" behind (persisted
    // Arabic preference), and Tailwind's logical-property classes
    // (ps-/pe-) resolve off the nearest `dir` ancestor, not just <html> —
    // so the admin panel's own language state drives its own `dir` here,
    // independent of whatever the visitor last set on the public site.
    <div dir={dir} lang={lang}>
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

              <Route path="testimonials" element={<TestimonialsList />} />
              <Route path="testimonials/new" element={<TestimonialForm />} />
              <Route path="testimonials/:id" element={<TestimonialForm />} />

              <Route path="clients" element={<ClientsList />} />
              <Route path="clients/new" element={<ClientForm />} />
              <Route path="clients/:id" element={<ClientForm />} />

              <Route path="services" element={<ServicesList />} />
              <Route path="services/new" element={<ServiceForm />} />
              <Route path="services/:id" element={<ServiceForm />} />

              <Route path="skills" element={<SkillsList />} />
              <Route path="skills/new" element={<SkillForm />} />
              <Route path="skills/:id" element={<SkillForm />} />

              <Route path="experience" element={<ExperienceList />} />
              <Route path="experience/new" element={<ExperienceForm />} />
              <Route path="experience/:id" element={<ExperienceForm />} />

              <Route path="messages" element={<MessagesList />} />
            </Route>
          </Routes>
        </AdminAuthProvider>
      </QueryClientProvider>
    </div>
  );
}
