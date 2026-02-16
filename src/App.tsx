import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import AuthCallback from "./components/auth/AuthCallBack";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import { SidebarProvider } from "./context/SidebarContext";
import { SkeletonTheme } from "react-loading-skeleton";

// Dashboard components
import Sidebar from "./components/dashboard/Sidebar";
import MyTechStack from "./components/tech-stack/MyTechStack";
import SubscriptionDashboard from "./components/dashboard/SubscriptionDashboard";
import SignIn from "./pages/auth/signin/page";
import SignUp from "./pages/auth/signup/page";
import ResetPassword from "./pages/auth/reset-password/page";
import ForgotPassword from "./pages/auth/forgot-password/page";
import AuthConfirmationPage from "./pages/auth/verify-email/page";
import ResendVerificationLink from "./pages/auth/resend-verification-link/page";
import Onboarding from "./pages/onboarding/page";
import HomeContent from "./pages/dashboard/page";
import MyLibrary from "./pages/my-library/page";
import Discover from "./pages/discover/page";
import { TawkLayout } from "./components/layouts/TawkLayout";
import Reviews from "./pages/reviews/page";
import ScrollToTop, { storeReferralCode } from "./utils/helper";
import AccountSettings from "./pages/account-settings/page";
import { UserProfileProvider } from "./context/UseProfileContext";
import { LibraryToolsProvider } from "./context/LibraryToolsContext";
import { CollectionsProvider } from "./context/CollectionsContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import CompareTools from "./pages/compare/page";
import { CurrentUserProvider } from "./context/CurrentUserContext";
import { DefaultToolsProvider } from "./context/DefaultToolsContext";
import { CollectionToolsProvider } from "./context/CollectionToolsContext";
import { NotificationProvider } from "./context/NotificationContext";
import { AuthProvider } from "./context/AuthContextProvider";
import { CurrencyProvider } from "./context/CurrencyContext";
import Rewards from "./pages/rewards/page";
import { StreakProvider } from "./context/StreakContext";
import ShortRedirect from "./pages/auth/short-redirect";
import { CollectionToolsByIdProvider } from "./context/CollectionToolsByIdContext";
import { ToolByLibraryIdProvider } from "./context/ToolByLibraryIdContext";
import AdminSidebar from "./components/dashboard/AdminDashboard/adminSideBar";
import Overview from "./pages/admin/overview/page";
import { MetricsProvider } from "./context/adminContext/mertricsContext";
import AdminSignin from "./pages/admin/auth/signin/page";
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute";
import Unauthorized from "./pages/admin/auth/unauthorized/page";
import { UserActivitiesProvider } from "./context/adminContext/userActivitiesContext";
import ToolManagement from "./pages/admin/tool-management/page";
import { AllUsersProvider } from "./context/adminContext/allUsersContext";
import UserRewards from "./pages/admin/rewards/page";
import UsersManagement from "./pages/admin/user-management/page";
import UserInsights from "./pages/admin/user-insights/page";
import { UserDatasProvider } from "./context/adminContext/userDatas";
import Landing from "./pages/landing/page";
import Contact from "./pages/contact/page";
import Footer from "./components/landing-page/footer";
import { ToolsMetricsProvider } from "./context/adminContext/toolMetricsContext";
import Engagement from "./pages/admin/engagement/page";
import { EngagementProvider } from "./context/adminContext/engagement";
import AdminBlog from "./pages/admin/blog/page";
import AddBlog from "./pages/admin/add-blog/page";
import { AuthorsProvider } from "./context/adminContext/blog/fetchAuthorContext";
import EditBlog from "./pages/admin/edit-blog/page";
import Blog from "./pages/blog/page";
import { PublicBlogsProvider } from "./context/BlogContext";
import BlogPreview from "./pages/blog-preview/page";
import { RewardsMetricsProvider } from "./context/adminContext/rewards/rewardMetricsContext";
import { UserRewardsProvider } from "./context/adminContext/rewards/user-reward";

