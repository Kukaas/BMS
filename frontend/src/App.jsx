import { PageNotFound } from "@/components/common/404.view.jsx";
import Dashboard from "@/components/dashboard/Dashboard.jsx";
import PrivateRoute from "@/components/PrivateRoute.jsx";
import About from "@/pages/About.jsx";
import LandingPage from "@/pages/Index.jsx";
import RegisterBarangayUserPage from "@/pages/RegisterBarangayUser.jsx";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";
import ForgotPassword from "./pages/ForgotPassword";
import GetStarted from "./pages/GetStarted";
import SignIn from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import SignUp from "./pages/Signup";
import VerifyOTP from "./pages/VerifyOtp";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/user/userSlice";
import { isTokenExpired, isAdminRole } from "@/lib/auth";

const DashboardWrapper = () => {
    const location = useLocation();
    const tab = new URLSearchParams(location.search).get("tab") || "overview";
    const { currentUser } = useSelector((state) => state.user);

    const adminTabs = [
        "overview",
        "users",
        "requestdocs",
        "incidents",
        "residents",
        "blotterreports",
    ];

    const userTabs = ["overview", "requests", "reports", "blotter", "settings"];

    const validTabs = isAdminRole(currentUser?.role) ? adminTabs : userTabs;

    return validTabs.includes(tab) ? <Dashboard tab={tab} /> : <PageNotFound />;
};

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && isTokenExpired(token)) {
            dispatch(logout());
            localStorage.removeItem("token");
        }
    }, [dispatch]);

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
