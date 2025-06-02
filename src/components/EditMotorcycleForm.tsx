import { useState, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Motorcycle } from '../lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '@/components/ui/label';
import * as XLSX from 'xlsx';
import { AuthContext } from '@/contexts/AuthContext'; // <-- Add this line

interface EditMotorcycleFormProps {
  motorcycle: Motorcycle;
  onCancel: () => void;
  onSave: () => void;
}

const EditMotorcycleForm = ({ motorcycle, onCancel, onSave }: EditMotorcycleFormProps) => {
  const [formData, setFormData] = useState<Motorcycle>({ ...motorcycle });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useContext(AuthContext); // <-- Add this line

  // ... (all your unchanged helper functions)

  const formatDateForInput = (dateStr: string | null): string => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const formatDateForDisplay = (dateStr: string | null): string => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return '';
    }
  };

  const formatDateToDDMMYYYY = (dateStr: string | null): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForDatabase = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toISOString().replace('T', ' ').split('.')[0];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (['DateArrivage', 'DateVenteRevendeur', 'DateVenteClient', 'DateNaissance'].includes(name)) {
      const formattedValue = value ? formatDateForDatabase(value) : null;
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value || null,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSend = {
        ...formData,
        DateArrivage: formatDateToDDMMYYYY(formData.DateArrivage),
        DateVenteRevendeur: formatDateToDDMMYYYY(formData.DateVenteRevendeur),
        DateVenteClient: formatDateToDDMMYYYY(formData.DateVenteClient),
        DateNaissance: formatDateToDDMMYYYY(formData.DateNaissance),
      };

      const response = await fetch(`http://localhost:5000/api/motorcycles/${motorcycle.FrameNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update motorcycle');
      }

      toast({
        title: 'Success',
        description: 'Motorcycle updated successfully.',
      });

      onSave();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update motorcycle.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportToExcel = () => {
    const exportData = {
      ...formData,
      DateArrivage: formData.DateArrivage ? formatDateForDisplay(formData.DateArrivage) : '',
      DateVenteRevendeur: formData.DateVenteRevendeur ? formatDateForDisplay(formData.DateVenteRevendeur) : '',
      DateVenteClient: formData.DateVenteClient ? formatDateForDisplay(formData.DateVenteClient) : '',
      DateNaissance: formData.DateNaissance ? formatDateForDisplay(formData.DateNaissance) : '',
    };

    const worksheet = XLSX.utils.json_to_sheet([exportData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Motorcycle');
    XLSX.writeFile(workbook, `motorcycle_${formData.FrameNumber}.xlsx`);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Edit Motorcycle</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* ... your form fields ... */}

            <div className="space-y-2">
              <Label htmlFor="DateArrivage">Arrival Date</Label>
              <Input
                id="DateArrivage"
                name="DateArrivage"
                type="date"
                value={formatDateForInput(formData.DateArrivage)}
                onChange={handleInputChange}
              />
              <div className="text-sm text-gray-500">
                {formData.DateArrivage ? formatDateForDisplay(formData.DateArrivage) : 'No date selected'}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="DateVenteRevendeur">Dealer Sale Date</Label>
              <Input
                id="DateVenteRevendeur"
                name="DateVenteRevendeur"
                type="date"
                value={formatDateForInput(formData.DateVenteRevendeur)}
                onChange={handleInputChange}
              />
              <div className="text-sm text-gray-500">
                {formData.DateVenteRevendeur ? formatDateForDisplay(formData.DateVenteRevendeur) : 'No date selected'}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="DateVenteClient">Client Sale Date</Label>
              <Input
                id="DateVenteClient"
                name="DateVenteClient"
                type="date"
                value={formatDateForInput(formData.DateVenteClient)}
                onChange={handleInputChange}
              />
              <div className="text-sm text-gray-500">
                {formData.DateVenteClient ? formatDateForDisplay(formData.DateVenteClient) : 'No date selected'}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="DateNaissance">Birth Date</Label>
              <Input
                id="DateNaissance"
                name="DateNaissance"
                type="date"
                value={formatDateForInput(formData.DateNaissance)}
                onChange={handleInputChange}
              />
              <div className="text-sm text-gray-500">
                {formData.DateNaissance ? formatDateForDisplay(formData.DateNaissance) : 'No date selected'}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="Sexe">Gender</Label>
              <Input
                id="Sexe"
                name="Sexe"
                value={formData.Sexe || ''}
                onChange={handleInputChange}
                placeholder="Enter gender"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="VilleVente">Sale City</Label>
              <Input
                id="VilleVente"
                name="VilleVente"
                value={formData.VilleVente || ''}
                onChange={handleInputChange}
                placeholder="Enter sale city"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ProvinceVente">Sale Province</Label>
              <Input
                id="ProvinceVente"
                name="ProvinceVente"
                value={formData.ProvinceVente || ''}
                onChange={handleInputChange}
                placeholder="Enter sale province"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="VilleAffectation">Assigned City</Label>
              <Input
                id="VilleAffectation"
                name="VilleAffectation"
                value={formData.VilleAffectation || ''}
                onChange={handleInputChange}
                placeholder="Enter assigned city"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ProvinceAffectation">Assigned Province</Label>
              <Input
                id="ProvinceAffectation"
                name="ProvinceAffectation"
                value={formData.ProvinceAffectation || ''}
                onChange={handleInputChange}
                placeholder="Enter assigned province"
              />
            </div>
            {/* ... other fields as needed ... */}
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
            <Button
              type="submit"
              disabled={isLoading || currentUser?.droit === 'consul'} // <-- Add this line
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
          {currentUser?.droit === 'consul' && (
            <div className="text-xs text-red-500 mt-2">
              You do not have permission to save changes.
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMotorcycleForm;
