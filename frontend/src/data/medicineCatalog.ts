export interface MedicineCatalogItem {
  id: string
  brandName: string
  saltName: string
  dosage: string
  brandPrice: number
  genericPrice: number
  keywords: string[]
}

export const MEDICINE_CATALOG: MedicineCatalogItem[] = [
  { id: 'm1', brandName: 'Glycomet 500', saltName: 'Metformin', dosage: '500mg', brandPrice: 85, genericPrice: 12, keywords: ['glycomet', 'metformin', 'glymet'] },
  { id: 'm2', brandName: 'Lipitor 10', saltName: 'Atorvastatin', dosage: '10mg', brandPrice: 145, genericPrice: 18, keywords: ['lipitor', 'atorvastatin'] },
  { id: 'm3', brandName: 'Deplatt 75', saltName: 'Clopidogrel', dosage: '75mg', brandPrice: 165, genericPrice: 33, keywords: ['deplatt', 'clopidogrel'] },
  { id: 'm4', brandName: 'Crocin 500', saltName: 'Paracetamol', dosage: '500mg', brandPrice: 30, genericPrice: 4, keywords: ['crocin', 'paracetamol', 'calpol', 'dolo'] },
  { id: 'm5', brandName: 'Pan 40', saltName: 'Pantoprazole', dosage: '40mg', brandPrice: 95, genericPrice: 14, keywords: ['pan', 'pantoprazole', 'pantocid'] },
  { id: 'm6', brandName: 'Amlip 5', saltName: 'Amlodipine', dosage: '5mg', brandPrice: 75, genericPrice: 10, keywords: ['amlip', 'amlodipine', 'amlong'] },
  { id: 'm7', brandName: 'Telma 40', saltName: 'Telmisartan', dosage: '40mg', brandPrice: 120, genericPrice: 18, keywords: ['telma', 'telmisartan'] },
  { id: 'm8', brandName: 'Cetcip 10', saltName: 'Cetirizine', dosage: '10mg', brandPrice: 45, genericPrice: 6, keywords: ['cetcip', 'cetirizine', 'okacet'] },
  { id: 'm9', brandName: 'Amoxil 500', saltName: 'Amoxicillin', dosage: '500mg', brandPrice: 80, genericPrice: 22, keywords: ['amoxil', 'amoxicillin', 'mox'] },
  { id: 'm10', brandName: 'Feronia XT', saltName: 'Iron + Folic Acid', dosage: '—', brandPrice: 65, genericPrice: 12, keywords: ['feronia', 'iron', 'folic', 'dexorange'] },
  { id: 'm11', brandName: 'Shelcal 500', saltName: 'Calcium + Vit D3', dosage: '500mg', brandPrice: 115, genericPrice: 20, keywords: ['shelcal', 'calcium'] },
  { id: 'm12', brandName: 'Electral', saltName: 'ORS', dosage: '—', brandPrice: 25, genericPrice: 8, keywords: ['electral', 'ors'] },
  { id: 'm13', brandName: 'Betaloc 25', saltName: 'Metoprolol', dosage: '25mg', brandPrice: 90, genericPrice: 14, keywords: ['betaloc', 'metoprolol'] },
  { id: 'm14', brandName: 'Omez 20', saltName: 'Omeprazole', dosage: '20mg', brandPrice: 70, genericPrice: 10, keywords: ['omez', 'omeprazole'] },
  { id: 'm15', brandName: 'Losartan 50', saltName: 'Losartan', dosage: '50mg', brandPrice: 110, genericPrice: 16, keywords: ['losartan'] },
]