
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Motorcycle } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Edit, Loader2 } from 'lucide-react';
import EditMotorcycleForm from './EditMotorcycleForm';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : motorcycles.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No motorcycles found. Import some from Excel first.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Frame Number</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Factory</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {motorcycles.map((motorcycle) => (
                <TableRow key={motorcycle.id}>
                  <TableCell>{motorcycle.id}</TableCell>
                  <TableCell>{motorcycle.framenumber}</TableCell>
                  <TableCell>{motorcycle.color}</TableCell>
                  <TableCell>{motorcycle.nfacture}</TableCell>
                  <TableCell>{motorcycle.modele}</TableCell>
                  <TableCell>{motorcycle.marque}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => handleEditClick(motorcycle)}
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
