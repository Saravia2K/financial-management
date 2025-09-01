import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const mockData = {
  totalBalance: 15420.50,
  monthlyIncome: 4200.00,
  monthlyExpenses: 2850.75,
  previousMonthExpenses: 3100.25,
  previousMonthIncome: 4000.00,
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const calculatePercentageChange = (current: number, previous: number) => {
  return ((current - previous) / previous) * 100;
};

export function DashboardStats() {
  const savingsRate = ((mockData.monthlyIncome - mockData.monthlyExpenses) / mockData.monthlyIncome) * 100;
  const expenseChange = calculatePercentageChange(mockData.monthlyExpenses, mockData.previousMonthExpenses);
  const incomeChange = calculatePercentageChange(mockData.monthlyIncome, mockData.previousMonthIncome);
  const netIncome = mockData.monthlyIncome - mockData.monthlyExpenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Total Balance */}
      <Card className="bg-gradient-to-br from-finance-primary via-finance-primary/90 to-finance-accent text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-finance-primary-foreground/80">
            Total Balance
          </CardTitle>
          <Wallet className="h-4 w-4 text-finance-primary-foreground/80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-finance-primary-foreground">
            {formatCurrency(mockData.totalBalance)}
          </div>
          <p className="text-xs text-finance-primary-foreground/70 mt-1">
            Available funds
          </p>
        </CardContent>
      </Card>

      {/* Monthly Income */}
      <Card className="border-finance-success/20 bg-gradient-to-br from-background to-finance-success/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Monthly Income
          </CardTitle>
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-4 w-4 text-finance-success" />
            <span className="text-xs text-finance-success font-medium">
              +{incomeChange.toFixed(1)}%
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-finance-success">
            {formatCurrency(mockData.monthlyIncome)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            vs {formatCurrency(mockData.previousMonthIncome)} last month
          </p>
        </CardContent>
      </Card>

      {/* Monthly Expenses */}
      <Card className="border-finance-warning/20 bg-gradient-to-br from-background to-finance-warning/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Monthly Expenses
          </CardTitle>
          <div className="flex items-center space-x-1">
            <TrendingDown className="h-4 w-4 text-finance-success" />
            <span className="text-xs text-finance-success font-medium">
              {expenseChange.toFixed(1)}%
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-finance-warning">
            {formatCurrency(mockData.monthlyExpenses)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            vs {formatCurrency(mockData.previousMonthExpenses)} last month
          </p>
        </CardContent>
      </Card>

    </div>
  );
}