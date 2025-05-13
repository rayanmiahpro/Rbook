import { z } from "zod";

export const validationSchema = z
  .string()
  .length(6, "validation code must be 6 characters");
