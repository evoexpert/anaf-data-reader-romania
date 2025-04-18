
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CompanyFullData } from "@/types/anaf";
import { 
  Building2, 
  CircleDollarSign, 
  FileText, 
  MapPin, 
  Phone, 
  Receipt 
} from "lucide-react";

interface CompanyDetailsProps {
  company: CompanyFullData;
}

export const CompanyDetails = ({ company }: CompanyDetailsProps) => {
  return (
    <div className="space-y-6">
      {/* Date Generale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informații Generale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Denumire</TableCell>
                <TableCell>{company.date_generale.denumire}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">CUI</TableCell>
                <TableCell>{company.date_generale.cui}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Nr. Reg. Com.</TableCell>
                <TableCell>{company.date_generale.nrRegCom}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Cod CAEN</TableCell>
                <TableCell>{company.date_generale.cod_CAEN}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Date Financiare */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CircleDollarSign className="h-5 w-5" />
            Informații Financiare și Fiscale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">IBAN</TableCell>
                <TableCell>{company.date_generale.iban || "Nedisponibil"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">TVA</TableCell>
                <TableCell>
                  {company.inregistrare_scop_Tva.scpTVA ? (
                    <span className="text-green-600">Înregistrat în scopuri de TVA</span>
                  ) : (
                    <span className="text-red-600">Neînregistrat în scopuri de TVA</span>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">TVA la încasare</TableCell>
                <TableCell>
                  {company.inregistrare_RTVAI.statusTvaIncasare ? (
                    <span className="text-green-600">DA</span>
                  ) : (
                    <span>NU</span>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Split TVA</TableCell>
                <TableCell>
                  {company.inregistrare_SplitTVA.statusSplitTVA ? (
                    <span className="text-green-600">DA</span>
                  ) : (
                    <span>NU</span>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">e-Factura</TableCell>
                <TableCell>
                  {company.date_generale.statusRO_e_Factura ? (
                    <span className="text-green-600">
                      DA (din {company.date_generale.data_inreg_Reg_RO_e_Factura})
                    </span>
                  ) : (
                    <span>NU</span>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Status și Stare */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Status Companie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Stare înregistrare</TableCell>
                <TableCell>{company.date_generale.stare_inregistrare}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Status Inactiv</TableCell>
                <TableCell>
                  {company.stare_inactiv.statusInactivi ? (
                    <span className="text-red-600">DA - Inactiv</span>
                  ) : (
                    <span className="text-green-600">NU - Activ</span>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Organ Fiscal</TableCell>
                <TableCell>{company.date_generale.organFiscalCompetent}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Adresă și Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Adresă și Contact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Adresă</TableCell>
                <TableCell>{company.date_generale.adresa}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Telefon</TableCell>
                <TableCell>{company.date_generale.telefon || "Nedisponibil"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Cod Poștal</TableCell>
                <TableCell>{company.date_generale.codPostal || "Nedisponibil"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Forma Juridică */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Forma Juridică
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Forma Juridică</TableCell>
                <TableCell>{company.date_generale.forma_juridica}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Forma de Proprietate</TableCell>
                <TableCell>{company.date_generale.forma_de_proprietate}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Forma de Organizare</TableCell>
                <TableCell>{company.date_generale.forma_organizare}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
