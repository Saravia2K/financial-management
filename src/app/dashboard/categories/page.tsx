"use client";

import { useState } from "react";
import { Edit, Plus, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import useCategories from "@/hooks/useCategories";
import useUser from "@/hooks/useUser";
import create from "@/services/categories/create";
import update from "@/services/categories/update";
import deleteCategory from "@/services/categories/delete";

const Schema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.union([z.literal("income"), z.literal("expense")]),
});
type FormFields = z.infer<typeof Schema>;

export default function Categories() {
  const { user, loading: userLoading } = useUser();
  const { categories, realoadCategories } = useCategories(user?.id ?? "");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryType, setCategoryType] = useState<"income" | "expense">(
    "income"
  );
  const { toast } = useToast();

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(Schema),
    defaultValues: {
      name: "",
      description: "",
      type: "income" as "income" | "expense",
    },
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      if (!user) throw new Error("No user");
      if (editingCategory) {
        await update(editingCategory.id, data);
        toast({ title: "Category updated successfully" });
      } else {
        await create({ ...data, user_id: user.id });
        toast({ title: "Category added successfully" });
      }
      realoadCategories();
      setIsDialogOpen(false);
      setEditingCategory(null);
    } catch (e) {
      toast({ title: "Error", description: String(e), variant: "destructive" });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setValue("name", category.name);
    setValue("description", category.description);
    setValue("type", category.type as "income" | "expense");
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteCategory(id);
    realoadCategories();
    toast({ title: "Category deleted successfully" });
  };

  const openAddDialog = (type: "income" | "expense") => {
    setCategoryType(type);
    setEditingCategory(null);
    setValue("type", type);
    setIsDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      reset();
    }
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
            onClick={() => onDelete(category.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (userLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        Cargando usuario...
      </div>
    );
  }
  if (!user) {
    return (
      <div className="flex justify-center items-center h-96">
        Debes iniciar sesión para ver tus categorías.
      </div>
    );
  }
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

        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input id="name" required {...register("name")} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" required {...register("description")} />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  name="type"
                  defaultValue={editingCategory?.type || categoryType}
                  value={watch("type")}
                  onValueChange={(value) =>
                    setValue("type", value as "income" | "expense")
                  }
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
              <Button
                type="submit"
                className="w-full"
                variant="finance"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "..."
                  : editingCategory
                  ? "Update Category"
                  : "Add Category"}
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
            {categories.incomes.map((category) => (
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
            {categories.expenses.map((category) => (
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
  onDelete: (id: number) => void;
};
