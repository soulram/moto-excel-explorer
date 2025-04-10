
export interface Motorcycle {
  id?: number;
  framenumber: string;
  color: string;
  nfacture: string;
  modele: string;
  marque: string;
}

export interface ExcelData {
  vfacture: string;
  vmodele: string;
  vmarque: string;
  motorcycles: {
    framenumber: string;
    color: string;
  }[];
}
