
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
        
        // Extract motorcycle data (starting from row 7)
        const motorcycles: { framenumber: string; color: string }[] = [];
        let rowIndex = 7;
        
        while (true) {
          const framenumberCell = worksheet[`D${rowIndex}`];
          const colorCell = worksheet[`E${rowIndex}`];
          
          if (!framenumberCell || !colorCell) {
            break;
          }
          
          motorcycles.push({
            framenumber: framenumberCell.v?.toString() || '',
            color: colorCell.v?.toString() || '',
          });
          
          rowIndex++;
        }
        
        setExcelData({
          vfacture,
          vmodele,
          vmarque,
          motorcycles,
        });
        
        toast({
          title: 'Excel file processed',
          description: `Found ${motorcycles.length} motorcycles in the file.`,
        });
      } catch (error) {
        console.error('Error processing Excel file:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to process Excel file. Please ensure it has the correct format.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
      setIsLoading(false);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to read Excel file.',
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
        framenumber: m.framenumber,
        color: m.color,
        nfacture: excelData.vfacture,
        modele: excelData.vmodele,
        marque: excelData.vmarque,
      }));
      
      // Save to database
      const response = await fetch('/api/motorcycles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(motorcycleData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save motorcycles to database');
      }
      
      const result = await response.json();
      
      toast({
        title: 'Success',
        description: `Successfully imported ${motorcycleData.length} motorcycles into the database.`,
      });
    } catch (error) {
      console.error('Error saving to database:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save motorcycles to database.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const downloadSampleExcel = () => {
    // Create a sample Excel file
    const workbook = XLSX.utils.book_new();
    const data = [
      ['', '', '', '', '', ''],
      ['', '', '', '', '', ''],
      ['', '', '', '', '', ''],
      ['', 'Factory Number', '', '', 'Model', 'Brand'],
      ['', 'FACT123', '', '', 'SPORT', 'HONDA'],
      ['', '', '', '', '', ''],
      ['', '', '', 'Frame Number', 'Color', ''],
      ['', '', '', 'FR001', 'Red', ''],
      ['', '', '', 'FR002', 'Blue', ''],
    ];
    
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sample');
    
    // Convert to blob and trigger download
    XLSX.writeFile(workbook, 'sample_import.xlsx');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Import Excel File</h2>
        <Button onClick={downloadSampleExcel} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Sample Excel
        </Button>
      </div>
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer ${isDragActive ? 'border-primary bg-gray-50' : 'border-gray-300'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-3">
          <Upload className="h-10 w-10 text-gray-400" />
          {isDragActive ? (
            <p>Drop the Excel file here...</p>
          ) : (
            <p>Drag and drop an Excel file here, or click to select a file</p>
          )}
          <p className="text-sm text-muted-foreground">
            Supported formats: .xlsx, .xls
          </p>
        </div>
      </div>
      
      {excelData && (
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Extracted Data</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Factory</p>
                <p>{excelData.vfacture}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Model</p>
                <p>{excelData.vmodele}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Brand</p>
                <p>{excelData.vmarque}</p>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Motorcycles ({excelData.motorcycles.length})</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frame Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {excelData.motorcycles.map((moto, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{moto.framenumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{moto.color}</td>
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
              {isLoading ? 'Importing...' : 'Import to Database'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelImporter;
