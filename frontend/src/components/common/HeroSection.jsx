import gasanHall from "@/assets/gasan.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
    const navigate = useNavigate();

    return (
        <section className="relative bg-gradient-to-br from-green-600 to-green-800 text-white pt-32 pb-24 overflow-hidden select-text">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="flex-1 text-center lg:text-left">
                        <h1 className="text-4xl lg:text-7xl font-bold mb-6 leading-tight">
                            Welcome to <br />
                            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                GASAN BMS
                            </span>
                        </h1>
                        <p className="text-xl mb-8 text-gray-200 max-w-2xl">
                            Empowering our community through efficient digital governance.
                            Experience seamless barangay services at your fingertips.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Button
                                size="lg"
                                className="bg-white text-green-700 hover:bg-green-50"
                                onClick={() => navigate("/get-started")}
                            >
                                Get Started
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="bg-white text-green-700 hover:bg-green-50"
                                onClick={() => navigate("/about")}
                            >
                                Learn More About Us
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1">
                        <img
                            src={gasanHall}
                            alt="Gasan Municipal Town Hall"
                            width={800}
                            height={600}
                            loading="eager"
                            decoding="async"
                            className="w-full max-w-2xl mx-auto rounded-lg shadow-2xl"
                            style={{ aspectRatio: "4/3" }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
