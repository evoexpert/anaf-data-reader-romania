
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAnafApi } from '@/hooks/useAnafApi';

export const AnafSearch = () => {
  const [cui, setCui] = useState('');
  const { searchCompany, loading, error, data } = useAnafApi();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cui.trim()) {
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
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {data?.found && data.date.map((company) => (
        <div key={company.cui} className="border rounded-lg p-4 space-y-2">
          <h2 className="text-lg font-semibold">{company.denumire}</h2>
          <div className="grid gap-2 text-sm">
            <p><strong>CUI:</strong> {company.cui}</p>
            <p><strong>Nr. Reg. Com.:</strong> {company.nrRegCom}</p>
            <p><strong>Adresa:</strong> {company.adresa}</p>
            <p><strong>Telefon:</strong> {company.telefon}</p>
            <p><strong>Stare:</strong> {company.stare_inregistrare}</p>
            <p><strong>TVA:</strong> {company.scpTVA ? 'DA' : 'NU'}</p>
            {company.statusTvaIncasare && (
              <p><strong>TVA la încasare:</strong> DA</p>
            )}
            {company.statusInactivi && (
              <p className="text-red-500"><strong>Inactiv</strong></p>
            )}
          </div>
        </div>
      ))}

      {data?.found === false && (
        <Alert>
          <AlertDescription>Nu s-au găsit informații pentru CUI-ul introdus.</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
