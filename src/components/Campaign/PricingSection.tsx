interface PricingSectionProps {
  basePrice: number;
  allowHigherTier: boolean;
  higherTierPrice?: number;
  productQuantity: number;
  onUpdate: (field: string, value: any) => void;
}

const PRICE_OPTIONS = [200000, 300000, 400000, 500000];

export function PricingSection({
  basePrice,
  allowHigherTier,
  higherTierPrice,
  productQuantity,
  onUpdate,
}: PricingSectionProps) {
  const totalBudget = basePrice * productQuantity;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          제품 당 원고료
        </label>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {PRICE_OPTIONS.map((price) => (
            <button
              key={price}
              onClick={() => onUpdate('basePrice', price)}
              className={`px-4 py-3 rounded-lg border-2 font-medium transition ${
                basePrice === price
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {price.toLocaleString()}원
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          {PRICE_OPTIONS.map((price) => (
            <div key={price} className="text-xs text-gray-500">
              <a href="#" className="text-blue-600 hover:underline">
                레퍼런스 모음
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">제품 수량</p>
            <p className="text-2xl font-bold text-gray-900">{productQuantity}개</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">총 원고료</p>
            <p className="text-2xl font-bold text-blue-600">{totalBudget.toLocaleString()}원</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          결제는 캠페인 생성 마지막 단계에서 진행합니다.
        </p>
      </div>

      <div className="border-t pt-6">
        <h4 className="font-medium text-gray-900 mb-3">
          조금 더 실력있는 인플루언서의 지원도 함께 받아보기
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          {basePrice / 10000}만원보다 높은 캠페인에만 참여하는 소수의 글로브 추천 인플루언서들이
          이번 캠페인에 원고료를 높여 지원할 수 있게 해주세요.
        </p>

        <div className="space-y-3">
          <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
            <input
              type="radio"
              name="higherTier"
              checked={allowHigherTier && higherTierPrice === 400000}
              onChange={() => {
                onUpdate('allowHigherTier', true);
                onUpdate('higherTierPrice', 400000);
              }}
              className="w-4 h-4 text-blue-600"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">40만원 지원자까지 받아보기</p>
              <p className="text-sm text-gray-500">정말 잘하시는 분들이 어떤지 궁금하긴 해요.</p>
            </div>
          </label>

          <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
            <input
              type="radio"
              name="higherTier"
              checked={allowHigherTier && higherTierPrice === 350000}
              onChange={() => {
                onUpdate('allowHigherTier', true);
                onUpdate('higherTierPrice', 350000);
              }}
              className="w-4 h-4 text-blue-600"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">35만원 지원자까지 받아보기</p>
              <p className="text-sm text-gray-500">예산은 정해져 있지만 일단 받아볼게요</p>
            </div>
          </label>

          <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
            <input
              type="radio"
              name="higherTier"
              checked={!allowHigherTier}
              onChange={() => {
                onUpdate('allowHigherTier', false);
                onUpdate('higherTierPrice', undefined);
              }}
              className="w-4 h-4 text-blue-600"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">기본 금액만 받기</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
