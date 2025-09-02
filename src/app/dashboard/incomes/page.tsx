"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import useCategories from "@/hooks/useCategories"; // expects { categories: { incomes: Category[] }, realoadCategories?: () => void }
import useIncomes from "@/hooks/useIncomes";
import useUser from "@/hooks/useUser";
import IncomeTableSkeleton from "@/components/skeletons/IncomeTableSkeleton";
import FullScreenLoader from "@/components/skeletons/FullScreenLoader";
import { Category } from "@/lib/types/category";
import { Income } from "@/lib/types/income";
import createIncome from "@/services/incomes/create";
import deleteIncome from "@/services/incomes/delete";
import updateIncome from "@/services/incomes/update";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Plus, Trash2, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

// ---- Schema (RHF + Zod) ----
const Schema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z
    .unknown()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Amount must be a number greater than 0",
    }),
  categoryId: z
    .unknown()
    .transform((val) =>
      val === undefined || val === null || val === "none" || val === ""
        ? null
        : Number(val)
    ),
  date: z.string().refine((s) => !Number.isNaN(new Date(s).getTime()), {
    message: "Invalid date",
  }),
});

type FormFields = z.infer<typeof Schema>;

// ---- Utils ----
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount
  );

const todayYYYYMMDD = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

export default function IncomePage() {
  const { categories } = useCategories();
  const { user, loading: userLoading } = useUser();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  const userId = user?.id ?? "";
  const { incomes = [], reloadIncomes, incomesLoading } = useIncomes(userId); // Si userId aún no está, pasa string vacío (no traerá nada)

  // --- Derived data ---
  const incomeCategories = (categories?.incomes ?? []) as Category[];
  const getCategoryName = (id: number | null) =>
    id
      ? incomeCategories.find((c) => c.id === id)?.name ?? "—"
      : "Uncategorized";

  // --- RHF setup ---
  const {
    register,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(Schema),
    defaultValues: {
      description: "",
      amount: 0,
      categoryId: undefined,
      date: todayYYYYMMDD(),
    },
  });

  // Set default categoryId to first category when categories change
  useEffect(() => {
    if (incomeCategories.length > 0) {
      setValue("categoryId", incomeCategories[0].id, { shouldValidate: true });
    }
  }, [incomeCategories, setValue]);

  const totalIncomeThisMonth = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    return (incomes ?? [])
      .filter((i) => {
        const d = new Date(i.date);
        return d.getFullYear() === y && d.getMonth() === m;
      })
      .reduce((sum, i) => sum + i.amount, 0);
  }, [incomes]);

  // --- Handlers ---
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (!userId) return;
    const payload = {
      description: data.description.trim(),
      amount: data.amount,
      category: data.categoryId ?? null,
      date: data.date,
      user_id: userId,
    };

    if (editingIncome) {
      await updateIncome(editingIncome.id, payload);
      toast({ title: "Income updated successfully" });
    } else {
      await createIncome(payload);
      toast({ title: "Income added successfully" });
    }

    await reloadIncomes();
    setIsDialogOpen(false);
    setEditingIncome(null);
    reset({
      description: "",
      amount: 0,
      categoryId: null,
      date: todayYYYYMMDD(),
    });
  };

  const openAddDialog = () => {
    setEditingIncome(null);
    reset({
      description: "",
      amount: 0,
      categoryId: null,
      date: todayYYYYMMDD(),
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (income: Income) => {
    setEditingIncome(income);
    reset({
      description: income.description,
      amount: income.amount,
      categoryId: income.category,
      date: income.date,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteIncome(id);
    await reloadIncomes();
    toast({ title: "Income deleted successfully" });
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingIncome(null);
      reset({
        description: "",
        amount: 0,
        categoryId: null,
        date: todayYYYYMMDD(),
      });
    }
  };

  if (userLoading) {
    return <FullScreenLoader />;
  }
  if (!userId) {
    return <div className="p-6">No hay usuario autenticado.</div>;
  }
  if (incomesLoading) {
    return <IncomeTableSkeleton />;
  }
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-finance-primary to-finance-accent bg-clip-text text-transparent">
            Income Management
          </h1>
          <p className="text-muted-foreground">
            Track and manage your income sources
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <Button variant="finance" onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Income
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingIncome ? "Edit Income" : "Add New Income"}
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
                  {...register("amount")}
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
                    watch("categoryId") ?? incomeCategories[0]?.id ?? ""
                  )}
                  onValueChange={(val) => {
                    setValue("categoryId", Number(val), {
                      shouldValidate: true,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {incomeCategories.map((c) => (
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
                  : editingIncome
                  ? "Update Income"
                  : "Add Income"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Card */}
      <Card className="mb-6 bg-gradient-to-br from-finance-success/10 to-finance-accent/10 border-finance-success/20">
        <CardHeader>
          <CardTitle className="flex items-center text-finance-success">
            <TrendingUp className="h-5 w-5 mr-2" />
            Total Income This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-finance-success">
            {formatCurrency(totalIncomeThisMonth)}
          </div>
        </CardContent>
      </Card>

      {/* Income List */}
      <div className="space-y-4">
        {incomes.map((income) => (
          <Card key={income.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex-1">
                <h3 className="font-semibold">{income.description}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span>Category: {getCategoryName(income.category)}</span>
                  <span>
                    Date: {new Date(income.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-xl font-bold text-finance-success">
                  {formatCurrency(income.amount)}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(income)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(income.id)}
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
