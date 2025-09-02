import { PostgrestError } from "@supabase/supabase-js";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const serviceErrorMessage = (error: PostgrestError) => {
  throw new Error(`${error.name}: ${error.message} -> ${error.cause}`);
};

export const throwUnknownServiceError = (table: string) => {
  throw new Error(
    `Unknown error trying to proccess request in ${table.toLowerCase()}`
  );
};
