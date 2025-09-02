import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function IncomeTableSkeleton() {
  return (
    <div className="container mx-auto p-6">
      {/* Summary Card Skeleton */}
      <Card className="mb-6 bg-gradient-to-br from-finance-success/10 to-finance-accent/10 border-finance-success/20">
        <CardHeader>
          <CardTitle className="flex items-center text-finance-success">
            <Skeleton className="h-5 w-32 mr-2" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-48 rounded" />
        </CardContent>
      </Card>
      {/* Table/List Skeleton */}
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex-1">
                <Skeleton className="h-5 w-40 mb-2" />
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-6 w-20" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
