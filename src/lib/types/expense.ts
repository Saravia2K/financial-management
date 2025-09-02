import { Database } from "../database.types";

export type Expense = Database["public"]["Tables"]["expense"]["Row"];

export type NewExpenseData = Database["public"]["Tables"]["expense"]["Insert"];

export type UpdateExpenseData = Omit<
  Database["public"]["Tables"]["expense"]["Update"],
  "id"
>;
