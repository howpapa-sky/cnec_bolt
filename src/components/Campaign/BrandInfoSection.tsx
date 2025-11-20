interface BrandInfoSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export function BrandInfoSection({ value, onChange }: BrandInfoSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-4">
          브랜드와 제품에 대한 소개를 작성해주세요. 크리에이터들이 캠페인을 이해하는데 도움이 됩니다.
        </p>
      </div>

      <div>
        <label htmlFor="brandDescription" className="block text-sm font-medium text-gray-700 mb-2">
          브랜드 설명
        </label>
        <textarea
          id="brandDescription"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="브랜드의 특징, 제품의 장점, 캠페인 목적 등을 자유롭게 작성해주세요."
        />
        <p className="mt-2 text-sm text-gray-500">
          현재 {value.length}자
        </p>
      </div>
    </div>
  );
}
