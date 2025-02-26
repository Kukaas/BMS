import { z } from "zod";

export const barangayClearanceSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    name: z.string().min(1, "Full name is required"),
    age: z.number().min(1, "Age is required").max(150, "Invalid age"),
    email: z.string().email("Invalid email format"),
    barangay: z.string().min(1, "Barangay is required"),
    purpose: z.enum(
        [
            "Employment",
            "Business",
            "Travel",
            "Identification",
            "Permit",
            "Legal",
            "Residency",
            "Banking",
        ],
        {
            required_error: "Purpose is required",
        }
    ),
    contactNumber: z.string().min(1, "Contact number is required"),
    purok: z.enum(
        ["Purok I", "Purok II", "Purok III", "Purok IV", "Purok V", "Purok VI", "Purok VII"],
        {
            required_error: "Purok is required",
        }
    ),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    sex: z.enum(["Male", "Female"], {
        required_error: "Sex is required",
    }),
    placeOfBirth: z.string().min(1, "Place of birth is required"),
    civilStatus: z.enum(["Single", "Married", "Widowed", "Separated"], {
        required_error: "Civil status is required",
    }),
});

export const barangayIndigencySchema = z.object({
    name: z.string().min(1, "Full name is required"),
    age: z.string().min(1, "Age is required"),
    barangay: z.string().min(1, "Barangay is required"),
    contactNumber: z.string().min(1, "Contact number is required"),
    purpose: z.enum(
        ["Medical Assistance", "Financial Assistance", "Food Assistance", "Burial Assistance"],
        {
            required_error: "Purpose is required",
        }
    ),
});

export const sedulaSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    address: z.string().min(1, "Address is required"),
    occupation: z.string().min(1, "Occupation is required"),
    civilStatus: z.string().min(1, "Civil status is required"),
    grossAnnualIncome: z.string().min(1, "Gross annual income is required"),
});

export const incidentReportSchema = z.object({
    category: z.string().min(1, "Category is required"),
    subCategory: z.string().min(1, "Sub-category is required"),
    date: z.string().min(1, "Date is required"),
    time: z.string().min(1, "Time is required"),
    location: z.string().min(1, "Location is required"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    reporterName: z.string().min(1, "Your name is required"),
    reporterContact: z.string().min(1, "Contact information is required"),
    evidenceFile: z
        .object({
            filename: z.string(),
            contentType: z.string(),
            data: z.string(),
        })
        .nullable()
        .optional(),
});

export const cedulaSchema = z.object({
    name: z.string().min(1, "Full name is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    placeOfBirth: z.string().min(1, "Place of birth is required"),
    barangay: z.string().min(1, "Barangay is required"),
    civilStatus: z.enum(["Single", "Married", "Widowed", "Separated"], {
        required_error: "Civil status is required",
    }),
    occupation: z.string().min(1, "Occupation is required"),
    employerName: z.string().optional(),
    employerAddress: z.string().optional(),
    salary: z.number().min(0, "Salary must be a positive number"),
});

export const businessClearanceSchema = z.object({
    ownerName: z.string().min(1, "Business owner's name is required"),
    businessName: z.string().min(1, "Business name is required"),
    barangay: z.string().min(1, "Barangay is required"),
    municipality: z.string().min(1, "Municipality is required"),
    province: z.string().min(1, "Province is required"),
    businessType: z.string().min(1, "Type of business is required"),
    businessNature: z.enum(["Single Proprietorship", "Partnership", "Corporation"], {
        required_error: "Nature of business is required",
    }),
    ownerAddress: z.string().min(1, "Business owner's address is required"),
    contactNumber: z.string().min(1, "Contact number is required"),
    email: z.string().email("Invalid email format"),
    dtiSecRegistration: z.string().min(1, "DTI/SEC registration number is required"),
    mayorsPermit: z.string().optional(),
    leaseContract: z.string().optional(),
    barangayClearance: z.string().min(1, "Barangay clearance is required"),
    fireSafetyCertificate: z.string().optional(),
    sanitaryPermit: z.string().optional(),
    validId: z.string().min(1, "Valid ID information is required"),
});

export const blotterReportSchema = z.object({
    // Complainant Information
    complainantName: z.string().min(1, "Full name is required"),
    complainantAge: z.string().min(1, "Age is required"),
    complainantGender: z.string().min(1, "Gender is required"),
    complainantCivilStatus: z.string().min(1, "Civil status is required"),
    complainantAddress: z.string().min(1, "Address is required"),
    complainantContact: z.string().min(1, "Contact number is required"),

    // Respondent Information
    respondentName: z.string().min(1, "Respondent name is required"),
    respondentAddress: z.string().optional(),
    respondentContact: z.string().optional(),

    // Incident Details
    incidentDate: z.string().min(1, "Date of incident is required"),
    incidentTime: z.string().min(1, "Time of incident is required"),
    incidentLocation: z.string().min(1, "Location is required"),
    incidentType: z.string().min(1, "Type of incident is required"),
    narrative: z.string().min(1, "Narrative is required"),
    motive: z.string().optional(),

    // Witnesses
    witnessName: z.string().optional(),
    witnessContact: z.string().optional(),

    // Evidence
    evidenceFile: z
        .object({
            filename: z.string(),
            contentType: z.string(),
            data: z.string(),
        })
        .nullable()
        .optional(),

    // Action Requested
    actionRequested: z.enum(["Mediation", "Barangay Intervention", "Police/Court Action"], {
        required_error: "Please select an action",
    }),
});

export const officialSchema = z.object({
    name: z.string().min(1, "Name is required"),
    position: z.enum(["Chairman", "SK Chairman", "Kagawad", "Secretary", "Treasurer"], {
        required_error: "Position is required",
    }),
    contactNumber: z.string().min(1, "Contact number is required"),
    barangay: z.string().min(1, "Barangay is required"),
    image: z
        .object({
            filename: z.string(),
            contentType: z.string(),
            data: z.string(),
        })
        .optional()
        .nullable(),
});

// Add more schemas for other document types as needed
