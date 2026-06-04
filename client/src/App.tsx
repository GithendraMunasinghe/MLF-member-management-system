import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/adminpanel/AdminLogin";
import AdminDashboard from "./pages/adminpanel/dashboard/AdminDashboard";
import AddMemberPage from "@/pages/adminpanel/members/AddMemberPage";
import AdminLayout from "./components/adminpanel/AdminLayout";
import MembersPage from "./pages/adminpanel/members/MembersPage";
import DraftsPage from "./pages/adminpanel/members/DraftsPage";


import ProtectedRoute from "@/components/adminpanel/ProtectedRoute";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <ScrollToTop />

        <Routes>
          {/* Admin Login */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* ✅ Admin Panel (FIXED STRUCTURE) */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="add-member" element={<AddMemberPage />} />
            <Route path="add-member/:id" element={<AddMemberPage />} />
            <Route path="drafts" element={<DraftsPage />} />
            
            {/* <Route path="events" element={<Events />} /> */}
            <Route path="organization" element={<div>Organization</div>} />
            <Route path="coordinators" element={<div>Coordinators</div>} />
            
          </Route>


          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Toaster />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;