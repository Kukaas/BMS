import { motion } from "framer-motion";
import { BarChart3, Clock, FileText, Phone, Shield, Users } from "lucide-react";

export default function Features() {
    const features = [
        {
            icon: <Users size={40} />,
            title: "Resident Management",
            description:
                "Efficiently manage resident information and services with our comprehensive database system",
        },
        {
            icon: <FileText size={40} />,
            title: "Document Processing",
            description:
                "Streamline document requests and processing with our automated workflow system",
        },
        {
            icon: <BarChart3 size={40} />,
            title: "Data Analytics",
            description: "Make informed decisions with powerful reporting and analytics tools",
        },
        {
            icon: <Shield size={40} />,
            title: "Secure Platform",
            description: "Your data is protected with enterprise-grade security measures",
        },
        {
            icon: <Clock size={40} />,
            title: "24/7 Access",
            description: "Access barangay services anytime, anywhere through our platform",
        },
        {
            icon: <Phone size={40} />,
            title: "Mobile Ready",
            description: "Use our services seamlessly on any device with our responsive design",
        },
    ];

    return (
        <section id="features" className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Experience the next generation of barangay management with our comprehensive
                        suite of features
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="text-green-600 mb-6 bg-green-50 w-16 h-16 rounded-xl flex items-center justify-center">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
