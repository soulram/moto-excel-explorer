export interface Motorcycle {
  FrameNumber: string;
  Color: string;
  NFacture: string;
  MODELE: string;
  Marque: string;
  revendeur: string | null;
  client: string | null;
  DateArrivage: string | null;        // YYYY-MM-DD HH:MM:SS
  DateVenteRevendeur: string | null;  // YYYY-MM-DD HH:MM:SS
  DateVenteClient: string | null;     // YYYY-MM-DD HH:MM:SS
  DateNaissance: string | null;       // YYYY-MM-DD HH:MM:SS
  cnie: string | null;
  observation: string | null;
  Sexe: string | null;
  VilleVente: string | null;
  ProvinceVente: string | null;
  VilleAffectation: string | null;
  ProvinceAffectation: string | null;
}


export interface ExcelData {
  vfacture: string;
  vmodele: string;
  vmarque: string;
  vdatearrivage: string;
  motorcycles: {
    FrameNumber: string;
    Color: string;
  }[];
}