// Modified User Dashboard wrapper that just provides the layout
const DashboardLayout: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-[100dvh] lg:h-screen  lg:md:overflow-hidden w-full">
      <Sidebar />
      <main className="w-full bg-gray-50 px-[1rem] lg:px-[2rem] lg:pt-[2rem] min-h-screen flex-grow md:overflow-y-auto box-border lg:min-h-0">
        <Outlet />
      </main>
    </div>
  );
};

// Modified Admin Dashboard wrapper that just provides the layout
const AdminDashboardLayout: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-[100dvh] lg:h-screen  lg:md:overflow-hidden w-full">
      <AdminSidebar />
      <main className="w-full bg-gray-50 px-[1rem] lg:px-[2rem] lg:pt-[2rem] min-h-screen flex-grow md:overflow-y-auto box-border lg:min-h-0">
        <Outlet />
      </main>
    </div>
  );
};

// Combined wrapper for protected user dashboard routes
const ProtectedDashboardLayout: React.FC = () => {
  return (
    <ProtectedRoute>
      <UserProfileProvider>
        <TawkLayout>
          <DashboardLayout />
        </TawkLayout>
      </UserProfileProvider>
    </ProtectedRoute>
  );
};

const ProtectedAdminDashboardLayout: React.FC = () => {
  return (
    <AdminProtectedRoute>
      <UserProfileProvider>
        <AdminDashboardLayout />
      </UserProfileProvider>
    </AdminProtectedRoute>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    storeReferralCode();
  }, []);

  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <AuthProvider>
        <SidebarProvider>
          <NotificationProvider>
            <CurrentUserProvider>
              <DefaultToolsProvider>
                <UserProfileProvider>
                  <LibraryToolsProvider>
                    <CollectionToolsProvider>
                      <CollectionToolsByIdProvider>
                        <ToolByLibraryIdProvider>
                          <CollectionsProvider>
                            <CurrencyProvider>
                              <StreakProvider>
                                <SubscriptionProvider>
                                  <UserProvider>
                                    <ToastContainer
                                      position="top-right"
                                      autoClose={3000}
                                      hideProgressBar={false}
                                      newestOnTop={false}
                                      closeOnClick
                                      pauseOnFocusLoss
                                      draggable
                                      pauseOnHover
                                      theme="light"
                                    />

                                    <Router>
                                      <ScrollToTop />
                                      <Routes>
                                        {/* New User Survey */}
                                        <Route
                                          path="/onboarding"
                                          element={
                                            <ProtectedRoute>
                                              <Onboarding />
                                            </ProtectedRoute>
                                          }
                                        />

                                        {/* Auth Routes  */}
                                        <Route
                                          path="/"
                                          element={
                                            <TawkLayout>
                                              <Landing />
                                            </TawkLayout>
                                          }
                                        />
                                        <Route
                                          path="/contact"
                                          element={
                                            <div className="flex flex-col">
                                              <Contact />
                                              <Footer />
                                            </div>
                                          }
                                        />
                                        <Route
                                          path="/blog"
                                          element={
                                            <div className="flex flex-col">
                                              <PublicBlogsProvider>
                                                <Blog />
                                              </PublicBlogsProvider>
                                              <Footer />
                                            </div>
                                          }
                                        />

                                        <Route
                                          path="/blog/:id"
                                          element={<BlogPreview />}
                                        />

                                        <Route
                                          path="/signin"
                                          element={<SignIn />}
                                        />
                                        <Route
                                          path="/signup"
                                          element={<SignUp />}
                                        />
                                        <Route
                                          path="/auth/confirm"
                                          element={<AuthConfirmationPage />}
                                        />
                                        <Route
                                          path="/auth/verify"
                                          element={<ResendVerificationLink />}
                                        />
                                        <Route
                                          path="/forgot-password"
                                          element={<ForgotPassword />}
                                        />
                                        <Route
                                          path="/reset-password"
                                          element={<ResetPassword />}
                                        />

                                        <Route
                                          path="/auth/callback"
                                          element={<AuthCallback />}
                                        />
                                        <Route
                                          path="/s/:shortCode"
                                          element={<ShortRedirect />}
                                        />

                                        {/* User Dashboard Routes - Using nested routes with shared layout */}
                                        <Route
                                          path="/dashboard"
                                          element={<ProtectedDashboardLayout />}
                                        >
                                          <Route
                                            index
                                            element={<HomeContent />}
                                          />
                                          <Route
                                            path="discover"
                                            element={<Discover />}
                                          />
                                          <Route
                                            path="library"
                                            element={<MyLibrary />}
                                          />
                                          <Route
                                            path="tech-stack"
                                            element={<MyTechStack />}
                                          />
                                          <Route
                                            path="library/reviews"
                                            element={<Reviews />}
                                          />
                                          <Route
                                            path="library/compare"
                                            element={<CompareTools />}
                                          />
                                          <Route
                                            path="account-settings"
                                            element={<AccountSettings />}
                                          />
                                          <Route
                                            path="subscriptions"
                                            element={<SubscriptionDashboard />}
                                          />
                                          <Route
                                            path="earn-rewards"
                                            element={<Rewards />}
                                          />
                                          {/* Catch all route for dashboard paths */}
                                          <Route
                                            path="*"
                                            element={
                                              <Navigate
                                                to="/dashboard"
                                                replace
                                              />
                                            }
                                          />
                                        </Route>

                                        {/* admin dashboard routes */}

                                        <Route
                                          path="/admin"
                                          element={
                                            <ProtectedAdminDashboardLayout />
                                          }
                                        >
                                          <Route
                                            path="dashboard"
                                            element={
                                              <UserActivitiesProvider>
                                                <MetricsProvider>
                                                  <Overview />
                                                </MetricsProvider>
                                              </UserActivitiesProvider>
                                            }
                                          />
                                          <Route
                                            path="blog"
                                            element={
                                              <AuthorsProvider>
                                                <AdminBlog />
                                              </AuthorsProvider>
                                            }
                                          />
                                          <Route
                                            path="blog/create"
                                            element={
                                              <AuthorsProvider>
                                                <AddBlog />
                                              </AuthorsProvider>
                                            }
                                          />
                                          <Route
                                            path="blog/edit/:id"
                                            element={
                                              <AuthorsProvider>
                                                <EditBlog />
                                              </AuthorsProvider>
                                            }
                                          />
                                          <Route
                                            path="tool-management"
                                            element={
                                              <ToolsMetricsProvider>
                                                <ToolManagement />
                                              </ToolsMetricsProvider>
                                            }
                                          />
                                          <Route
                                            path="engagement"
                                            element={
                                              <EngagementProvider>
                                                <Engagement />
                                              </EngagementProvider>
                                            }
                                          />
                                          <Route
                                            path="user-insights"
                                            element={
                                              <UserDatasProvider>
                                                <UserInsights />
                                              </UserDatasProvider>
                                            }
                                          />
                                          <Route
                                            path="user-management"
                                            element={
                                              <AllUsersProvider>
                                                <UsersManagement />
                                              </AllUsersProvider>
                                            }
                                          />

                                          <Route
                                            path="rewards"
                                            element={
                                              <UserRewardsProvider>
                                                <RewardsMetricsProvider>
                                                  <UserRewards />
                                                </RewardsMetricsProvider>
                                              </UserRewardsProvider>
                                            }
                                          />
                                        </Route>
                                        {/* admin login */}
                                        <Route
                                          path="/admin/signin"
                                          element={<AdminSignin />}
                                        />

                                        <Route
                                          path="/unauthorized"
                                          element={<Unauthorized />}
                                        />
                                      </Routes>
                                    </Router>
                                  </UserProvider>
                                </SubscriptionProvider>
                              </StreakProvider>
                            </CurrencyProvider>
                          </CollectionsProvider>
                        </ToolByLibraryIdProvider>
                      </CollectionToolsByIdProvider>
                    </CollectionToolsProvider>
                  </LibraryToolsProvider>
                </UserProfileProvider>
              </DefaultToolsProvider>
            </CurrentUserProvider>
          </NotificationProvider>
        </SidebarProvider>
      </AuthProvider>
    </SkeletonTheme>
  );
};

export default App;
