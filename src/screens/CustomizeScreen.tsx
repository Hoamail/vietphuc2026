import React from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Check, Info, ShieldAlert } from 'lucide-react';
import {
  getTrangPhucById,
  KB_TRANG_PHUC,
  PURPOSES,
  POTTERY_SILK_PALETTES,
  getAccessoriesForGarment,
  GarmentAccessoryOption,
  formatNguonText,
} from '../data/kb';
import { RemixCustomization, Purpose } from '../types/vietphuc';
import { SourceCitationText } from '../components/SourceCitationText';

interface CustomizeScreenProps {
  customization: RemixCustomization;
  selectedOutfitId: string;
  selectedPurposeId: Purpose['id'];
  onChangeCustomization: (updated: Partial<RemixCustomization>) => void;
  onBack: () => void;
  onGenerateResult: () => void;
}

export const CustomizeScreen: React.FC<CustomizeScreenProps> = ({
  customization,
  selectedOutfitId,
  selectedPurposeId,
  onChangeCustomization,
  onBack,
  onGenerateResult,
}) => {
  const outfit = getTrangPhucById(selectedOutfitId) || KB_TRANG_PHUC[0];
  const purpose = PURPOSES.find((p) => p.id === selectedPurposeId) || PURPOSES[0];
  const currentColor =
    POTTERY_SILK_PALETTES.find((c) => c.id === customization.colorSchemeId) || POTTERY_SILK_PALETTES[0];

  // Phụ kiện trích xuất trực tiếp từ phu_kien và goi_y_phoi_do của trang phục đã chọn
  const accessoryOptions: GarmentAccessoryOption[] = getAccessoriesForGarment(outfit);

  const toggleAccessory = (id: string) => {
    const current = customization.selectedAccessoryIds;
    if (current.includes(id)) {
      onChangeCustomization({ selectedAccessoryIds: current.filter((x) => x !== id) });
    } else {
      onChangeCustomization({ selectedAccessoryIds: [...current, id] });
    }
  };

  const getRemixLevelTitle = (level: 1 | 2 | 3) => {
    switch (level) {
      case 1:
        return 'Truyền thống';
      case 2:
        return 'Cách tân nhẹ';
      case 3:
      default:
        return 'Remix streetwear';
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#DED7C6] pb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#7A8691] uppercase tracking-wider font-semibold mb-1">
            <span>Bước 2 / 3</span>
            <span aria-hidden="true">·</span>
            <span>Tùy biến phong cách</span>
          </div>
          <h1 className="font-heritage-display text-2xl sm:text-3xl font-bold text-[#161A1D]">
            Tuỳ Biến Bản Phối Việt Phục
          </h1>
          <p className="text-xs sm:text-sm text-[#52606D] mt-1">
            Lựa chọn mức độ cách tân, bảng màu gợi ý và phụ kiện theo nguồn tư liệu trang phục.
          </p>
        </div>

        <div className="hidden sm:block text-right">
          <div className="text-xs text-[#8E7E6B] font-medium">Đang phối cho:</div>
          <div className="font-heritage-display text-sm font-bold text-[#1E3F5A]">
            {outfit.ten}
          </div>
          <div className="text-xs text-[#52606D]">{purpose.shortTag}</div>
        </div>
      </div>

      {/* 1. Mức độ Cách tân (3 levels: Truyền thống, Cách tân nhẹ, Remix streetwear) */}
      <section className="bg-white rounded-2xl border border-[#DED7C6] p-5 shadow-2xs space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1E3F5A]">
              1. Mức độ cách tân trang phục
            </h2>
            <span className="text-xs font-semibold text-[#1E3F5A] px-2.5 py-0.5 rounded bg-[#EBF2F7]">
              {getRemixLevelTitle(customization.remixLevel)}
            </span>
          </div>
          <p className="text-xs text-[#6C7A87] mt-1">
            Chọn định hướng phù hợp với bối cảnh sử dụng thực tế.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Level 1: Truyền thống */}
          <button
            type="button"
            onClick={() => onChangeCustomization({ remixLevel: 1 })}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              customization.remixLevel === 1
                ? 'border-[#1E3F5A] bg-[#EBF2F7] ring-2 ring-[#1E3F5A]/20'
                : 'border-[#DED7C6] bg-white hover:border-[#1E3F5A]/40'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-[#1E3F5A] mb-1">
              <span>Truyền thống</span>
              {customization.remixLevel === 1 && <Check className="w-4 h-4 text-[#1E3F5A]" />}
            </div>
            <p className="text-xs text-[#52606D] leading-relaxed">
              Bảo tồn phom dáng, cấu trúc cổ áo, hàng cúc và nẹp thân theo tư liệu chuẩn xác.
            </p>
          </button>

          {/* Level 2: Cách tân nhẹ */}
          <button
            type="button"
            onClick={() => onChangeCustomization({ remixLevel: 2 })}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              customization.remixLevel === 2
                ? 'border-[#1E3F5A] bg-[#EBF2F7] ring-2 ring-[#1E3F5A]/20'
                : 'border-[#DED7C6] bg-white hover:border-[#1E3F5A]/40'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-[#1E3F5A] mb-1">
              <span>Cách tân nhẹ</span>
              {customization.remixLevel === 2 && <Check className="w-4 h-4 text-[#1E3F5A]" />}
            </div>
            <p className="text-xs text-[#52606D] leading-relaxed">
              Giữ phom dáng cơ bản, tinh giản tà và tay áo cho nhu cầu di chuyển, chụp ảnh kỷ yếu.
            </p>
          </button>

          {/* Level 3: Remix streetwear */}
          <button
            type="button"
            onClick={() => onChangeCustomization({ remixLevel: 3 })}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              customization.remixLevel === 3
                ? 'border-[#1E3F5A] bg-[#EBF2F7] ring-2 ring-[#1E3F5A]/20'
                : 'border-[#DED7C6] bg-white hover:border-[#1E3F5A]/40'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-[#1E3F5A] mb-1">
              <span>Remix streetwear</span>
              {customization.remixLevel === 3 && <Check className="w-4 h-4 text-[#1E3F5A]" />}
            </div>
            <p className="text-xs text-[#52606D] leading-relaxed">
              Ứng dụng phong cách đương đại linh hoạt, khoác ngoài kết hợp trang phục thường nhật.
            </p>
          </button>
        </div>
      </section>

      {/* 2. Bảng Màu Thiết Kế (Gợi ý của app) */}
      <section className="bg-white rounded-2xl border border-[#DED7C6] p-5 shadow-2xs space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1E3F5A]">
              2. Bảng màu phối đồ
            </h2>
            <span className="text-[11px] font-semibold text-[#8B5A2B] bg-[#FDF9F0] px-2 py-0.5 rounded border border-[#C88E1B]/30">
              Gợi ý thiết kế của app
            </span>
          </div>
          <p className="text-xs text-[#6C7A87] mt-1">
            Các gam màu men gốm và tơ tằm là đề xuất thẩm mỹ từ ứng dụng, giúp bạn dễ dàng hình dung bản phối.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {POTTERY_SILK_PALETTES.map((palette) => {
            const isSelected = palette.id === customization.colorSchemeId;
            return (
              <div
                key={palette.id}
                onClick={() => onChangeCustomization({ colorSchemeId: palette.id })}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#1E3F5A] bg-[#F8F6F0] ring-2 ring-[#1E3F5A]/20 shadow-2xs'
                    : 'border-[#DED7C6] bg-white hover:border-[#1E3F5A]/40'
                }`}
              >
                <div>
                  {/* Swatches */}
                  <div className="flex items-center gap-1.5 h-6 mb-2.5">
                    <div
                      className="h-full flex-2 rounded-l-md border border-black/10"
                      style={{ backgroundColor: palette.primaryHex }}
                    />
                    <div
                      className="h-full flex-1 border border-black/10"
                      style={{ backgroundColor: palette.secondaryHex }}
                    />
                    <div
                      className="h-full flex-1 rounded-r-md border border-black/10"
                      style={{ backgroundColor: palette.accentHex }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-[#161A1D]">
                    <span>{palette.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#1E3F5A]" />}
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#DED7C6]/50 text-[10px] text-[#7A8691]">
                  {palette.note}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Phụ Kiện (Trích xuất từ phu_kien và goi_y_phoi_do của trang phục đã chọn) */}
      <section className="bg-white rounded-2xl border border-[#DED7C6] p-5 shadow-2xs space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1E3F5A]">
              3. Phụ kiện theo trang phục ({customization.selectedAccessoryIds.length} đã chọn)
            </h2>
            <span className="text-xs text-[#7A8691]">Chạm để chọn / bỏ chọn</span>
          </div>
          <p className="text-xs text-[#6C7A87] mt-1">
            Dữ liệu phụ kiện lấy từ mục tư liệu lịch sử và gợi ý phối đồ của <strong>{outfit.ten}</strong>.
          </p>
        </div>

        {accessoryOptions.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#DED7C6] text-xs text-[#7A8691] text-center">
            Chưa có nguồn
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {accessoryOptions.map((acc) => {
              const isSelected = customization.selectedAccessoryIds.includes(acc.id);
              return (
                <button
                  type="button"
                  key={acc.id}
                  onClick={() => toggleAccessory(acc.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#1E3F5A] bg-[#EBF2F7] ring-1 ring-[#1E3F5A]'
                      : 'border-[#DED7C6] bg-white hover:border-[#1E3F5A]/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-semibold text-xs text-[#161A1D] leading-snug">
                      <SourceCitationText text={acc.name} />
                    </span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#1E3F5A] shrink-0 mt-0.5" />
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#DED7C6]/40 flex items-center justify-between text-[10px]">
                    {acc.isAppSuggestion ? (
                      <span className="text-[#8B5A2B] bg-[#FDF9F0] px-1.5 py-0.5 rounded border border-[#C88E1B]/20 font-medium">
                        Gợi ý của app, không phải sự thật lịch sử
                      </span>
                    ) : (
                      <span className="text-[#1E3F5A] bg-[#EBF2F7] px-1.5 py-0.5 rounded font-medium">
                        Tư liệu KB-v3
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Điều kiện & Bối cảnh thực tế */}
      <section className="bg-white rounded-2xl border border-[#DED7C6] p-5 shadow-2xs space-y-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#1E3F5A]">
            4. Điều kiện ứng dụng thực tế
          </h2>
          <p className="text-xs text-[#6C7A87] mt-1">
            Gợi ý phụ trợ để hỗ trợ trải nghiệm mặc thoải mái nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Weather */}
          <div>
            <label className="font-semibold text-[#161A1D] block mb-1.5">
              Thời tiết & Khí hậu:
            </label>
            <div className="space-y-1.5">
              {[
                { id: 'summer', label: 'Nắng ấm / Mùa hè' },
                { id: 'autumn_breeze', label: 'Mát mẻ / Thu se lạnh' },
                { id: 'winter_cold', label: 'Trời lạnh / Mùa đông' },
              ].map((w) => (
                <button
                  type="button"
                  key={w.id}
                  onClick={() => onChangeCustomization({ weather: w.id as any })}
                  className={`w-full text-left px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
                    customization.weather === w.id
                      ? 'border-[#1E3F5A] bg-[#EBF2F7] text-[#1E3F5A] font-semibold'
                      : 'border-[#DED7C6] bg-white text-[#52606D]'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gender / Form */}
          <div>
            <label className="font-semibold text-[#161A1D] block mb-1.5">
              Dáng người & Giới tính:
            </label>
            <div className="space-y-1.5">
              {[
                { id: 'unisex', label: 'Phi giới tính (Unisex)' },
                { id: 'nam', label: 'Dáng Nam' },
                { id: 'nu', label: 'Dáng Nữ' },
              ].map((g) => (
                <button
                  type="button"
                  key={g.id}
                  onClick={() => onChangeCustomization({ genderPreference: g.id as any })}
                  className={`w-full text-left px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
                    customization.genderPreference === g.id
                      ? 'border-[#1E3F5A] bg-[#EBF2F7] text-[#1E3F5A] font-semibold'
                      : 'border-[#DED7C6] bg-white text-[#52606D]'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="font-semibold text-[#161A1D] block mb-1.5">
              Ngân sách sinh viên:
            </label>
            <div className="space-y-1.5">
              {[
                { id: 'tiet-kiem', label: 'Tiết kiệm (Thuê hoặc tự phối)' },
                { id: 'tieu-chuan', label: 'Tiêu chuẩn học sinh - sinh viên' },
                { id: 'cao-cap', label: 'May đo cao cấp' },
              ].map((b) => (
                <button
                  type="button"
                  key={b.id}
                  onClick={() => onChangeCustomization({ studentBudget: b.id as any })}
                  className={`w-full text-left px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
                    customization.studentBudget === b.id
                      ? 'border-[#1E3F5A] bg-[#EBF2F7] text-[#1E3F5A] font-semibold'
                      : 'border-[#DED7C6] bg-white text-[#52606D]'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#DED7C6]">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold text-[#52606D] hover:text-[#161A1D] flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Chọn trang phục khác</span>
        </button>

        <button
          type="button"
          onClick={onGenerateResult}
          className="px-6 py-2.5 bg-[#B93826] hover:bg-[#8E2516] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-md"
        >
          <span>Xem bản phối hoàn chỉnh</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
