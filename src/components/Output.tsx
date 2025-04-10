
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Motorcycle } from '@/lib/types';

const Output = () => {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchMotorcycles = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/motorcycles');
        
        if (!response.ok) {
          throw new Error('Failed to fetch motorcycles');
        }
        
        const data = await response.json();
        setMotorcycles(data.motorcycles);
      } catch (error) {
        console.error('Error fetching motorcycles:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load motorcycles.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMotorcycles();
  }, []);
  
  const exportToExcel = () => {
    // Create a worksheet with the motorcycle data
    const worksheet = XLSX.utils.json_to_sheet(motorcycles);
    
    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Motorcycles');
    
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, 'motorcycles_data.xlsx');
    
    toast({
      title: 'Success',
      description: 'Exported motorcycles data to Excel.',
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Output</h2>
        <Button
          onClick={exportToExcel}
          disabled={isLoading || motorcycles.length === 0}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export All to Excel
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : motorcycles.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No motorcycles found. Import some from Excel first.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Click the button above to export all {motorcycles.length} motorcycles to an Excel file.
          </p>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frame Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factory</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {motorcycles.map((motorcycle) => (
                    <tr key={motorcycle.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{motorcycle.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{motorcycle.framenumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{motorcycle.color}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{motorcycle.nfacture}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{motorcycle.modele}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{motorcycle.marque}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Output;
