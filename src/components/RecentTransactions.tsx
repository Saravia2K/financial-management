import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Coffee, 
  ShoppingBag, 
  Car, 
  Home,
  Zap,
  Gamepad2
} from "lucide-react";

const mockTransactions = [
  {
    id: 1,
    type: 'expense',
    amount: 85.50,
    description: 'Grocery Shopping',
    category: 'Food',
    date: '2024-03-15',
    icon: ShoppingBag,
  },
  {
    id: 2,
    type: 'income',
    amount: 4200.00,
    description: 'Salary',
    category: 'Income',
    date: '2024-03-15',
    icon: ArrowUpRight,
  },
  {
    id: 3,
    type: 'expense',
    amount: 12.50,
    description: 'Coffee Shop',
    category: 'Food',
    date: '2024-03-14',
    icon: Coffee,
  },
  {
    id: 4,
    type: 'expense',
    amount: 45.00,
    description: 'Gas Station',
    category: 'Transport',
    date: '2024-03-14',
    icon: Car,
  },
  {
    id: 5,
    type: 'expense',
    amount: 1200.00,
    description: 'Rent Payment',
    category: 'Housing',
    date: '2024-03-13',
    icon: Home,
  },
  {
    id: 6,
    type: 'expense',
    amount: 89.99,
    description: 'Electric Bill',
    category: 'Utilities',
    date: '2024-03-12',
    icon: Zap,
  },
  {
    id: 7,
    type: 'expense',
    amount: 29.99,
    description: 'Gaming Subscription',
    category: 'Entertainment',
    date: '2024-03-11',
    icon: Gamepad2,
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

export function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Transactions
          <Badge variant="outline" className="text-xs">
            Last 7 days
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTransactions.map((transaction) => {
            const IconComponent = transaction.icon;
            const isIncome = transaction.type === 'income';
            
            return (
              <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    isIncome 
                      ? 'bg-finance-success/10 text-finance-success' 
                      : 'bg-finance-warning/10 text-finance-warning'
                  }`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{transaction.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium text-sm ${
                    isIncome ? 'text-finance-success' : 'text-finance-warning'
                  }`}>
                    {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}