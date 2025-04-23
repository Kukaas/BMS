import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ShieldCheck, Mail, X } from "lucide-react";
import api from "@/lib/axios";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function MFAVerificationDialog({ isOpen, onClose, onVerify, isVerifying }) {
    const [code, setCode] = useState("");
    const [resendCooldown, setResendCooldown] = useState(0);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        let interval;
        if (resendCooldown > 0) {
            interval = setInterval(() => {
                setResendCooldown((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [resendCooldown]);

    useEffect(() => {
        if (isOpen) {
            setCode("");
            setResendCooldown(30); // 30 second cooldown
            setCanResend(false);
        }
    }, [isOpen]);

    const handleResendCode = async () => {
        try {
            if (!canResend) return;

            await api.post("/mfa/send-login-code", {
                userId: localStorage.getItem("userId"),
                email: localStorage.getItem("loginEmail"),
            });

            setResendCooldown(30);
            setCanResend(false);
            toast.message("Verification code resent", {
                description: "Please check your email for the new code.",
                icon: <Mail className="h-5 w-5 text-blue-600" />,
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to resend code");
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!code) {
            toast.error("Please enter the verification code");
            return;
        }
        await onVerify(code);
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                        <ShieldCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <AlertDialogTitle className="text-center">
                        Two-Factor Authentication
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        Enter the verification code sent to your email to complete the login
                        process.
                    </AlertDialogDescription>

                    <Button
                        variant="ghost"
                        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </Button>
                </AlertDialogHeader>

                <form onSubmit={handleVerify} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Input
                            type="text"
                            placeholder="Enter verification code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="text-center text-lg tracking-widest h-12"
                            maxLength={6}
                        />
                        <p className="text-sm text-gray-500 text-center">
                            The code will expire in 5 minutes
                        </p>
                    </div>

                    <Button type="submit" className="w-full" disabled={isVerifying || !code}>
                        {isVerifying ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                <span>Verifying...</span>
                            </div>
                        ) : (
                            "Verify"
                        )}
                    </Button>

                    <div className="text-center">
                        <Button
                            type="button"
                            variant="link"
                            className={
                                !canResend ? "text-gray-400 cursor-not-allowed" : "text-green-600"
                            }
                            onClick={handleResendCode}
                            disabled={!canResend}
                        >
                            {canResend ? "Resend code" : `Resend code in ${resendCooldown}s`}
                        </Button>
                    </div>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}

MFAVerificationDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onVerify: PropTypes.func.isRequired,
    isVerifying: PropTypes.bool,
};
