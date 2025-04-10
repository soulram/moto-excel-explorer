
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Motorcycle } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as XLSX from 'xlsx';

interface EditMotorcycleFormProps {
  motorcycle: Motorcycle;
  onCancel: () => void;
  onSave: () => void;
}

const EditMotorcycleForm = ({ motorcycle, onCancel, onSave }: EditMotorcycleFormProps) => {
  const [formData, setFormData] = useState<Motorcycle>({ ...motorcycle });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/motorcycles/${motorcycle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update motorcycle');
      }
      
      toast({
        title: 'Success',
        description: 'Motorcycle updated successfully.',
      });
      
      onSave();
    } catch (error) {
      console.error('Error updating motorcycle:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update motorcycle.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const exportToExcel = () => {
    // Create a worksheet with the motorcycle data
    const worksheet = XLSX.utils.json_to_sheet([formData]);
    
    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Motorcycle');
    
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `motorcycle_${formData.framenumber}.xlsx`);
  };
  
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Motorcycle</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="framenumber">Frame Number</Label>
              <Input
                id="framenumber"
                name="framenumber"
                value={formData.framenumber}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nfacture">Factory</Label>
              <Input
                id="nfacture"
                name="nfacture"
                value={formData.nfacture}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="modele">Model</Label>
              <Input
                id="modele"
                name="modele"
                value={formData.modele}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="marque">Brand</Label>
              <Input
                id="marque"
                name="marque"
                value={formData.marque}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={exportToExcel}>
                Export to Excel
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMotorcycleForm;
