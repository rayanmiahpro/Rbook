import { z } from "zod";

export const signupSchema = z.object({
  FullName: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters long" })
    .max(50, { message: "Full name must be at most 50 characters long" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password must be at most 100 characters long" }),
  avator: z.string().url({ message: "Invalid URL for avatar" }),
  coverImage: z
    .string()
    .url({ message: "Invalid URL for cover image" })
    .optional(),
});
