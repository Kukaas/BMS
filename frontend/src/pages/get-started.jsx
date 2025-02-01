import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, FileText, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function GetStarted() {
    const navigate = useNavigate();
    const steps = [
        {
            icon: <Users className="h-6 w-6" />,
            title: "Create an Account",
            description: "Sign up with your email and basic information to get started.",
        },
        {
            icon: <FileText className="h-6 w-6" />,
            title: "Complete Your Profile",
            description: "Add your barangay and other required details to your profile.",
        },
        {
            icon: <CheckCircle2 className="h-6 w-6" />,
            title: "Start Using Services",
            description: "Access various barangay services and features through the platform.",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-600 text-white">
                                <img src="/logo.svg" alt="Logo" className="h-6 w-6" />
                            </div>
                            <span className="text-xl font-semibold text-gray-900">GASAN BMS</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link
                                to="/sign-in"
                                className="text-sm font-medium text-gray-500 hover:text-gray-900"
                            >
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Get Started with GASAN BMS
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Follow these simple steps to start using our barangay management system
                    </p>
                    <div>
                        <Button
                            size="lg"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => navigate("/sign-up")}
                        >
                            <span className="flex items-center gap-2">
                                Create Account <ArrowRight className="h-4 w-4" />
                            </span>
                        </Button>
                    </div>
                </div>

                {/* Steps */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {steps.map((step, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                            <div className="text-green-600 mb-4">{step.icon}</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {step.title}
                            </h3>
                            <p className="text-gray-600">{step.description}</p>
                        </div>
                    ))}
                </div>

                {/* Features Preview */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        What you can do with GASAN BMS
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-gray-900">Request Documents</h3>
                                <p className="text-gray-600">
                                    Easily request barangay certificates and other documents online
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-gray-900">Submit Reports</h3>
                                <p className="text-gray-600">
                                    File incident reports and other concerns directly through the
                                    platform
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-gray-900">Track Requests</h3>
                                <p className="text-gray-600">
                                    Monitor the status of your document requests and reports
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-gray-900">Stay Updated</h3>
                                <p className="text-gray-600">
                                    Receive notifications about barangay announcements and events
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
                    <p className="text-gray-600 mb-8">
                        Join our community and experience seamless barangay services
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => navigate("/sign-up")}
                        >
                            Create Account
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => navigate("/about")}>
                            Learn More
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
