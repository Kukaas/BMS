import jwt from "jsonwebtoken";

export const setToken = (res, userData) => {
    const token = jwt.sign(
        {
            id: userData._id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            barangay: userData.barangay,
            isVerified: userData.isVerified,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    return token;
};
