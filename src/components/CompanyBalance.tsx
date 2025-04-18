
import { CompanyBalance as CompanyBalanceType } from '@/types/anafBilant';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Receipt } from "lucide-react";

interface CompanyBalanceProps {
  balance: CompanyBalanceType;
}

export const CompanyBalance = ({ balance }: CompanyBalanceProps) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ro-RO').format(num);
  };

  const keyIndicators = [
    'I27', // Venituri totale
    'I28', // Cheltuieli totale
    'I29', // Profit brut
    'I31', // Profit net
    'I33', // Număr mediu de salariați
  ];

  const getIndicatorValue = (code: string) => {
    return balance.i.find(indicator => indicator.indicator === code);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Bilanț Financiar {balance.an}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {keyIndicators.map(code => {
                const indicator = getIndicatorValue(code);
                if (!indicator) return null;
                return (
                  <Card key={code}>
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground">
                        {indicator.val_den_indicator}
                      </div>
                      <div className="text-2xl font-bold">
                        {formatNumber(indicator.val_indicator)} RON
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Indicator</TableHead>
                  <TableHead className="text-right">Valoare (RON)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {balance.i.map((indicator) => (
                  <TableRow key={indicator.indicator}>
                    <TableCell>{indicator.val_den_indicator}</TableCell>
                    <TableCell className="text-right">{formatNumber(indicator.val_indicator)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
