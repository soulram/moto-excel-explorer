import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Motorcycle } from '../lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '@/components/ui/label';
import * as XLSX from 'xlsx';
import { useAuthStore } from '@/lib/store';

interface EditMotorcycleFormProps {
  motorcycle: Motorcycle;
  onCancel: () => void;
  onSave: () => void;
}

function formatDateForInput(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

function formatDateForDisplay(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

const EMPTY_MOTO: Motorcycle = {
  FrameNumber: '',
  Marque: '',
  DateArrivage: '',
  MODELE: '',
  NFacture: '',
  Color: '',
  revendeur: '',
  client: '',
  DateVenteRevendeur: '',
  DateVenteClient: '',
  cnie: '',
  observation: '',
  DateNaissance: '',
  Sexe: '',
  VilleVente: '',
  ProvinceVente: '',
  VilleAffectation: '',
  ProvinceAffectation: ''
};

const API_BASE = "http://localhost:5000";

const EditMotorcycleForm = ({ motorcycle, onCancel, onSave }: EditMotorcycleFormProps) => {
  const [formData, setFormData] = useState<Motorcycle>({ ...EMPTY_MOTO, ...motorcycle });
  const [isLoading, setIsLoading] = useState(false);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [villesVente, setVillesVente] = useState<string[]>([]);
  const [villesAffectation, setVillesAffectation] = useState<string[]>([]);
  const [initialProvinceVente, setInitialProvinceVente] = useState<string | null>(null);
  const [initialProvinceAffectation, setInitialProvinceAffectation] = useState<string | null>(null);
  const { toast } = useToast();
  const currentUser = useAuthStore(state => state.currentUser);

  // Fetch provinces on mount
  useEffect(() => {
    async function fetchProvinces() {
      try {
        const res = await fetch(`${API_BASE}/api/provinces`);
        const data = await res.json();
        const provinceSet = new Set<string>();
        for (const row of data) {
          if (row.province) provinceSet.add(row.province);
        }
        setProvinces(Array.from(provinceSet).sort());
      } catch (error) {
        setProvinces([]);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: "Impossible de charger la liste des provinces."
        });
      }
    }
    fetchProvinces();
  }, [toast]);

  // Reset formData when motorcycle changes, and set initial province for ville fetching
  useEffect(() => {
    setFormData({ ...EMPTY_MOTO, ...motorcycle });
    setInitialProvinceVente(motorcycle.ProvinceVente ?? '');
    setInitialProvinceAffectation(motorcycle.ProvinceAffectation ?? '');
  }, [motorcycle]);

  // Fetch villesVente when ProvinceVente changes or on first load
  useEffect(() => {
    async function fetchVilles() {
      if (formData.ProvinceVente) {
        try {
          const res = await fetch(`${API_BASE}/api/villes?province=${encodeURIComponent(formData.ProvinceVente)}`);
          const data = await res.json();
          setVillesVente(data);

          // If VilleVente is not in the new villes, reset it (unless just set for the first time on dialog open)
          if (
            initialProvinceVente !== null &&
            formData.ProvinceVente === initialProvinceVente &&
            formData.VilleVente
          ) {
            // Keep VilleVente as-is for initial load
          } else if (!data.includes(formData.VilleVente)) {
            setFormData(prev => ({ ...prev, VilleVente: '' }));
          }
        } catch {
          setVillesVente([]);
        }
      } else {
        setVillesVente([]);
        setFormData(prev => ({ ...prev, VilleVente: '' }));
      }
    }
    fetchVilles();
    // eslint-disable-next-line
  }, [formData.ProvinceVente, initialProvinceVente]);

  // Fetch villesAffectation when ProvinceAffectation changes or on first load
  useEffect(() => {
    async function fetchVilles() {
      if (formData.ProvinceAffectation) {
        try {
          const res = await fetch(`${API_BASE}/api/villes?province=${encodeURIComponent(formData.ProvinceAffectation)}`);
          const data = await res.json();
          setVillesAffectation(data);

          if (
            initialProvinceAffectation !== null &&
            formData.ProvinceAffectation === initialProvinceAffectation &&
            formData.VilleAffectation
          ) {
            // Keep VilleAffectation as-is for initial load
          } else if (!data.includes(formData.VilleAffectation)) {
            setFormData(prev => ({ ...prev, VilleAffectation: '' }));
          }
        } catch {
          setVillesAffectation([]);
        }
      } else {
        setVillesAffectation([]);
        setFormData(prev => ({ ...prev, VilleAffectation: '' }));
      }
    }
    fetchVilles();
    // eslint-disable-next-line
  }, [formData.ProvinceAffectation, initialProvinceAffectation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value || '',
    }));
    // If province changes, also reset initialProvinceX to null so initial-load logic doesn't run again
    if (name === 'ProvinceVente') setInitialProvinceVente(null);
    if (name === 'ProvinceAffectation') setInitialProvinceAffectation(null);
  };

  const preventTyping = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSend = {
        ...formData,
        DateArrivage: formData.DateArrivage ? formatDateForInput(formData.DateArrivage) : null,
        DateVenteRevendeur: formData.DateVenteRevendeur ? formatDateForInput(formData.DateVenteRevendeur) : null,
        DateVenteClient: formData.DateVenteClient ? formatDateForInput(formData.DateVenteClient) : null,
        DateNaissance: formData.DateNaissance ? formatDateForInput(formData.DateNaissance) : null,
      };
      const response = await fetch(`${API_BASE}/api/motorcycles/${motorcycle.FrameNumber}`, {
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
      DateArrivage: formatDateForDisplay(formData.DateArrivage),
      DateVenteRevendeur: formatDateForDisplay(formData.DateVenteRevendeur),
      DateVenteClient: formatDateForDisplay(formData.DateVenteClient),
      DateNaissance: formatDateForDisplay(formData.DateNaissance),
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
          <DialogTitle>Modifier la moto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Date d'arrivée - fully disabled */}
            <div className="space-y-2">
              <Label htmlFor="DateArrivage">Date d'arrivée</Label>
              <Input
                id="DateArrivage"
                name="DateArrivage"
                type="date"
                value={formatDateForInput(formData.DateArrivage)}
                disabled
              />
              <div className="text-sm text-gray-500">
                {formData.DateArrivage ? formatDateForDisplay(formData.DateArrivage) : 'Aucune date sélectionnée'}
              </div>
            </div>

            {/* Date de vente au revendeur - only calendar */}
            <div className="space-y-2">
              <Label htmlFor="DateVenteRevendeur">Date de vente au revendeur</Label>
              <Input
                id="DateVenteRevendeur"
                name="DateVenteRevendeur"
                type="date"
                value={formatDateForInput(formData.DateVenteRevendeur)}
                onChange={handleInputChange}
                onKeyDown={preventTyping}
                autoComplete="off"
              />
              <div className="text-sm text-gray-500">
                {formData.DateVenteRevendeur ? formatDateForDisplay(formData.DateVenteRevendeur) : 'Aucune date sélectionnée'}
              </div>
            </div>

            {/* Date de vente au client - only calendar */}
            <div className="space-y-2">
              <Label htmlFor="DateVenteClient">Date de vente au client</Label>
              <Input
                id="DateVenteClient"
                name="DateVenteClient"
                type="date"
                value={formatDateForInput(formData.DateVenteClient)}
                onChange={handleInputChange}
                onKeyDown={preventTyping}
                autoComplete="off"
              />
              <div className="text-sm text-gray-500">
                {formData.DateVenteClient ? formatDateForDisplay(formData.DateVenteClient) : 'Aucune date sélectionnée'}
              </div>
            </div>

            {/* Date de naissance - only calendar */}
            <div className="space-y-2">
              <Label htmlFor="DateNaissance">Date de naissance</Label>
              <Input
                id="DateNaissance"
                name="DateNaissance"
                type="date"
                value={formatDateForInput(formData.DateNaissance)}
                onChange={handleInputChange}
                onKeyDown={preventTyping}
                autoComplete="off"
              />
              <div className="text-sm text-gray-500">
                {formData.DateNaissance ? formatDateForDisplay(formData.DateNaissance) : 'Aucune date sélectionnée'}
              </div>
            </div>

            {/* Other fields as before */}
            <div className="space-y-2">
              <Label htmlFor="Sexe">Sexe</Label>
              <Input
                id="Sexe"
                name="Sexe"
                value={formData.Sexe || ''}
                onChange={handleInputChange}
                placeholder="Saisir le sexe"
              />
            </div>

            {/* Ville de vente - dynamic */}
            <div className="space-y-2">
              <Label htmlFor="VilleVente">Ville de vente</Label>
              <select
                id="VilleVente"
                name="VilleVente"
                value={formData.VilleVente || ''}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                disabled={!formData.ProvinceVente}
              >
                <option value="">Sélectionner la ville</option>
                {villesVente.map(ville => (
                  <option key={ville} value={ville}>{ville}</option>
                ))}
              </select>
            </div>

            {/* Province de vente as select listbox */}
            <div className="space-y-2">
              <Label htmlFor="ProvinceVente">Province de vente</Label>
              <select
                id="ProvinceVente"
                name="ProvinceVente"
                value={formData.ProvinceVente || ''}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Sélectionner la province</option>
                {provinces.map(prov => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>

            {/* Ville d'affectation - dynamic */}
            <div className="space-y-2">
              <Label htmlFor="VilleAffectation">Ville d'affectation</Label>
              <select
                id="VilleAffectation"
                name="VilleAffectation"
                value={formData.VilleAffectation || ''}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                disabled={!formData.ProvinceAffectation}
              >
                <option value="">Sélectionner la ville</option>
                {villesAffectation.map(ville => (
                  <option key={ville} value={ville}>{ville}</option>
                ))}
              </select>
            </div>

            {/* Province d'affectation as select listbox */}
            <div className="space-y-2">
              <Label htmlFor="ProvinceAffectation">Province d'affectation</Label>
              <select
                id="ProvinceAffectation"
                name="ProvinceAffectation"
                value={formData.ProvinceAffectation || ''}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Sélectionner la province</option>
                {provinces.map(prov => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={exportToExcel}>
                Exporter vers Excel
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
            </div>
            <Button
              type="submit"
              disabled={isLoading || currentUser?.droit === 'consul'}
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </DialogFooter>
          {currentUser?.droit === 'consul' && (
            <div className="text-xs text-red-500 mt-2">
              Vous n'avez pas la permission d'enregistrer les modifications.
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMotorcycleForm;