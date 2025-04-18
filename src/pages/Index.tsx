
import { AnafSearch } from "@/components/AnafSearch";

export default function Index() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Verificare date ANAF</h1>
      
      <div className="max-w-2xl mx-auto mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Despre această aplicație</h2>
        <p className="mb-2">Această aplicație permite verificarea datelor fiscale pentru companii din România utilizând API-ul oficial ANAF.</p>
        <p className="mb-2">Introdu CUI-ul companiei în câmpul de mai jos pentru a verifica datele acesteia.</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Notă: Din cauza restricțiilor CORS, apelurile directe către API-ul ANAF pot fi blocate de browser. 
          Pentru utilizare în producție, este recomandat să implementați un server proxy.
        </p>
      </div>
      
      <AnafSearch />
    </div>
  );
}
