import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: number | string; // Allow string for formatted values like currency
  trend?: number | null; // Percentage change
  description?: string;
  formatAsCurrency?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  trend,
  description,
  formatAsCurrency = false,
}) => {
  const formattedValue = formatAsCurrency 
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value)) 
    : value;

  const trendIcon = trend === null || trend === undefined ? null : trend >= 0 ? <ArrowUp className="size-4 text-green-500" /> : <ArrowDown className="size-4 text-red-500" />;
  const trendText = trend === null || trend === undefined ? null : `${trend >= 0 ? '+' : ''}${trend}%`;
  const trendColor = trend === null || trend === undefined ? 'text-muted-foreground' : trend >= 0 ? 'text-green-500' : 'text-red-500';

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        {trend !== null && trend !== undefined && (
           <p className={cn("text-xs flex items-center gap-1", trendColor)}>
             {trendIcon}
             {trendText} 
             {description && <span className="text-muted-foreground ml-1">{description}</span>}
           </p>
        )}
         {(trend === null || trend === undefined) && description && (
             <p className="text-xs text-muted-foreground mt-1">{description}</p>
         )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard; 