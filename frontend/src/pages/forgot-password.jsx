import ForgotPasswordForm from "@/components/forms/forgot-password-form";
import { ArrowLeft, GalleryVerticalEnd } from "lucide-react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
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

                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-md">
                        <ForgotPasswordForm />
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
                    <h2 className="text-4xl font-bold mb-4 text-center">Reset Your Password</h2>
                    <p className="text-lg text-center max-w-md">
                        Don't worry, we'll help you recover access to your account.
                    </p>
                </div>
            </div>
        </div>
    );
}
