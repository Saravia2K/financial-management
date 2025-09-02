"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useCategories from "@/hooks/useCategories";
import useExpenses from "@/hooks/useExpenses";
import useUser from "@/hooks/useUser";
import IncomeTableSkeleton from "@/components/skeletons/IncomeTableSkeleton";
import FullScreenLoader from "@/components/skeletons/FullScreenLoader";
import { Category } from "@/lib/types/category";
import { Expense } from "@/lib/types/expense";
import createExpense from "@/services/expenses/create";
import deleteExpense from "@/services/expenses/delete";
import updateExpense from "@/services/expenses/update";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

function todayYYYYMMDD() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

const expenseSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.number().positive("Amount must be positive"),
  categoryId: z.number().int().optional(),
  date: z.string().min(1, "Date is required"),
});
type FormFields = z.infer<typeof expenseSchema>;

export default function ExpensesPage() {
  const { toast } = useToast();
  const { user, loading: userLoading } = useUser();
  const userId = user?.id;
  const { expenses, expensesLoading, reloadExpenses } = useExpenses(
    userId ?? ""
  );
  const { categories, categoriesLoading } = useCategories(userId ?? "");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: "",
      amount: 0,
      categoryId: undefined,
      date: todayYYYYMMDD(),
    },
  });

  // Set default categoryId to first category when categories change
  useEffect(() => {
    if (categories.expenses.length > 0) {
      setValue("categoryId", categories.expenses[0].id, {
        shouldValidate: true,
      });
    }
  }, [categories.expenses, setValue]);

  const totalExpensesThisMonth = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    return (expenses ?? [])
      .filter((e) => {
        const d = new Date(e.date);
        return d.getFullYear() === y && d.getMonth() === m;
      })
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  // --- Handlers ---
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (!userId) return;
    const payload = {
      description: data.description.trim(),
      amount: data.amount,
      category: data.categoryId!, // always set by form
      date: data.date,
      user_id: userId,
    };

    if (editingExpense) {
      await updateExpense(editingExpense.id, payload);
      toast({ title: "Expense updated successfully" });
    } else {
      await createExpense(payload);
      toast({ title: "Expense added successfully" });
    }

    await reloadExpenses();
    setIsDialogOpen(false);
    setEditingExpense(null);
    reset({
      description: "",
      amount: 0,
      categoryId: undefined,
      date: todayYYYYMMDD(),
    });
  };

  const openAddDialog = () => {
    setEditingExpense(null);
    reset({
      description: "",
      amount: 0,
      categoryId: categories.expenses[0]?.id,
      date: todayYYYYMMDD(),
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    reset({
      description: expense.description,
      amount: expense.amount,
      categoryId: expense.category,
      date: expense.date,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteExpense(id);
    await reloadExpenses();
    toast({ title: "Expense deleted successfully" });
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingExpense(null);
      reset({
        description: "",
        amount: 0,
        categoryId: categories.expenses[0]?.id,
        date: todayYYYYMMDD(),
      });
    }
  };

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  function getCategoryName(categoryId: number | null) {
    const cat = categories.expenses.find((c: Category) => c.id === categoryId);
    return cat ? cat.name : "Unknown";
  }

  if (userLoading) {
    return <FullScreenLoader />;
  }
  if (!userId) {
    return <div className="p-6">No hay usuario autenticado.</div>;
  }
  if (expensesLoading) {
    return <IncomeTableSkeleton />;
  }
  if (categoriesLoading) {
    return <div className="p-6">Cargando categorías...</div>;
  }
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-finance-warning to-finance-accent bg-clip-text text-transparent">
            Expense Management
          </h1>
          <p className="text-muted-foreground">
            Track and manage your expenses
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <Button variant="finance" onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingExpense ? "Edit Expense" : "Add New Expense"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" {...register("description")} required />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  {...register("amount", { valueAsNumber: true })}
                  required
                />
                {errors.amount && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={String(
                    watch("categoryId") ?? categories.expenses[0]?.id ?? ""
                  )}
                  onValueChange={(val) => {
                    setValue("categoryId", Number(val), {
                      shouldValidate: true,
                    });
                  }}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.expenses.map((c: Category) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" {...register("date")} required />
                {errors.date && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.date.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                variant="finance"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "..."
                  : editingExpense
                  ? "Update Expense"
                  : "Add Expense"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Card */}
      <Card className="mb-6 bg-gradient-to-br from-finance-warning/10 to-finance-accent/10 border-finance-warning/20">
        <CardHeader>
          <CardTitle className="flex items-center text-finance-warning">
            <TrendingDown className="h-5 w-5 mr-2" />
            Total Expenses This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-finance-warning">
            {formatCurrency(totalExpensesThisMonth)}
          </div>
        </CardContent>
      </Card>

      {/* Expense List */}
      <div className="space-y-4">
        {expenses.map((expense) => (
          <Card key={expense.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex-1">
                <h3 className="font-semibold">{expense.description}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span>Category: {getCategoryName(expense.category)}</span>
                  <span>
                    Date: {new Date(expense.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-xl font-bold text-finance-warning">
                  {formatCurrency(expense.amount)}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(expense)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(expense.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
