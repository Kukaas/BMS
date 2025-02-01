// Third-party libraries
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

// Components and UI elements
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

// Utilities
import { cn } from "@/lib/utils";

// Hooks
import { useForm } from "react-hook-form";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp";

const schema = z.object({
    otp: z.string().min(6),
});

export default function VerifyOTPForm({ className }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            otp: "",
        },
    });

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

            if (!otp) {
                toast.error("OTP is required.");
                return;
            }

            const response = await axios.post("http://localhost:5000/api/auth/verify-otp", {
                ...values,
                email: localStorage.getItem("email"),
            });

            if (response.status === 200) {
                toast.success("OTP verified successfully.");
                navigate(`/reset-password/${generatedToken}`);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setLoading(false);
                toast.error(error.response.data.message, {
                    description: "Please try again.",
                });
            } else if (error.response && error.response.status === 402) {
                setLoading(false);
                toast.error(error.response.data.message, {
                    description: "Please try again.",
                });
            } else if (error.response && error.response.status === 401) {
                setLoading(false);
                toast.error(error.response.data.message, {
                    description: "Please try again.",
                });
            } else if (error.response && error.response.status === 405) {
                setLoading(false);
                toast.error(error.response.data.message, {
                    description: "Please try again.",
                });
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <Form {...form}>
            <form
                className={cn("flex flex-col gap-6", className)}
                onSubmit={form.handleSubmit(handleVerifyOTP)}
            >
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Verify your email address</h1>
                    <p className="text-balance text-sm text-muted-foreground">
                        We have sent a 6-digit OTP to your email address. Please enter it
                    </p>
                </div>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>OTP</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Verifying..." : "Verify OTP"}
                    </Button>
                </div>
                <div className="text-center text-sm">
                    Remember your password?{" "}
                    <p
                        className="underline underline-offset-4 cursor-pointer"
                        onClick={() => navigate("/sign-in")}
                    >
                        Sign in
                    </p>
                </div>
            </form>
        </Form>
    );
}

VerifyOTPForm.propTypes = {
    className: PropTypes.string,
};
