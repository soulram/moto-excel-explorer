import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { ExcelData, Motorcycle } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';

const ExcelImporter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [excelData, setExcelData] = useState<ExcelData | null>(null);
  const { toast } = useToast();
  const formatDateForInput = (dateStr: string | null): string => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '';
      // Add one day (in milliseconds)
      date.setDate(date.getDate() + 1);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };
  function excelSerialDateToDDMMYYYY(serial) {
    if (!serial) return '';
    const serialNum = Number(serial);
    if (isNaN(serialNum)) return '';
  
    // Excel's day 1 is 1899-12-31, but we use 1899-12-30 as base to correct for Excel leap year bug
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const millisPerDay = 24 * 60 * 60 * 1000;
  
    const date = new Date(excelEpoch.getTime() + serialNum * millisPerDay);
  
    // Format date as DD/MM/YYYY
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getUTCFullYear();
  
    return `${day}/${month}/${year}`;
  }
  const processExcelFile = (file: File) => {
    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Extract header data
        const vfacture = worksheet['B4']?.v?.toString() || '';
        const vmodele = worksheet['E4']?.v?.toString() || '';
        const vmarque = worksheet['F4']?.v?.toString() || '';
        
        const xvdatearrivage = worksheet['E3']?.v?.toString() || '';
        const formattedDate = excelSerialDateToDDMMYYYY(xvdatearrivage);
        const vdatearrivage = formattedDate;
        // Extract motorcycle data (starting from row 7)
        const motorcycles: { FrameNumber: string; Color: string }[] = [];
        let rowIndex = 7;
        
        while (true) {
          const framenumberCell = worksheet[`D${rowIndex}`];
          const colorCell = worksheet[`E${rowIndex}`];
          
          if (!framenumberCell || !colorCell) {
            break;
          }
          
          motorcycles.push({
            FrameNumber: framenumberCell.v?.toString() || '',
            Color: colorCell.v?.toString() || ''
          });
          
          rowIndex++;
        }
        
        setExcelData({
          vfacture,
          vmodele,
          vmarque,
          motorcycles,
          vdatearrivage,
        });
        
        toast({
          title: 'Fichier Excel traité',
          description: `Trouvé ${motorcycles.length} motos dans le fichier.`,
        });
      } catch (error) {
        console.error('Erreur lors du traitement du fichier Excel :', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Échec du traitement du fichier Excel. Veuillez vérifier que le format est correct.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
      setIsLoading(false);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Échec de la lecture du fichier Excel.',
      });
    };
    
    reader.readAsBinaryString(file);
  };
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processExcelFile(acceptedFiles[0]);
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
  });
  
  const handleSaveToDatabase = async () => {
    if (!excelData) return;
    
    setIsLoading(true);
    
    try {
      // Format the data for saving to the database
      const motorcycleData: Motorcycle[] = excelData.motorcycles.map((m) => ({
        FrameNumber: m.FrameNumber,
        Color: m.Color,
        NFacture: excelData.vfacture,
        MODELE: excelData.vmodele,
        Marque: excelData.vmarque,
        DateArrivage: formatDateForInput(excelData.vdatearrivage),
        //DateArrivage: new Date().toLocaleDateString('fr-FR', {
         // day: '2-digit',
        //  month: '2-digit',
         // year: '2-digit'
        //}),
        revendeur: null,
client: null,
DateVenteRevendeur: null,
DateVenteClient: null,
cnie: null,
observation: null,
DateNaissance: null,
Sexe: null,
VilleVente: null,
ProvinceVente: null,
VilleAffectation: null,
ProvinceAffectation: null
}));

console.log('Envoi des données :', motorcycleData); // Debug log

const response = await fetch('http://localhost:5000/api/motorcycles', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(motorcycleData),
});

if (!response.ok) {
  const errorData = await response.json();
  throw new Error(errorData.error || 'Échec de l\'enregistrement des motos dans la base de données');
}

const result = await response.json();
console.log('Réponse :', result); // Debug log

toast({
  title: 'Succès',
  description: `Importation réussie de ${motorcycleData.length} motos dans la base de données.`,
});

setExcelData(null);
} catch (error) {
  console.error('Erreur lors de l\'enregistrement dans la base de données :', error);
  toast({
    variant: 'destructive',
    title: 'Erreur',
    description: error instanceof Error ? error.message : 'Échec de l\'enregistrement des motos dans la base de données.',
  });
} finally {
  setIsLoading(false);
}
};

const downloadSampleExcel = () => {
  const workbook = XLSX.utils.book_new();
  const data = [
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', 'Numéro d\'usine', '', '', 'Modèle', 'Marque'],
    ['', 'FACT123', '', '', 'SPORT', 'HONDA'],
    ['', '', '', '', '', ''],
    ['', '', '', 'Numéro de cadre', 'Couleur', ''],
    ['', '', '', 'FR001', 'Rouge', ''],
    ['', '', '', 'FR002', 'Bleu', ''],
  ];
  
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Exemple');
  XLSX.writeFile(workbook, 'exemple_import.xlsx');
};

return (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">Importer un fichier Excel</h2>
     
    </div>
    
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer ${isDragActive ? 'border-primary bg-gray-50' : 'border-gray-300'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-3">
        <Upload className="h-10 w-10 text-gray-400" />
        {isDragActive ? (
          <p>Déposez le fichier Excel ici...</p>
        ) : (
          <p>Glissez-déposez un fichier Excel ici, ou cliquez pour sélectionner un fichier</p>
        )}
        <p className="text-sm text-muted-foreground">
          Formats pris en charge : .xlsx, .xls
        </p>
      </div>
    </div>
    
    {excelData && (
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Données extraites</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Usine</p>
              <p>{excelData.vfacture}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Modèle</p>
              <p>{excelData.vmodele}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Marque</p>
              <p>{excelData.vmarque}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date d'arrivée</p>
              <p>{excelData.vdatearrivage}</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Motos ({excelData.motorcycles.length})</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro de cadre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Couleur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {excelData.motorcycles.map((moto, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{moto.FrameNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{moto.Color}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button
            onClick={handleSaveToDatabase}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? 'Importation en cours...' : 'Importer dans la base de données'}
          </Button>
        </div>
      </div>
    )}
  </div>
);
};

export default ExcelImporter;
