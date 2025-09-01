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
import { Plus, Edit, Trash2, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockIncomeData = [
  {
    id: 1,
    description: "Salary",
    amount: 4200.0,
    category: "Job",
    date: "2024-03-01",
  },
  {
    id: 2,
    description: "Freelance Project",
    amount: 800.0,
    category: "Freelance",
    date: "2024-03-15",
  },
  {
    id: 3,
    description: "Investment Returns",
    amount: 150.0,
    category: "Investment",
    date: "2024-03-20",
  },
];

type Income = (typeof mockIncomeData)[number];

const incomeCategories = [
  "Job",
  "Freelance",
  "Investment",
  "Business",
  "Other",
];

export default function Income() {
  const [incomes, setIncomes] = useState(mockIncomeData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
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
    const incomeData = {
      id: editingIncome?.id || Date.now(),
      description: formData.get("description") as string,
      amount: parseFloat(formData.get("amount") as string),
      category: formData.get("category") as string,
      date: formData.get("date") as string,
    };

    if (editingIncome) {
      setIncomes(
        incomes.map((inc) => (inc.id === editingIncome.id ? incomeData : inc))
      );
      toast({ title: "Income updated successfully" });
    } else {
      setIncomes([...incomes, incomeData]);
      toast({ title: "Income added successfully" });
    }

    setIsDialogOpen(false);
    setEditingIncome(null);
  };

  const handleEdit = (income: Income) => {
    setEditingIncome(income);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setIncomes(incomes.filter((inc) => inc.id !== id));
    toast({ title: "Income deleted successfully" });
  };

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="finance" onClick={() => setEditingIncome(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Income
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingIncome ? "Edit Income" : "Add New Income"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  defaultValue={editingIncome?.description}
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
                  defaultValue={editingIncome?.amount}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue={editingIncome?.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {incomeCategories.map((category) => (
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
                  defaultValue={editingIncome?.date}
                  required
                />
              </div>
              <Button type="submit" className="w-full" variant="finance">
                {editingIncome ? "Update Income" : "Add Income"}
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
            {formatCurrency(totalIncome)}
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
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Category: {income.category}</span>
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
