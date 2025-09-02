import { useMemo } from "react";
import useExpenses from "@/hooks/useExpenses";
import useCategories from "@/hooks/useCategories";
import { Category } from "@/lib/types/category";

// Tipo para los datos que se mostrarán en el gráfico de categorías de gastos
export interface ExpenseCategoryChartData {
  name: string; // Nombre de la categoría
  value: number; // Suma total de gastos en esa categoría
  color: string; // Color asignado a la categoría
}

// Genera un color hexadecimal determinístico a partir de un string (nombre de la categoría)
function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, "0");
  }
  return color;
}

/**
 * Hook para obtener los datos agregados de gastos por categoría, listos para usar en un gráfico.
 * @param userId - ID del usuario autenticado
 * @returns { data, loading }
 *   - data: array de objetos con nombre, valor y color de cada categoría
 *   - loading: booleano indicando si los datos están cargando
 */
export default function useExpenseCategoryChart(userId: string) {
  // Obtener gastos del usuario
  const { expenses, expensesLoading } = useExpenses(userId);
  // Obtener todas las categorías (incluye income y expense)
  const { categories, categoriesLoading } = useCategories(userId);

  // Memoiza el cálculo para evitar recomputar si los datos no cambian
  const data: ExpenseCategoryChartData[] = useMemo(() => {
    // Si las categorías aún están cargando, retorna array vacío
    if (categoriesLoading) return [];

    // Mapeo rápido de id de categoría a objeto categoría
    const catMap: Record<number, Category> = {};
    categories.expenses.forEach((c) => (catMap[c.id] = c));

    // Sumar los montos de gastos por id de categoría
    const sums: Record<number, number> = {};
    for (const e of expenses) {
      if (!sums[e.category]) sums[e.category] = 0;
      sums[e.category] += e.amount;
    }

    // Convertir el resultado a un array de objetos para el gráfico,
    // asignando un color hexadecimal determinístico a cada categoría según su nombre
    return Object.entries(sums).map(([catId, value]) => {
      const name = catMap[+catId]?.name || "Other";
      return {
        name, // Nombre de la categoría o "Other" si no existe
        value, // Suma total de gastos en esa categoría
        color: stringToColor(name), // Color hexadecimal basado en el nombre
      };
    });
  }, [expenses, categories, categoriesLoading]);

  // Retorna los datos y el estado de carga combinado
  return { data, loading: expensesLoading || categoriesLoading };
}
