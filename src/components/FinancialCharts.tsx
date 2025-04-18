
import { CompanyBalance } from '@/types/anafBilant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon } from 'lucide-react';

interface FinancialChartsProps {
  data: Record<string, CompanyBalance | null>;
}

export const FinancialCharts = ({ data }: FinancialChartsProps) => {
  // Filter out null values and sort by year
  const validYears = Object.entries(data)
    .filter(([_, balanceData]) => balanceData !== null)
    .sort(([yearA], [yearB]) => parseInt(yearA) - parseInt(yearB));

  if (validYears.length === 0) {
    return null;
  }

  // Get the data for revenue, expenses and profit
  const chartData = validYears.map(([year, balanceData]) => {
    if (!balanceData) return null;
    
    const revenues = balanceData.i.find(i => i.indicator === 'I27')?.val_indicator || 0;
    const expenses = balanceData.i.find(i => i.indicator === 'I28')?.val_indicator || 0;
    const profit = balanceData.i.find(i => i.indicator === 'I31')?.val_indicator || 0;
    const employees = balanceData.i.find(i => i.indicator === 'I33')?.val_indicator || 0;
    
    return {
      year,
      revenues,
      expenses,
      profit,
      employees,
      companyName: balanceData.deni
    };
  }).filter(Boolean);

  // For the latest year's data
  const latestYearData = chartData[chartData.length - 1];
  
  if (!latestYearData) {
    return null;
  }

  // Data for the pie chart
  const pieData = [
    { name: 'Venituri', value: latestYearData.revenues },
    { name: 'Cheltuieli', value: latestYearData.expenses },
  ];

  const COLORS = ['#0088FE', '#FF8042'];

  // Format large numbers for better display
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Situație financiară comparativă
          </CardTitle>
          <CardDescription>
            Analiza veniturilor, cheltuielilor și profitului pentru ultimii ani
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={formatNumber} />
                <Tooltip formatter={(value: number) => new Intl.NumberFormat('ro-RO').format(value)} />
                <Legend />
                <Bar dataKey="revenues" name="Venituri" fill="#4F46E5" />
                <Bar dataKey="expenses" name="Cheltuieli" fill="#EF4444" />
                <Bar dataKey="profit" name="Profit" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChartIcon className="h-5 w-5" />
              Evoluție profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={formatNumber} />
                  <Tooltip formatter={(value: number) => new Intl.NumberFormat('ro-RO').format(value)} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    name="Profit" 
                    stroke="#10B981" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Distribuție venituri/cheltuieli ({latestYearData.year})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => new Intl.NumberFormat('ro-RO').format(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
