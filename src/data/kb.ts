import kbDataRaw from './kb-v3.json';
import { KBDatabase, KBTrangPhuc, KBNguonMap, KBNguonItem, KBMucChacChan } from '../types/kb';
import { Purpose, SavedLook, RemixCustomization } from '../types/vietphuc';

export const KB_DATA = kbDataRaw as KBDatabase;
export const KB_TRANG_PHUC: KBTrangPhuc[] = KB_DATA.trang_phuc;
export const KB_NGUON: KBNguonMap = KB_DATA.nguon;

// Mapping ID aliases for backward-compatibility
const ID_ALIASES: Record<string, string> = {
  'ao-ngu-than': 'ao_ngu_than_tay_chen',
  'ao-tac': 'ao_tac',
  'ao-giao-linh': 'ao_giao_linh',
  'ao-tu-than': 'ao_tu_than',
  'ao-nhat-binh': 'ao_dai_tan_thoi',
  'ao_dai': 'ao_dai_tan_thoi',
  'ao-ba-ba': 'ao_ba_ba',
};

export function getTrangPhucById(id: string): KBTrangPhuc | undefined {
  const resolvedId = ID_ALIASES[id] || id;
  return KB_TRANG_PHUC.find((item) => item.id === resolvedId);
}

export function getNguonById(key: string): KBNguonItem | undefined {
  return KB_NGUON[key];
}

export function getTenNguon(key: string): string {
  return KB_NGUON[key]?.ten || key;
}

export function getLoaiNguon(key: string): string {
  return KB_NGUON[key]?.loai || 'chua_xac_dinh';
}

export function getLoaiNguonLabel(loai: string): string {
  switch (loai) {
    case 'bao_chi_nha_nuoc':
      return 'Báo chí nhà nước';
    case 'thuong_mai':
      return 'Thương mại';
    case 'tai_lieu_hoc_sinh':
      return 'Tài liệu học sinh';
    case 'tap_chi_van_hoa_doc_lap':
      return 'Tạp chí văn hóa độc lập';
    case 'blog':
      return 'Blog';
    case 'tap_chi':
      return 'Tạp chí';
    case 'co_quan_nghien_cuu':
      return 'Cơ quan nghiên cứu';
    case 'tap_chi_hoc_thuat':
      return 'Tạp chí học thuật';
    case 'bao_chi':
      return 'Báo chí';
    case 'chua_xac_dinh':
    default:
      return 'Chưa xác định';
  }
}

export function getMucChacChanLabel(muc: KBMucChacChan | string): string {
  switch (muc) {
    case 'cao':
      return 'Cao';
    case 'trung_binh':
      return 'Trung bình';
    case 'thap':
    default:
      return 'Thấp';
  }
}

export function formatNguonText(text?: string): string {
  if (!text || text.trim() === '') return 'Chưa có nguồn';
  return text.replace(/Chưa có nguồn xác nhận(\s+trong các trích đoạn)?/gi, 'Chưa có nguồn');
}

export interface GarmentAccessoryOption {
  id: string;
  name: string;
  sourceType: 'phu_kien' | 'goi_y';
  isAppSuggestion: boolean;
  rawText: string;
}

export function getAccessoriesForGarment(garment: KBTrangPhuc): GarmentAccessoryOption[] {
  const options: GarmentAccessoryOption[] = [];

  // 1. Phụ kiện từ trường phu_kien của KB
  if (Array.isArray(garment.phu_kien)) {
    garment.phu_kien.forEach((pk, index) => {
      if (!pk) return;
      options.push({
        id: `pk-${garment.id}-${index}`,
        name: formatNguonText(pk),
        sourceType: 'phu_kien',
        isAppSuggestion: false,
        rawText: pk,
      });
    });
  }

  // 2. Phụ kiện từ trường goi_y_phoi_do
  if (Array.isArray(garment.goi_y_phoi_do)) {
    garment.goi_y_phoi_do.forEach((gy, index) => {
      if (gy.loai === 'phu_kien' || gy.loai === 'phoi_hien_dai') {
        options.push({
          id: `gy-${garment.id}-${index}`,
          name: gy.noi_dung,
          sourceType: 'goi_y',
          isAppSuggestion: true,
          rawText: gy.noi_dung,
        });
      }
    });
  }

  return options;
}

export interface AppColorScheme {
  id: string;
  name: string;
  primaryHex: string;
  secondaryHex: string;
  accentHex: string;
  backgroundHex: string;
  note: string;
}

