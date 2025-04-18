
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
import { AlertCircle, RefreshCw, Info, ArrowDownToLine } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export const AnafSearch = () => {
  const [cui, setCui] = useState('');
  const { searchCompany, loading: loadingCompany, error: errorCompany, data: companyData, isLovableEnvironment } = useAnafApi();
  const { getBalanceData, loading: loadingBalance, error: errorBalance, data: balanceData } = useAnafBilant();
  const [multiYearData, setMultiYearData] = useState<Record<string, CompanyBalanceType | null>>({});
  const [activeTab, setActiveTab] = useState('overview');
  const [searchAttempted, setSearchAttempted] = useState(false);

  // Calculăm anii pentru care putem solicita bilanțuri (ultimii 3 ani, excluzând anul curent)
  const currentYear = new Date().getFullYear();
  const availableYears = [
    currentYear - 1,
    currentYear - 2,
    currentYear - 3
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validare CUI
    const cleanCui = cui.trim();
    if (!cleanCui) {
      toast.error("Introduceți un CUI valid.");
      return;
    }
    
    // Resetăm datele anterioare și setăm flag-ul de încercare
    setMultiYearData({});
    setSearchAttempted(true);
    
    if (!isLovableEnvironment) {
      toast.info("Se trimit date către API-ul ANAF...");
    }
    
    try {
      const companyResult = await searchCompany(cleanCui);
      
      if (!companyResult) {
        if (!isLovableEnvironment) {
          toast.error("Nu s-au putut obține date despre companie.");
        }
        return;
      }
      
      // Dacă am găsit compania, încercăm să obținem și datele bilanțurilor
      if (companyResult.found && companyResult.found.length > 0) {
        // Fetch data for the available years
        for (const year of availableYears) {
          if (!isLovableEnvironment) {
            toast.info(`Se solicită bilanțul pentru anul ${year}...`);
          }
          
          try {
            const balanceData = await getBalanceData(cleanCui, year);
            
            if (balanceData) {
              setMultiYearData(prev => ({
                ...prev,
                [year.toString()]: balanceData
              }));
            }
          } catch (error) {
            console.error(`Eroare la obținerea bilanțului pentru anul ${year}:`, error);
            // Continuăm cu următorul an chiar dacă acest an a eșuat
          }
        }
        
        // Switch to the financial tab after fetching data
        if (Object.values(multiYearData).some(data => data !== null)) {
          setActiveTab('financial');
        }
      } else if (!isLovableEnvironment) {
        toast.warning("Nu s-au găsit informații pentru acest CUI.");
      }
    } catch (error) {
      console.error("Eroare în timpul procesului de căutare:", error);
      if (!isLovableEnvironment) {
        toast.error("A apărut o eroare în timpul procesului de căutare. Încercați din nou.");
      }
    }
  };

  const hasMultiYearData = Object.values(multiYearData).some(data => data !== null && data.i && data.i.length > 0);
  const isLoading = loadingCompany || loadingBalance;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      {isLovableEnvironment && (
        <Card className="bg-amber-50 dark:bg-amber-950 border-amber-300 dark:border-amber-800 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              Mediu Lovable detectat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">
              API-ul ANAF nu poate fi accesat direct din mediul Lovable din cauza restricțiilor CORS și limitărilor de securitate.
            </p>
            <p className="font-medium">
              Pentru a testa complet această aplicație:
            </p>
            <ol className="list-decimal pl-6 mt-2 space-y-2">
              <li>Clonați codul pe calculatorul dumneavoastră</li>
              <li>Instalați dependențele: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">npm install</code> sau <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">yarn</code></li>
              <li>Rulați aplicația local: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">npm run dev</code> sau <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">yarn dev</code></li>
            </ol>
          </CardContent>
          <CardFooter className="flex flex-col items-start text-sm text-muted-foreground">
            <p className="flex items-center gap-1">
              <ArrowDownToLine className="h-4 w-4" /> 
              Local, configurația proxy din vite.config.ts va funcționa corect.
            </p>
          </CardFooter>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={cui}
          onChange={(e) => setCui(e.target.value)}
          placeholder="Introduceți CUI-ul companiei"
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !cui.trim()}>
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Se caută...
            </>
          ) : (
            'Caută'
          )}
        </Button>
      </form>

      {(errorCompany || errorBalance) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              {errorCompany && <p>{errorCompany}</p>}
              {errorBalance && <p>{errorBalance}</p>}
              {!isLovableEnvironment && (
                <p className="text-sm mt-2 font-medium">
                  Asigurați-vă că sunteți conectat la internet și încercați din nou. 
                  Dacă problema persistă, API-ul ANAF poate fi indisponibil temporar.
                </p>
              )}
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
                <div className="py-8 text-center">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-4" />
                  Se încarcă datele financiare...
                </div>
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
      
      {!companyData && searchAttempted && !isLoading && !errorCompany && !isLovableEnvironment && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Nu s-au primit date de la API-ul ANAF. Vă rugăm să încercați din nou mai târziu.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
