"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Edit, Plus, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

// Mock data
const mockIncomeCategories = [
  {
    id: 1,
    name: "Job",
    description: "Primary employment income",
    type: "income",
  },
  {
    id: 2,
    name: "Freelance",
    description: "Freelance project earnings",
    type: "income",
  },
  {
    id: 3,
    name: "Investment",
    description: "Investment returns and dividends",
    type: "income",
  },
  { id: 4, name: "Business", description: "Business revenue", type: "income" },
];

const mockExpenseCategories = [
  { id: 5, name: "Food", description: "Groceries and dining", type: "expense" },
  {
    id: 6,
    name: "Transportation",
    description: "Gas, public transport, car maintenance",
    type: "expense",
  },
  {
    id: 7,
    name: "Utilities",
    description: "Electricity, water, internet bills",
    type: "expense",
  },
  {
    id: 8,
    name: "Entertainment",
    description: "Movies, games, subscriptions",
    type: "expense",
  },
  {
    id: 9,
    name: "Healthcare",
    description: "Medical expenses and insurance",
    type: "expense",
  },
  {
    id: 10,
    name: "Shopping",
    description: "Clothing and personal items",
    type: "expense",
  },
];

export default function Categories() {
  const [incomeCategories, setIncomeCategories] =
    useState(mockIncomeCategories);
  const [expenseCategories, setExpenseCategories] = useState(
    mockExpenseCategories
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryType, setCategoryType] = useState<"income" | "expense">(
    "income"
  );
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const categoryData = {
      id: editingCategory?.id || Date.now(),
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      type: formData.get("type") as "income" | "expense",
    };

    if (editingCategory) {
      if (categoryData.type === "income") {
        setIncomeCategories(
          incomeCategories.map((cat) =>
            cat.id === editingCategory.id ? categoryData : cat
          )
        );
      } else {
        setExpenseCategories(
          expenseCategories.map((cat) =>
            cat.id === editingCategory.id ? categoryData : cat
          )
        );
      }
      toast({ title: "Category updated successfully" });
    } else {
      if (categoryData.type === "income") {
        setIncomeCategories([...incomeCategories, categoryData]);
      } else {
        setExpenseCategories([...expenseCategories, categoryData]);
      }
      toast({ title: "Category added successfully" });
    }

    setIsDialogOpen(false);
    setEditingCategory(null);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number, type: string) => {
    if (type === "income") {
      setIncomeCategories(incomeCategories.filter((cat) => cat.id !== id));
    } else {
      setExpenseCategories(expenseCategories.filter((cat) => cat.id !== id));
    }
    toast({ title: "Category deleted successfully" });
  };

  const openAddDialog = (type: "income" | "expense") => {
    setCategoryType(type);
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  const CategoryCard = ({ category, onEdit, onDelete }: CategoryCardProps) => (
    <Card key={category.id}>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex-1">
          <h3 className="font-semibold flex items-center">
            {category.type === "income" ? (
              <TrendingUp className="h-4 w-4 mr-2 text-finance-success" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-2 text-finance-warning" />
            )}
            {category.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {category.description}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(category)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(category.id, category.type)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-finance-primary to-finance-accent bg-clip-text text-transparent">
            Category Management
          </h1>
          <p className="text-muted-foreground">
            Organize your income and expense categories
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingCategory?.name}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  defaultValue={editingCategory?.description}
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  name="type"
                  defaultValue={editingCategory?.type || categoryType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income Category</SelectItem>
                    <SelectItem value="expense">Expense Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" variant="finance">
                {editingCategory ? "Update Category" : "Add Category"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="income" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="income" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Income Categories
          </TabsTrigger>
          <TabsTrigger value="expense" className="flex items-center">
            <TrendingDown className="h-4 w-4 mr-2" />
            Expense Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="income" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-finance-success">
              Income Categories
            </h2>
            <Button variant="finance" onClick={() => openAddDialog("income")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Income Category
            </Button>
          </div>
          <div className="space-y-4">
            {incomeCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="expense" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-finance-warning">
              Expense Categories
            </h2>
            <Button variant="finance" onClick={() => openAddDialog("expense")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense Category
            </Button>
          </div>
          <div className="space-y-4">
            {expenseCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

type Category = {
  id: number;
  name: string;
  description: string;
  type: string;
};

type CategoryCardProps = {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: number, type: string) => void;
};
