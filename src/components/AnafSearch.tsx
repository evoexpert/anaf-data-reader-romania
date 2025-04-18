
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
import { FinancialCharts } from './FinancialCharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompanyBalance as CompanyBalanceType } from '@/types/anafBilant';

export const AnafSearch = () => {
  const [cui, setCui] = useState('');
  const { searchCompany, loading: loadingCompany, error: errorCompany, data: companyData } = useAnafApi();
  const { getBalanceData, loading: loadingBalance, error: errorBalance, data: balanceData } = useAnafBilant();
  const [multiYearData, setMultiYearData] = useState<Record<string, CompanyBalanceType | null>>({});
  const [activeTab, setActiveTab] = useState('overview');

  // Calculăm anii pentru care putem solicita bilanțuri (ultimii 3 ani, excluzând anul curent)
  const currentYear = new Date().getFullYear();
  const availableYears = [
    currentYear - 1,
    currentYear - 2,
    currentYear - 3
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cui.trim()) {
      setMultiYearData({});
      toast.info("Se trimit date către API-ul ANAF...");
      await searchCompany(cui.trim());
      
      // Fetch data for the available years
      for (const year of availableYears) {
        toast.info(`Se solicită bilanțul pentru anul ${year}...`);
        const balanceData = await getBalanceData(cui.trim(), year);
        
        if (balanceData) {
          setMultiYearData(prev => ({
            ...prev,
            [year.toString()]: balanceData
          }));
        }
      }
      
      // Switch to the financial tab after fetching data
      if (Object.values(multiYearData).some(data => data !== null)) {
        setActiveTab('financial');
      }
    }
  };

  const hasMultiYearData = Object.values(multiYearData).some(data => data !== null && data.i && data.i.length > 0);

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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Detalii companie</TabsTrigger>
            <TabsTrigger value="financial">Date financiare</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            {companyData.found.map((company: CompanyFullData) => (
              <CompanyDetails key={company.date_generale.cui} company={company} />
            ))}
          </TabsContent>
          <TabsContent value="financial">
            {hasMultiYearData ? (
              <div className="space-y-6">
                <FinancialCharts data={multiYearData} />
                {Object.entries(multiYearData)
                  .filter(([_, data]) => data !== null && data.i && data.i.length > 0)
                  .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA))
                  .map(([year, data]) => (
                    data && <CompanyBalance key={year} balance={data} />
                  ))
                }
              </div>
            ) : (
              loadingBalance ? (
                <div className="py-8 text-center">Se încarcă datele financiare...</div>
              ) : (
                <div className="py-8 text-center">
                  Nu există date financiare disponibile pentru anii {availableYears.join(', ')}.
                </div>
              )
            )}
          </TabsContent>
        </Tabs>
      )}

      {companyData && companyData.notFound && companyData.notFound.length > 0 && (
        <Alert>
          <AlertDescription>Nu s-au găsit informații pentru CUI-ul introdus.</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
