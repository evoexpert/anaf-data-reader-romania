
import { AnafSearch } from "@/components/AnafSearch";
import { ArrowDownToLine, FileCode, Globe, Server } from "lucide-react";

export default function Index() {
  const isLovableEnvironment = window.location.hostname.includes('lovableproject.com') || 
                              window.location.hostname.includes('lovable.app');

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Verificare date ANAF</h1>
      
      <div className="max-w-2xl mx-auto mb-8 p-6 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Despre această aplicație</h2>
        <p className="mb-3">Această aplicație permite verificarea datelor fiscale pentru companii din România utilizând API-ul oficial ANAF.</p>
        
        {isLovableEnvironment ? (
          <>
            <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-md border-l-4 border-amber-500 mb-4">
              <h3 className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <Server className="h-5 w-5" />
                Mediu de preview detectat
              </h3>
              <p className="mt-2 text-amber-700 dark:text-amber-300">
                În mediul de preview Lovable, API-ul ANAF nu poate fi accesat din cauza restricțiilor CORS.
              </p>
            </div>
            
            <div className="space-y-3 mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                Instrucțiuni pentru testare locală:
              </h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Clonați codul pe calculatorul dumneavoastră</li>
                <li>Instalați dependențele: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">npm install</code> sau <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">yarn</code></li>
                <li>Rulați aplicația local: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">npm run dev</code> sau <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">yarn dev</code></li>
                <li>Accesați aplicația în browser la adresa <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">http://localhost:8080</code></li>
              </ol>
            </div>
            
            <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-md mb-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Cum funcționează:
              </h3>
              <p className="mt-2 text-sm">
                Configurația din <code className="bg-slate-200 dark:bg-slate-600 px-1 py-0.5 rounded">vite.config.ts</code> conține 
                un proxy care redirecționează cererile către API-ul ANAF, ocolind restricțiile CORS. Acest proxy 
                funcționează doar când aplicația este rulată local.
              </p>
              <p className="mt-2 text-sm flex items-center gap-1">
                <ArrowDownToLine className="h-4 w-4" />
                Pentru o aplicație în producție, va fi necesar un proxy serverless sau un backend dedicat.
              </p>
            </div>
          </>
        ) : (
          <>
            <p className="mb-3">Introdu CUI-ul companiei în câmpul de mai jos pentru a verifica datele acesteia.</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Notă: Este posibil ca API-ul ANAF să fie temporar indisponibil în anumite perioade.
            </p>
          </>
        )}
      </div>
      
      <AnafSearch />
    </div>
  );
}
