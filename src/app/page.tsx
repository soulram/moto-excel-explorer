
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FileIcon, ListIcon, DownloadIcon } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Rediriger vers la page d'importation par défaut
    router.push('/import');
  }, [router]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow">
        <h1 className="text-3xl font-bold text-center">Base de données motos</h1>
        <p className="text-center text-muted-foreground">
          Gérez votre base de données de motos avec des fonctionnalités simples d'importation et d'exportation
        </p>
        
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-start gap-2"
            onClick={() => router.push('/import')}
          >
            <FileIcon className="h-5 w-5" />
            Importer un fichier Excel
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-start gap-2"
            onClick={() => router.push('/motorcycles')}
          >
            <ListIcon className="h-5 w-5" />
            Liste des motos
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-start gap-2"
            onClick={() => router.push('/output')}
          >
            <DownloadIcon className="h-5 w-5" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}
