
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Motorcycle } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Edit, Loader2 } from 'lucide-react';
import EditMotorcycleForm from './EditMotorcycleForm';

const MotorcycleList = () => {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<Motorcycle | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  
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
  
  useEffect(() => {
    fetchMotorcycles();
  }, []);
  
  const handleEditClick = (motorcycle: Motorcycle) => {
    setSelectedMotorcycle(motorcycle);
    setIsEditing(true);
  };
  
  const handleEditComplete = () => {
    setIsEditing(false);
    setSelectedMotorcycle(null);
    fetchMotorcycles();
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">List of Motorcycles</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : motorcycles.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No motorcycles found. Import some from Excel first.</p>
        </div>
      ) : (
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => handleEditClick(motorcycle)}
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {isEditing && selectedMotorcycle && (
        <EditMotorcycleForm 
          motorcycle={selectedMotorcycle} 
          onCancel={() => setIsEditing(false)}
          onSave={handleEditComplete}
        />
      )}
    </div>
  );
};

export default MotorcycleList;
