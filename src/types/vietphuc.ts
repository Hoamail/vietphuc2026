export type KBMucChacChan = 'cao' | 'trung_binh' | 'thap';

export interface Purpose {
  id: 'school-grad' | 'wedding-ceremony' | 'streetwear-cafe' | 'stage-performance' | 'art-concept';
  title: string;
  shortTag: string;
  vibe: string;
  description: string;
  formalityLevel: string;
}

export interface ColorScheme {
  id: string;
  name: string;
  primaryHex: string;
  secondaryHex: string;
  accentHex: string;
  backgroundHex: string;
  note: string;
}

export interface RemixCustomization {
  remixLevel: 1 | 2 | 3; // 1: Truyền thống, 2: Cách tân nhẹ, 3: Remix streetwear
  colorSchemeId: string;
  selectedAccessoryIds: string[];
  weather: 'summer' | 'autumn_breeze' | 'winter_cold';
  genderPreference: 'unisex' | 'nam' | 'nu';
  studentBudget: 'tiet-kiem' | 'tieu-chuan' | 'cao-cap';
}

export interface SavedLook {
  id: string;
  title: string;
  outfitId: string;
  purposeId: Purpose['id'];
  customization: RemixCustomization;
  savedAt: string;
  notes?: string;
  tags: string[];
}
