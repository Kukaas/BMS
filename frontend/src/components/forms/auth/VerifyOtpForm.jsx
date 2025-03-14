// Third-party libraries
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Link } from "react-router-dom";

// Components and UI elements
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

// Utilities
import { cn } from "@/lib/utils";

// Hooks
import { useForm } from "react-hook-form";

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";

const schema = z.object({
    otp: z.string().min(6),
});

const COOLDOWN_TIME = 60; // 1 minute in seconds
const MAX_OTP_ATTEMPTS = 5;

export default function VerifyOTPForm({ className }) {
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [resendLoading, setResendLoading] = useState(false);
    const [attempts, setAttempts] = useState(() => {
        return parseInt(localStorage.getItem("otpAttempts") || "1");
    });
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            otp: "",
        },
    });

    useEffect(() => {
        // Check if email exists in localStorage
        const email = localStorage.getItem("email");
        if (!email) {
            navigate("/forgot-password");
            return;
        }

        // Get stored countdown time and expiry from localStorage
        const storedExpiry = localStorage.getItem("otpCooldownExpiry");
        if (storedExpiry) {
            const timeLeft = Math.ceil((parseInt(storedExpiry) - Date.now()) / 1000);
            if (timeLeft > 0) {
                setCountdown(timeLeft);
            } else {
                localStorage.removeItem("otpCooldownExpiry");
            }
        }
    }, [navigate]);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => {
                    const newCount = prev - 1;
                    if (newCount <= 0) {
                        localStorage.removeItem("otpCooldownExpiry");
                    }
                    return newCount;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const handleResendOTP = async () => {
        try {
            if (attempts >= MAX_OTP_ATTEMPTS) {
                toast.error("Maximum OTP attempts reached", {
                    description: "Please try again after some time.",
                });
                return;
            }

            setResendLoading(true);
            const email = localStorage.getItem("email");

            if (!email) {
                toast.error("Email not found. Please try again.");
                navigate("/forgot-password");
                return;
            }

            const response = await axios.post("http://localhost:5000/api/auth/forgot-password", {
                email,
            });

            if (response.status === 200) {
                const newAttempts = attempts + 1;
                setAttempts(newAttempts);
                localStorage.setItem("otpAttempts", newAttempts.toString());

                setCountdown(COOLDOWN_TIME);
                const expiryTime = Date.now() + COOLDOWN_TIME * 1000;
                localStorage.setItem("otpCooldownExpiry", expiryTime.toString());

                toast.success("OTP resent successfully");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error("Email not found", {
                    description: "Please try another email.",
                });
                navigate("/forgot-password");
            } else {
                toast.error("Failed to resend OTP", {
                    description: "Please try again later.",
                });
            }
        } finally {
            setResendLoading(false);
        }
    };

    const handleVerifyOTP = async (values) => {
        const generateRandomToken = (length) => {
            let result = "";
            while (result.length < length) {
                result += Math.random().toString(36).substring(2); // Concatenate random strings
            }
            return result.substring(0, length); // Truncate to the desired length
        };

        const generatedToken = generateRandomToken(50);
        try {
            setLoading(true);
            const { otp } = values;
            const email = localStorage.getItem("email");

            if (!email) {
                toast.error("Email not found. Please try again.");
                navigate("/forgot-password");
                return;
            }

            if (!otp) {
                toast.error("OTP is required.");
                return;
            }

            const response = await axios.post("http://localhost:5000/api/auth/verify-otp", {
                otp,
                email,
            });

            if (response.status === 200) {
                toast.success("OTP verified successfully.");
                // Only remove OTP-related data, keep the email
                localStorage.removeItem("otpAttempts");
                localStorage.removeItem("otpCooldownExpiry");
                
                navigate(`/reset-password/${generatedToken}`);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Verification failed";
            toast.error(errorMessage, {
                description: "Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = () => {
        localStorage.removeItem("email");
        localStorage.removeItem("otpAttempts");
        localStorage.removeItem("otpCooldownExpiry");
        navigate("/sign-in");
    };

    return (
        <Form {...form}>
            <form
                className={cn("space-y-6", className)}
                onSubmit={form.handleSubmit(handleVerifyOTP)}
            >
                <div className="space-y-4 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Verify your email
                    </h1>
                    <p className="text-sm text-gray-600">
                        We have sent a 6-digit OTP to your email address. Please enter it below
                    </p>
                </div>

                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-center w-full">
                                <FormLabel className="text-sm font-medium text-gray-700 self-start mb-2">
                                    Enter verification code
                                </FormLabel>
                                <FormControl>
                                    <InputOTP
                                        maxLength={6}
                                        {...field}
                                        className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 w-full"
                                    >
                                        <InputOTPGroup className="group flex items-center justify-center gap-2 sm:gap-2">
                                            <InputOTPSlot
                                                index={0}
                                                className="h-12 w-12 sm:h-14 sm:w-14 text-center text-lg sm:text-xl font-semibold rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                                            />
                                            <InputOTPSlot
                                                index={1}
                                                className="h-12 w-12 sm:h-14 sm:w-14 text-center text-lg sm:text-xl font-semibold rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                                            />
                                            <InputOTPSlot
                                                index={2}
                                                className="h-12 w-12 sm:h-14 sm:w-14 text-center text-lg sm:text-xl font-semibold rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                                            />
                                        </InputOTPGroup>
                                        <InputOTPSeparator className="hidden sm:block mx-1 sm:mx-2 text-xl sm:text-2xl text-gray-400">
                                            -
                                        </InputOTPSeparator>
                                        <InputOTPGroup className="group flex items-center justify-center gap-2 sm:gap-2">
                                            <InputOTPSlot
                                                index={3}
                                                className="h-12 w-12 sm:h-14 sm:w-14 text-center text-lg sm:text-xl font-semibold rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                                            />
                                            <InputOTPSlot
                                                index={4}
                                                className="h-12 w-12 sm:h-14 sm:w-14 text-center text-lg sm:text-xl font-semibold rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                                            />
                                            <InputOTPSlot
                                                index={5}
                                                className="h-12 w-12 sm:h-14 sm:w-14 text-center text-lg sm:text-xl font-semibold rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                                            />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormMessage className="mt-2" />
                            </FormItem>
                        )}
                    />

                    <div className="text-center">
                        {attempts >= MAX_OTP_ATTEMPTS ? (
                            <p className="text-sm text-red-600">
                                Maximum attempts reached. Please try again later.
                            </p>
                        ) : countdown > 0 ? (
                            <p className="text-sm text-gray-600">
                                Resend OTP in{" "}
                                <span className="font-medium text-green-600">
                                    {Math.floor(countdown / 60)}:
                                    {(countdown % 60).toString().padStart(2, "0")}
                                </span>
                                <br />
                                <span className="text-xs text-gray-500">
                                    {MAX_OTP_ATTEMPTS - attempts} attempts remaining
                                </span>
                            </p>
                        ) : (
                            <div className="space-y-1">
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={resendLoading || attempts >= MAX_OTP_ATTEMPTS}
                                    className="text-sm font-medium text-green-600 hover:text-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {resendLoading ? "Sending..." : "Resend OTP"}
                                </button>
                                <p className="text-xs text-gray-500">
                                    {MAX_OTP_ATTEMPTS - attempts} attempts remaining
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full h-11 bg-green-600 hover:bg-green-700 text-white"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <span className="animate-spin">⏳</span> Verifying...
                        </div>
                    ) : (
                        "Verify OTP"
                    )}
                </Button>

                <div className="text-center text-sm text-gray-600">
                    Remember your password?{" "}
                    <button
                        type="button"
                        onClick={handleSignIn}
                        className="font-medium text-green-600 hover:text-green-500"
                    >
                        Sign in
                    </button>
                </div>
            </form>
        </Form>
    );
}

VerifyOTPForm.propTypes = {
    className: PropTypes.string,
};
