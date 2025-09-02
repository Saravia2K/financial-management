import { Database } from "../database.types";

export type Income = Database["public"]["Tables"]["income"]["Row"];

export type NewIncomeData = Database["public"]["Tables"]["income"]["Insert"];

export type UpdateIncomeData = Omit<
  Database["public"]["Tables"]["income"]["Update"],
  "id"
>;
