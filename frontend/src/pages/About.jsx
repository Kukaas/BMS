import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Award, Heart, Shield, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function About() {
    const navigate = useNavigate();

    const values = [
        {
            icon: <Users className="h-6 w-6" />,
            title: "Community-Centric",
            description:
                "We put our community first in everything we do, ensuring services that truly matter.",
        },
        {
            icon: <Shield className="h-6 w-6" />,
            title: "Transparency",
            description:
                "We believe in open, honest governance and clear communication with our residents.",
        },
        {
            icon: <Award className="h-6 w-6" />,
            title: "Excellence",
            description:
                "We strive for excellence in our service delivery and continuous improvement.",
        },
        {
            icon: <Heart className="h-6 w-6" />,
            title: "Compassion",
            description:
                "We serve with empathy and understanding, ensuring no one in our community is left behind.",
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
                {/* Mission Section */}
                <motion.section
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        To provide efficient, transparent, and accessible barangay services through
                        digital innovation, enhancing the quality of life for all residents of
                        Gasan.
                    </p>
                </motion.section>

                {/* Values Section */}
                <motion.section
                    className="mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Our Values
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                className="bg-white rounded-lg shadow-lg p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                            >
                                <div className="text-green-600 mb-4">{value.icon}</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Vision Section */}
                <motion.section
                    className="bg-white rounded-lg shadow-lg p-8 mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                        Our Vision
                    </h2>
                    <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
                        To be the leading example of digital governance at the barangay level,
                        creating a more connected, efficient, and prosperous community for all
                        residents of Gasan.
                    </p>
                </motion.section>

                {/* CTA Section */}
                <motion.section
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Ready to be part of our community?
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Join us in building a better barangay for everyone
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => navigate("/sign-up")}
                        >
                            <span className="flex items-center gap-2">
                                Get Started <ArrowRight className="h-4 w-4" />
                            </span>
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => navigate("/sign-in")}>
                            Sign In
                        </Button>
                    </div>
                </motion.section>
            </main>
        </div>
    );
}
