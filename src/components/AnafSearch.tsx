
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAnafApi } from '@/hooks/useAnafApi';
import { useAnafBilant } from '@/hooks/useAnafBilant';
import { toast } from '@/components/ui/sonner';
import { CompanyFullData } from '@/types/anaf';
import { CompanyDetails } from './CompanyDetails';
import { CompanyBalance } from './CompanyBalance';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const AnafSearch = () => {
  const [cui, setCui] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const { searchCompany, loading: loadingCompany, error: errorCompany, data: companyData } = useAnafApi();
  const { getBalanceData, loading: loadingBalance, error: errorBalance, data: balanceData } = useAnafBilant();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2013 }, (_, i) => (currentYear - i).toString());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cui.trim()) {
      toast.info("Se trimit date către API-ul ANAF...");
      await searchCompany(cui.trim());
      if (selectedYear) {
        if (parseInt(selectedYear) > 2019) {
          toast.warning("Este posibil ca datele să nu fie disponibile pentru anul selectat. ANAF oferă date istoric până în 2019.");
        }
        toast.info(`Se solicită bilanțul pentru anul ${selectedYear}...`);
        await getBalanceData(cui.trim(), parseInt(selectedYear));
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={cui}
          onChange={(e) => setCui(e.target.value)}
          placeholder="Introduceți CUI-ul companiei"
          className="flex-1"
        />
        <Select
          value={selectedYear}
          onValueChange={setSelectedYear}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selectează anul" />
          </SelectTrigger>
          <SelectContent>
            {years.map(year => (
              <SelectItem key={year} value={year}>
                Bilanț {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" disabled={loadingCompany || loadingBalance || !cui.trim()}>
          {loadingCompany || loadingBalance ? 'Se caută...' : 'Caută'}
        </Button>
      </form>

      {(errorCompany || errorBalance) && (
        <Alert variant="destructive">
          <AlertDescription>
            <div className="space-y-2">
              {errorCompany && <p>{errorCompany}</p>}
              {errorBalance && <p>{errorBalance}</p>}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {companyData && companyData.found && companyData.found.length > 0 && (
        companyData.found.map((company: CompanyFullData) => (
          <CompanyDetails key={company.date_generale.cui} company={company} />
        ))
      )}

      {balanceData && (
        <CompanyBalance balance={balanceData} />
      )}

      {companyData && companyData.notFound && companyData.notFound.length > 0 && (
        <Alert>
          <AlertDescription>Nu s-au găsit informații pentru CUI-ul introdus.</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
