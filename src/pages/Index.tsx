
import { AnafSearch } from "@/components/AnafSearch";

export default function Index() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Verificare date ANAF</h1>
      
      <div className="max-w-2xl mx-auto mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Despre această aplicație</h2>
        <p className="mb-2">Această aplicație permite verificarea datelor fiscale pentru companii din România utilizând API-ul oficial ANAF.</p>
        <p className="mb-2">Introdu CUI-ul companiei în câmpul de mai jos pentru a verifica datele acesteia.</p>
        <p className="mb-2 text-amber-600 dark:text-amber-400 font-medium">
          Important: În mediul de preview Lovable, API-ul ANAF nu poate fi accesat din cauza restricțiilor CORS. 
          Pentru testare completă, rulați aplicația local.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Notă: Chiar și în mediul local, este posibil ca API-ul ANAF să fie temporar indisponibil în anumite perioade.
          În mediul de producție, este recomandat să implementați un server proxy dedicat.
        </p>
      </div>
      
      <AnafSearch />
    </div>
  );
}
