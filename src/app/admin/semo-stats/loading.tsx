import { Card, CardContent, CardHeader } from "@/components/atoms/Card";

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-24 bg-muted animate-pulse rounded mb-2" />
        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
      </CardContent>
    </Card>
  );
}

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-5 w-40 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] bg-muted animate-pulse rounded" />
      </CardContent>
    </Card>
  );
}

function TableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-5 w-40 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function SemoStatsLoading() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-16 bg-muted animate-pulse rounded" />
          <div className="h-9 w-16 bg-muted animate-pulse rounded" />
          <div className="h-9 w-16 bg-muted animate-pulse rounded" />
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      {/* Table */}
      <TableSkeleton />
    </div>
  );
}
