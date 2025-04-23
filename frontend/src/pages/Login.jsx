import { ArrowLeft, GalleryVerticalEnd, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getRedirectPath } from "@/lib/auth";
import { useEffect, useState } from "react";
import { LoginForm } from "@/components/forms/auth/LoginForm";
import { MFAVerificationDialog } from "@/components/forms/auth/MFAVerificationDialog";
import api from "@/lib/axios";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "@/redux/user/userSlice";
import { toast } from "sonner";

export default function SignIn() {
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [mfaDetails, setMfaDetails] = useState({ isOpen: false, userId: null });
    const [isVerifying, setIsVerifying] = useState(false);
    const [loginStep, setLoginStep] = useState("credentials"); // 'credentials' or 'mfa'
    const dispatch = useDispatch();

    useEffect(() => {
        if (currentUser) {
            const redirectPath = getRedirectPath(currentUser.role);
            navigate(redirectPath);
        }
    }, [currentUser, navigate]);

    const handleLogin = async (values) => {
        try {
            setLoginStep("credentials");
            dispatch(loginStart());

            const response = await api.post("/auth/login", values);

            if (response.data.requireMFA) {
                // If MFA is required, send the verification code and show MFA dialog
                await api.post("/mfa/send-login-code", { userId: response.data.userId });
                setLoginStep("mfa");
                setMfaDetails({ isOpen: true, userId: response.data.userId });
                toast.message("Two-factor authentication required", {
                    description: "Please check your email for the verification code.",
                    icon: <ShieldCheck className="h-5 w-5 text-green-600" />,
                });
                return;
            }

            // Regular login success
            const { user, token } = response.data;
            localStorage.setItem("token", token);
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            dispatch(loginSuccess({ ...user, token }));
            toast.success("Logged in successfully");
            navigate("/dashboard?tab=overview", { replace: true });
        } catch (error) {
            dispatch(loginFailure(error.response?.data?.message || "Login failed"));
            toast.error(error.response?.data?.message || "An error occurred during login");
        }
    };

    const handleVerifyMFA = async (code) => {
        try {
            setIsVerifying(true);
            const response = await api.post("/auth/login", {
                email: localStorage.getItem("loginEmail"),
                password: localStorage.getItem("loginPassword"),
                mfaCode: code,
            });

            const { user, token } = response.data;
            localStorage.setItem("token", token);
            // Clean up temporary login credentials
            localStorage.removeItem("loginEmail");
            localStorage.removeItem("loginPassword");

            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            dispatch(loginSuccess({ ...user, token }));
            toast.success("Logged in successfully");
            navigate("/dashboard?tab=overview", { replace: true });
            setMfaDetails({ isOpen: false, userId: null });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to verify MFA code");
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="h-screen flex overflow-hidden">
            {/* Left Panel - Form */}
            <div className="flex-1 flex flex-col p-8 md:p-12 lg:p-16 bg-white overflow-y-auto">
                <div className="flex items-center gap-2 mb-8">
                    <Link
                        to="/"
                        className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Back to Home
                    </Link>
                </div>

                <div className="flex items-center gap-2 mb-12">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-600 text-white">
                        <GalleryVerticalEnd className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-semibold text-gray-900">GASAN BMS</span>
                </div>

                {/* Progress indicator for MFA */}
                {loginStep === "mfa" && (
                    <div className="mb-8">
                        <div className="flex items-center justify-center space-x-4">
                            <div className="flex items-center">
                                <div className="h-6 w-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">
                                    ✓
                                </div>
                                <div className="ml-2 text-sm font-medium text-gray-900">
                                    Credentials
                                </div>
                            </div>
                            <div className="w-16 h-0.5 bg-green-600" />
                            <div className="flex items-center">
                                <div className="h-6 w-6 rounded-full border-2 border-green-600 text-green-600 flex items-center justify-center text-sm">
                                    2
                                </div>
                                <div className="ml-2 text-sm font-medium text-gray-900">
                                    Verification
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-md">
                        <LoginForm onSubmit={handleLogin} />
                        <MFAVerificationDialog
                            isOpen={mfaDetails.isOpen}
                            onClose={() => {
                                setMfaDetails({ isOpen: false, userId: null });
                                setLoginStep("credentials");
                                localStorage.removeItem("loginEmail");
                                localStorage.removeItem("loginPassword");
                            }}
                            onVerify={handleVerifyMFA}
                            isVerifying={isVerifying}
                        />
                    </div>
                </div>
            </div>

            {/* Right Panel - Image */}
            <div className="hidden lg:block lg:flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/90 to-green-800/90 mix-blend-multiply" />
                <img
                    src="https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80"
                    alt="Gasan, Marinduque"
                    className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
                    <h2 className="text-4xl font-bold mb-4 text-center">Welcome to Gasan BMS</h2>
                    <p className="text-lg text-center max-w-md">
                        Empowering our community through efficient digital governance and seamless
                        services.
                    </p>
                </div>
            </div>
        </div>
    );
}
