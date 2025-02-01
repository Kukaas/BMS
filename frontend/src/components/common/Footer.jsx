import { Facebook, Instagram, Mail, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-green-500">GASAN BMS</h3>
                        <p className="text-gray-400">Empowering our barangays through technology</p>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Facebook size={20} />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Twitter size={20} />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/about"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/features"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Services</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/services/documents"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Document Requests
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/services/reports"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Incident Reports
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/services/assistance"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Resident Assistance
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact</h4>
                        <div className="space-y-2 text-gray-400">
                            <p>Municipality of Gasan</p>
                            <p>Marinduque, Philippines</p>
                            <p className="flex items-center gap-2">
                                <Mail size={16} />
                                info@gasanbms.gov.ph
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
                    <p>
                        &copy; {new Date().getFullYear()} GASAN Barangay Management System. All
                        rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
