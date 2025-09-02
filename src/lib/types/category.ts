import { Database } from "../database.types";

export type Category = Database["public"]["Tables"]["category"]["Row"];

export type NewCategoryData =
  Database["public"]["Tables"]["category"]["Insert"];

export type UpdateCategoryData = Omit<
  Database["public"]["Tables"]["category"]["Update"],
  "id"
>;

export type CategoryType = "income" | "expense";
