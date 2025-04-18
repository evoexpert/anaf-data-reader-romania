
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

  const currentYear = new Date().getFullYear();
  const lastThreeYears = [
    currentYear - 2,
    currentYear - 1,
    currentYear
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cui.trim()) {
      setMultiYearData({});
      toast.info("Se trimit date către API-ul ANAF...");
      await searchCompany(cui.trim());
      
      // Fetch data for the last three years
      for (const year of lastThreeYears) {
        if (year > 2019) {
          toast.warning(`Este posibil ca datele să nu fie disponibile pentru anul ${year}. ANAF oferă date istoric până în 2019.`);
        }
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
      if (Object.keys(multiYearData).length > 0) {
        setActiveTab('financial');
      }
    }
  };

  const hasMultiYearData = Object.values(multiYearData).some(data => data !== null);

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
                  .filter(([_, data]) => data !== null)
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
                  Nu există date financiare disponibile pentru anii selectați.
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
