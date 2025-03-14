import { PageNotFound } from "@/components/common/404.view.jsx";
import Dashboard from "@/components/dashboard/Dashboard.jsx";
import PrivateRoute from "@/components/PrivateRoute.jsx";
import { isTokenExpired } from "@/lib/auth";
import About from "@/pages/About.jsx";
import LandingPage from "@/pages/Index.jsx";
import { logout } from "@/redux/user/userSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";
import ForgotPassword from "./pages/ForgotPassword";
import GetStarted from "./pages/GetStarted";
import SignIn from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import SignUp from "./pages/Signup";
import VerifyOTP from "./pages/VerifyOtp";

const DashboardWrapper = () => {
    const location = useLocation();
    const tab = new URLSearchParams(location.search).get("tab") || "overview";
    const { currentUser } = useSelector((state) => state.user);

    const chairmanTabs = [
        "overview",
        "requestdocs",
        "incidents",
        "residents",
        "blotterreports",
        "transactions",
        "userlist",
    ];

    const secretaryTabs = [
        "overview",
        "requestdocs",
        "incidents",
        "residents",
        "blotterreports",
        "userlist",
    ];

    const superAdminTabs = ["overview", "register", "allusers", "logs", "transactions"];

    const userTabs = ["overview", "requests", "reports", "blotter"];

    // Determine valid tabs based on user role
    let validTabs;
    if (currentUser?.role === "superAdmin") {
        validTabs = superAdminTabs;
    } else if (currentUser?.role === "chairman") {
        validTabs = chairmanTabs;
    } else if (currentUser?.role === "secretary") {
        validTabs = secretaryTabs;
    } else {
        validTabs = userTabs;
    }

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
