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

  // Search/filter state
  const [filter, setFilter] = useState('');

  const fetchMotorcycles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/immatric');
      
      if (!response.ok) {
        throw new Error('Failed to fetch motorcycles');
      }
      
      const data = await response.json();
      setMotorcycles(data);
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

  // Format date function
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  // Filter motorcycles by FrameNumber or client (case-insensitive, partial match)
  const filteredMotorcycles = motorcycles.filter((m) => {
    const search = filter.trim().toLowerCase();
    if (!search) return true;
    const frame = (m.FrameNumber || '').toLowerCase();
    const client = (m.client || '').toLowerCase();
    return frame.includes(search) || client.includes(search);
  });

  return (
    <div className="space-y-6">
      {/* Filtering zone */}
      <div className="flex justify-end mb-2">
        <input
          type="text"
          placeholder="Filter by Frame Number or Client"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2 w-full max-w-xs"
        />
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredMotorcycles.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No motorcycles found. Import some from Excel first.</p>
        </div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Frame Number</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Factory</TableHead>
                <TableHead>Dealer</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Arrival Date</TableHead>
                <TableHead>Dealer Sale Date</TableHead>
                <TableHead>Client Sale Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMotorcycles.map((motorcycle) => (
                <TableRow key={motorcycle.FrameNumber}>
                  <TableCell>{motorcycle.FrameNumber}</TableCell>
                  <TableCell>{motorcycle.Marque}</TableCell>
                  <TableCell>{motorcycle.MODELE}</TableCell>
                  <TableCell>{motorcycle.Color}</TableCell>
                  <TableCell>{motorcycle.NFacture}</TableCell>
                  <TableCell>{motorcycle.revendeur}</TableCell>
                  <TableCell>{motorcycle.client}</TableCell>
                  <TableCell>{formatDate(motorcycle.DateArrivage)}</TableCell>
                  <TableCell>{formatDate(motorcycle.DateVenteRevendeur)}</TableCell>
                  <TableCell>{formatDate(motorcycle.DateVenteClient)}</TableCell>
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
