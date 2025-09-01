"use client";

import { useState } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockExpenseData = [
  {
    id: 1,
    description: "Grocery Shopping",
    amount: 320.5,
    category: "Food",
    date: "2024-03-01",
  },
  {
    id: 2,
    description: "Gas Station",
    amount: 65.0,
    category: "Transportation",
    date: "2024-03-03",
  },
  {
    id: 3,
    description: "Internet Bill",
    amount: 89.99,
    category: "Utilities",
    date: "2024-03-05",
  },
  {
    id: 4,
    description: "Restaurant Dinner",
    amount: 85.0,
    category: "Food",
    date: "2024-03-10",
  },
];

type Expense = (typeof mockExpenseData)[number];

const expenseCategories = [
  "Food",
  "Transportation",
  "Utilities",
  "Entertainment",
  "Healthcare",
  "Shopping",
  "Other",
];

export default function Expenses() {
  const [expenses, setExpenses] = useState(mockExpenseData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const expenseData = {
      id: editingExpense?.id || Date.now(),
      description: formData.get("description") as string,
      amount: parseFloat(formData.get("amount") as string),
      category: formData.get("category") as string,
      date: formData.get("date") as string,
    };

    if (editingExpense) {
      setExpenses(
        expenses.map((exp) =>
          exp.id === editingExpense.id ? expenseData : exp
        )
      );
      toast({ title: "Expense updated successfully" });
    } else {
      setExpenses([...expenses, expenseData]);
      toast({ title: "Expense added successfully" });
    }

    setIsDialogOpen(false);
    setEditingExpense(null);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
    toast({ title: "Expense deleted successfully" });
  };

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="finance" onClick={() => setEditingExpense(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingExpense ? "Edit Expense" : "Add New Expense"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  defaultValue={editingExpense?.description}
                  required
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  defaultValue={editingExpense?.amount}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue={editingExpense?.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={editingExpense?.date}
                  required
                />
              </div>
              <Button type="submit" className="w-full" variant="finance">
                {editingExpense ? "Update Expense" : "Add Expense"}
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
            {formatCurrency(totalExpenses)}
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
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Category: {expense.category}</span>
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
