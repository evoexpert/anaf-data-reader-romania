
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAnafApi } from '@/hooks/useAnafApi';
import { toast } from '@/components/ui/sonner';
import { CompanyFullData } from '@/types/anaf';
import { CompanyDetails } from './CompanyDetails';

export const AnafSearch = () => {
  const [cui, setCui] = useState('');
  const { searchCompany, loading, error, data } = useAnafApi();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cui.trim()) {
      toast.info("Se trimit date către API-ul ANAF...");
      searchCompany(cui.trim());
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
        <Button type="submit" disabled={loading || !cui.trim()}>
          {loading ? 'Se caută...' : 'Caută'}
        </Button>
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            <div className="space-y-2">
              <p>{error}</p>
              {error.includes("conexiune") && (
                <>
                  <p className="font-semibold">Problema de conexiune la serverul ANAF</p>
                  <p>Soluții posibile:</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Verificați că serverul de dezvoltare Vite rulează</li>
                    <li>Verificați configurația proxy în vite.config.ts</li>
                    <li>Asigurați-vă că API-ul ANAF este disponibil</li>
                  </ol>
                </>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {data && data.found && data.found.length > 0 && (
        data.found.map((company: CompanyFullData) => (
          <CompanyDetails key={company.date_generale.cui} company={company} />
        ))
      )}

      {data && data.notFound && data.notFound.length > 0 && (
        <Alert>
          <AlertDescription>Nu s-au găsit informații pentru CUI-ul introdus.</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