export const POTTERY_SILK_PALETTES: AppColorScheme[] = [
  {
    id: 'men-lam-chu-dau',
    name: 'Men Lam & Trắng Gốm',
    primaryHex: '#1E3F5A',
    secondaryHex: '#EBF2F7',
    accentHex: '#C88E1B',
    backgroundHex: '#F8F6F0',
    note: 'Gợi ý thiết kế của app',
  },
  {
    id: 'men-ngoc-celadon',
    name: 'Men Ngọc Celadon',
    primaryHex: '#2E6254',
    secondaryHex: '#E9F2EE',
    accentHex: '#D4AF37',
    backgroundHex: '#F5F8F6',
    note: 'Gợi ý thiết kế của app',
  },
  {
    id: 'dat-nung-chu-sa',
    name: 'Chu Sa & Đất Nung',
    primaryHex: '#B93826',
    secondaryHex: '#FBEFEF',
    accentHex: '#8E2516',
    backgroundHex: '#FAF4F2',
    note: 'Gợi ý thiết kế của app',
  },
  {
    id: 'men-ran-sa-thach',
    name: 'Men Rạn Sa Thạch',
    primaryHex: '#7A6248',
    secondaryHex: '#F5EFE6',
    accentHex: '#B89B72',
    backgroundHex: '#FAF7F2',
    note: 'Gợi ý thiết kế của app',
  },
  {
    id: 'to-tam-hoang-yen',
    name: 'Tơ Tằm Hoàng Yến',
    primaryHex: '#B58900',
    secondaryHex: '#FEF9E7',
    accentHex: '#D4AC0D',
    backgroundHex: '#FCFBF5',
    note: 'Gợi ý thiết kế của app',
  },
  {
    id: 'lanh-my-a-black',
    name: 'Lãnh Mỹ A Đen Tuyển',
    primaryHex: '#1E2328',
    secondaryHex: '#ECEFF1',
    accentHex: '#90A4AE',
    backgroundHex: '#F8F9FA',
    note: 'Gợi ý thiết kế của app',
  },
];

export interface AppPurpose {
  id: 'school-grad' | 'wedding-ceremony' | 'streetwear-cafe' | 'stage-performance' | 'art-concept';
  title: string;
  shortTag: string;
  vibe: string;
  description: string;
  formalityLevel: string;
}

export const PURPOSES: AppPurpose[] = [
  {
    id: 'school-grad',
    title: 'Lễ tốt nghiệp & Kỷ yếu',
    shortTag: 'Kỷ yếu',
    vibe: 'Trang trọng, thanh lịch',
    description: 'Dành cho dịp lễ tốt nghiệp và ảnh kỷ yếu học đường.',
    formalityLevel: 'Trang nghiêm',
  },
  {
    id: 'wedding-ceremony',
    title: 'Lễ cưới & Ăn hỏi',
    shortTag: 'Hôn lễ',
    vibe: 'Trọng thể, truyền thống',
    description: 'Dành cho ngày cưới hỏi và nghi lễ gia đình.',
    formalityLevel: 'Trang trọng',
  },
  {
    id: 'streetwear-cafe',
    title: 'Dạo phố & Cà phê cuối tuần',
    shortTag: 'Dạo phố',
    vibe: 'Năng động, đương đại',
    description: 'Ứng dụng trang phục truyền thống vào sinh hoạt thường nhật.',
    formalityLevel: 'Năng động phóng khoáng',
  },
  {
    id: 'stage-performance',
    title: 'Biểu diễn & Sân khấu học đường',
    shortTag: 'Sân khấu',
    vibe: 'Nổi bật, nghệ thuật',
    description: 'Dành cho hoạt động văn nghệ và sân khấu.',
    formalityLevel: 'Trang trọng vừa',
  },
  {
    id: 'art-concept',
    title: 'Concept nghệ thuật & Triển lãm',
    shortTag: 'Nghệ thuật',
    vibe: 'Duy mỹ, thể nghiệm',
    description: 'Dành cho dự án nhiếp ảnh và triển lãm văn hóa.',
    formalityLevel: 'Trang trọng vừa',
  },
];

export const INITIAL_LOOKBOOK: SavedLook[] = [
  {
    id: 'look-01',
    title: 'Áo Ngũ Thân Tay Chẽn · Phối Men Lam',
    outfitId: 'ao_ngu_than_tay_chen',
    purposeId: 'school-grad',
    customization: {
      remixLevel: 2,
      colorSchemeId: 'men-lam-chu-dau',
      selectedAccessoryIds: [],
      weather: 'autumn_breeze',
      genderPreference: 'unisex',
      studentBudget: 'tieu-chuan',
    },
    savedAt: '2026-05-12T14:30:00Z',
    notes: 'Bản phối dạo phố kỷ yếu kết hợp phong cách thanh lịch.',
    tags: ['Kỷ yếu', 'Áo ngũ thân', 'Men Lam'],
  },
  {
    id: 'look-02',
    title: 'Áo Tấc · Phối Chu Sa',
    outfitId: 'ao_tac',
    purposeId: 'wedding-ceremony',
    customization: {
      remixLevel: 1,
      colorSchemeId: 'dat-nung-chu-sa',
      selectedAccessoryIds: [],
      weather: 'autumn_breeze',
      genderPreference: 'nu',
      studentBudget: 'cao-cap',
    },
    savedAt: '2026-06-20T09:15:00Z',
    notes: 'Bản phối dáng áo tay thụng cho dịp lễ nghi trang trọng.',
    tags: ['Hôn lễ', 'Áo Tấc', 'Chu Sa'],
  },
  {
    id: 'look-03',
    title: 'Áo Giao Lĩnh · Phối Men Celadon',
    outfitId: 'ao_giao_linh',
    purposeId: 'art-concept',
    customization: {
      remixLevel: 3,
      colorSchemeId: 'men-ngoc-celadon',
      selectedAccessoryIds: [],
      weather: 'autumn_breeze',
      genderPreference: 'unisex',
      studentBudget: 'tiet-kiem',
    },
    savedAt: '2026-07-05T18:45:00Z',
    notes: 'Bản phối thể nghiệm cho dự án concept nghệ thuật.',
    tags: ['Nghệ thuật', 'Áo Giao Lĩnh', 'Celadon'],
  },
];
