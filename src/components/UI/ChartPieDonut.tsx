"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./Card";
// If you have ChartContainer, ChartTooltip, ChartTooltipContent components, import them here
// Otherwise, use Recharts' built-in tooltip for now
import { Tooltip } from "recharts";

export interface PieChartData {
  name: string;
  value: number;
  fill?: string;
}

export interface ChartPieDonutProps {
  data: PieChartData[];
  title?: string;
  description?: string;
  footer?: React.ReactNode;
}

export function ChartPieDonut({ data, title = "Donations by Category", description = "", footer }: ChartPieDonutProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="mx-auto aspect-square max-h-[250px]">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                isAnimationActive
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {footer ? (
          footer
        ) : (
          <>
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">
              Showing total donations by category
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
} 