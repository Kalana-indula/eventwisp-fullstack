import {z} from 'zod';

// Sri Lanka(ish) phone sample: +94XXXXXXXXX or 0XXXXXXXXX
const phoneRegex = /^(?:\+94\d{9}|0\d{9})$/;

// NIC/Passport examples (tweak to your rules):
// - Old NIC: 9 digits + V/X (e.g., 934218765V)
// - New NIC: 12 digits
// - Or passport: simple alnum 6–12
const nicPassportRegex = /^(?:\d{9}[VX]|[vx]|\d{12}|[A-Za-z0-9]{6,12})$/;

// Password: 8+ with upper, lower, number
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const registerOrganizerSchema = z
    .object({
        firstName: z.string().trim().min(1, "First name is required").max(100),
        lastName: z.string().trim().min(1, "Last name is required").max(100),
        nic: z
            .string()
            .trim()
            .min(1, "NIC/Passport is required")
            .regex(nicPassportRegex, "Enter a valid NIC/Passport"),
        companyName: z.string().trim().max(150).optional().or(z.literal("")),
        phone: z
            .string()
            .trim()
            .regex(phoneRegex, "Enter phone as +94XXXXXXXXX or 0XXXXXXXXX"),
        email: z.string().trim().email("Enter a valid email"),
        password: z
            .string()
            .regex(passwordRegex, "Invalid Password Format"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"], // error lands on confirm field
    });

// create a type
export type RegisterOrganizerForm = z.infer<typeof registerOrganizerSchema>;

// -------------------- Admin (new) --------------------
export const registerAdminSchema = z.object({
    firstName: z.string().trim().min(1, "First name is required").max(100),
    lastName: z.string().trim().min(1, "Last name is required").max(100),
    nic: z
        .string()
        .trim()
        .min(1, "NIC/Passport is required")
        .regex(nicPassportRegex, "Enter a valid NIC/Passport"),
    phone: z
        .string()
        .trim()
        .regex(phoneRegex, "Enter phone as +94XXXXXXXXX or 0XXXXXXXXX"),
    email: z.string().trim().email("Enter a valid email"),
    password: z
        .string()
        .regex(passwordRegex, "Invalid Password Format"),
    confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"], // error lands on confirm field
    });

export type RegisterAdminForm = z.infer<typeof registerAdminSchema>;

// -------------------- Update Password --------------------
// Validation schema
export const updatePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(6, "Current password must be at least 6 characters long")
        .max(50, "Current password is too long")
        .trim(),
    newPassword: z
        .string()
        .min(6, "New password must be at least 6 characters long")
        .max(50, "New password is too long")
        .trim()
        .refine(
            (val) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/.test(val),
            "New password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),
});

// Inferred TypeScript form type
export type UpdatePasswordForm = z.infer<typeof updatePasswordSchema>;

// -------------------- Update Email --------------------
export const updateEmailSchema = z.object({
    email: z.string().trim().email("Enter a valid email"),
});

export type UpdateEmailForm = z.infer<typeof updateEmailSchema>;

// -------------------- Update Contact Details --------------------
export const updateContactDetailsSchema = z.object({
    contactDetails: z
        .string()
        .trim()
        .min(1, "Contact details are required")
        .max(1000),
});

export type UpdateContactDetailsForm = z.infer<typeof updateContactDetailsSchema>;

// --------------------Delete user ----------------------------------
export const deleteUserSchema = z.object({
    email: z.string().trim().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});
export type DeleteUserForm = z.infer<typeof deleteUserSchema>;