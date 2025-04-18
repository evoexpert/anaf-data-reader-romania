
export interface CompanyGeneralData {
  cui: number;
  data: string;
  denumire: string;
  adresa: string;
  nrRegCom: string;
  telefon: string;
  fax: string;
  codPostal: string;
  act: string;
  stare_inregistrare: string;
  data_inregistrare: string;
  cod_CAEN: string;
  iban: string;
  statusRO_e_Factura: boolean;
  data_inreg_Reg_RO_e_Factura: string;
  organFiscalCompetent: string;
  forma_de_proprietate: string;
  forma_organizare: string;
  forma_juridica: string;
}

export interface CompanyTvaRegistration {
  scpTVA: boolean;
  perioade_TVA: Array<{
    data_inceput_ScpTVA: string;
    data_sfarsit_ScpTVA: string;
    data_anul_imp_ScpTVA: string;
    mesaj_ScpTVA: string;
  }>;
}

export interface CompanyTvaInc {
  dataInceputTvaInc: string;
  dataSfarsitTvaInc: string;
  dataActualizareTvaInc: string;
  dataPublicareTvaInc: string;
  tipActTvaInc: string;
  statusTvaIncasare: boolean;
}

export interface CompanyInactiveState {
  dataInactivare: string;
  dataReactivare: string;
  dataPublicare: string;
  dataRadiere: string;
  statusInactivi: boolean;
}

export interface CompanySplitTva {
  dataInceputSplitTVA: string;
  dataAnulareSplitTVA: string;
  statusSplitTVA: boolean;
}

export interface CompanyAddress {
  sdenumire_Strada: string;
  snumar_Strada: string;
  sdenumire_Localitate: string;
  scod_Localitate: string;
  sdenumire_Judet: string;
  scod_Judet: string;
  scod_JudetAuto: string;
  stara: string;
  sdetalii_Adresa: string;
  scod_Postal: string;
}

export interface CompanyFullData {
  date_generale: CompanyGeneralData;
  inregistrare_scop_Tva: CompanyTvaRegistration;
  inregistrare_RTVAI: CompanyTvaInc;
  stare_inactiv: CompanyInactiveState;
  inregistrare_SplitTVA: CompanySplitTVA;
  adresa_sediu_social: CompanyAddress;
  adresa_domiciliu_fiscal: CompanyAddress;
}

export interface AnafApiResponse {
  cod: number;
  message: string;
  found: CompanyFullData[];
  notFound: string[];
}

// For backward compatibility with older code
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
