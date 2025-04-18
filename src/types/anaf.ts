
export interface CompanyResponse {
  cui: string;
  data: string;
  denumire: string;
  adresa: string;
  nrRegCom: string;
  telefon: string;
  codPostal: string;
  stare_inregistrare: string;
  scpTVA: boolean;
  data_inceput_ScpTVA: string | null;
  data_sfarsit_ScpTVA: string | null;
  data_anul_imp_ScpTVA: string | null;
  mesaj_ScpTVA: string | null;
  dataInceputTvaInc: string | null;
  dataSfarsitTvaInc: string | null;
  dataActualizareTvaInc: string | null;
  dataPublicareTvaInc: string | null;
  tipActTvaInc: string | null;
  statusTvaIncasare: boolean;
  dataInactivare: string | null;
  dataReactivare: string | null;
  dataPublicare: string | null;
  dataRadiere: string | null;
  statusInactivi: boolean;
  dataInceputSplitTVA: string | null;
  dataAnulareSplitTVA: string | null;
  statusSplitTVA: boolean;
}

export interface AnafApiResponse {
  cod: number;
  message: string;
  found: boolean;
  date: CompanyResponse[];
}
