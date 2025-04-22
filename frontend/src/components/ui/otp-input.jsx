import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

export function OTPInput({ length = 6, value, onChange, className }) {
    const [otp, setOtp] = useState(value || new Array(length).fill(""));
    const inputRefs = useRef([]);

    useEffect(() => {
        if (value) {
            setOtp(value.split("").concat(new Array(length - value.length).fill("")));
        }
    }, [value, length]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Trigger onChange with complete value
        const otpValue = newOtp.join("");
        onChange?.(otpValue);

        // Move to next input if current field is filled
        if (element.value && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Move to previous input on backspace
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").slice(0, length).split("");

        if (pasteData) {
            let newOtp = [...otp];
            pasteData.forEach((value, index) => {
                if (index < length && !isNaN(value)) {
                    newOtp[index] = value;
                    inputRefs.current[index].value = value;
                }
            });
            setOtp(newOtp);

            // Trigger onChange with pasted value
            const otpValue = newOtp.join("");
            onChange?.(otpValue);

            // Focus last input or first empty input
            const lastFilledIndex = newOtp.findIndex((val) => !val);
            const focusIndex = lastFilledIndex === -1 ? length - 1 : lastFilledIndex;
            inputRefs.current[focusIndex].focus();
        }
    };

    return (
        <div className={cn("flex gap-2", className)}>
            {otp.map((digit, index) => (
                <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className="h-12 w-12 rounded-lg border-2 border-gray-200 text-center text-xl font-semibold 
                             focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20
                             transition-all duration-200"
                />
            ))}
        </div>
    );
}

OTPInput.propTypes = {
    length: PropTypes.number,
    value: PropTypes.string,
    onChange: PropTypes.func,
    className: PropTypes.string,
};
