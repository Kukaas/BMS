import { PageNotFound } from "@/components/common/404.view.jsx";
import Dashboard from "@/components/dashboard/dashboard.jsx";
import PrivateRoute from "@/components/private-route.jsx";
import About from "@/pages/about.jsx";
import LandingPage from "@/pages/index.jsx";
import RegisterBarangayUserPage from "@/pages/register-barangay-user.jsx";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";
import ForgotPassword from "./pages/forgot-password";
import GetStarted from "./pages/get-started";
import SignIn from "./pages/login";
import ResetPassword from "./pages/reset-password";
import SignUp from "./pages/signup";
import VerifyOTP from "./pages/verify-otp";

const DashboardWrapper = () => {
    const location = useLocation();
    const tab = new URLSearchParams(location.search).get("tab") || "overview";

    const validTabs = [
        "overview",
        "barangay",
        "users",
        "reports",
        "settings",
        "requests",
        "blotter",
        "requestdocs",
        "incidents",
        "incident-report-admin",
        "residents",
        "home",
    ];

    return validTabs.includes(tab) ? <Dashboard tab={tab} /> : <PageNotFound />;
};

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/get-started" element={<GetStarted />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/admin/register" element={<RegisterBarangayUserPage />} />
                    <Route path="/verify-otp/:randomString" element={<VerifyOTP />} />
                    <Route path="/reset-password/:randomToken" element={<ResetPassword />} />
                    <Route path="*" element={<PageNotFound />} />

                    <Route element={<PrivateRoute />}>
                        <Route path="/dashboard" element={<DashboardWrapper />} />
                    </Route>
                </Routes>
            </BrowserRouter>
            <Toaster position="top-center" richColors />
        </>
    );
}

export default App;
