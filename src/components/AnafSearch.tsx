
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAnafApi } from '@/hooks/useAnafApi';
import { toast } from '@/components/ui/sonner';
import { CompanyFullData } from '@/types/anaf';

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
    <div className="max-w-2xl mx-auto p-4 space-y-4">
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
        data.found.map((company: CompanyFullData, index: number) => (
          <div key={company.date_generale.cui} className="border rounded-lg p-4 space-y-2">
            <h2 className="text-lg font-semibold">{company.date_generale.denumire}</h2>
            <div className="grid gap-2 text-sm">
              <p><strong>CUI:</strong> {company.date_generale.cui}</p>
              <p><strong>Nr. Reg. Com.:</strong> {company.date_generale.nrRegCom}</p>
              <p><strong>Adresa:</strong> {company.date_generale.adresa}</p>
              <p><strong>Telefon:</strong> {company.date_generale.telefon || 'Nedisponibil'}</p>
              <p><strong>Stare:</strong> {company.date_generale.stare_inregistrare}</p>
              <p><strong>TVA:</strong> {company.inregistrare_scop_Tva.scpTVA ? 'DA' : 'NU'}</p>
              {company.inregistrare_RTVAI.statusTvaIncasare && (
                <p><strong>TVA la încasare:</strong> DA</p>
              )}
              {company.stare_inactiv.statusInactivi && (
                <p className="text-red-500"><strong>Inactiv</strong></p>
              )}
              {company.date_generale.statusRO_e_Factura && (
                <p><strong>e-Factura:</strong> DA (din {company.date_generale.data_inreg_Reg_RO_e_Factura})</p>
              )}
              <p><strong>CAEN:</strong> {company.date_generale.cod_CAEN}</p>
              <p><strong>Forma juridică:</strong> {company.date_generale.forma_juridica}</p>
            </div>
          </div>
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
