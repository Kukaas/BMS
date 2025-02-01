import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled ? "bg-green-700/95 backdrop-blur-sm shadow-lg py-4" : "bg-green-700 py-6"
            }`}
        >
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white">
                        <img src="/logo.svg" alt="Logo" className="h-6 w-6" />
                    </div>
                    <span className="text-2xl font-bold text-white">GASAN BMS</span>
                </Link>
                <nav className="hidden md:flex space-x-4 items-center">
                    <Button className="bg-white text-green-700 hover:bg-green-100">
                        <Link to="/sign-in">Login</Link>
                    </Button>
                </nav>
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <button
                            className="md:hidden p-0 bg-transparent border-none hover:scale-110 transition-transform duration-300 text-white"
                            onClick={toggleMenu}
                        >
                            <Menu size={24} />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="right" className="bg-green-700 text-white">
                        <nav className="flex flex-col space-y-4 mt-6">
                            <Link
                                to="/sign-in"
                                className="text-lg hover:text-green-200"
                                onClick={() => setIsOpen(false)}
                            >
                                Login
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
