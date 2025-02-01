import { motion } from "framer-motion";

export default function Stats() {
    const stats = [
        { number: "10K+", label: "Residents Served" },
        { number: "24/7", label: "Service Availability" },
        { number: "95%", label: "Satisfaction Rate" },
        { number: "5min", label: "Average Response Time" },
    ];

    return (
        <section className="py-20 bg-green-700">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="text-center text-white"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                            <div className="text-green-100">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
