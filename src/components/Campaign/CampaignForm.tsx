import { useState } from 'react';
import { BrandInfoSection } from './BrandInfoSection';
import { ProductInfoSection } from './ProductInfoSection';
import { PricingSection } from './PricingSection';
import { TimelineSection } from './TimelineSection';
import { DeliverySection } from './DeliverySection';

interface CampaignFormData {
  brandDescription: string;
  productName: string;
  productUrl: string;
  retailPrice: number;
  categoryId: string;
  subcategoryId: string;
  colors: Array<{
    colorCode: string;
    colorName: string;
    thumbnailUrl: string;
    quantity: number;
  }>;
  detailImages: string[];
  basePrice: number;
  allowHigherTier: boolean;
  higherTierPrice?: number;
  productQuantity: number;
  recruitmentStart: string;
  recruitmentEnd: string;
  selectionStart: string;
  selectionEnd: string;
  shippingDate: string;
  contentStart: string;
  contentEnd: string;
  deliveryService: string;
}

export function CampaignForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<CampaignFormData>({
    brandDescription: '',
    productName: '',
    productUrl: '',
    retailPrice: 0,
    categoryId: '',
    subcategoryId: '',
    colors: [],
    detailImages: [],
    basePrice: 200000,
    allowHigherTier: false,
    productQuantity: 0,
    recruitmentStart: '',
    recruitmentEnd: '',
    selectionStart: '',
    selectionEnd: '',
    shippingDate: '',
    contentStart: '',
    contentEnd: '',
    deliveryService: 'cj',
  });

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('캠페인 데이터:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || '캠페인 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">캠페인이 생성되었습니다!</h2>
        <p className="text-gray-600 mb-6">캠페인 관리 페이지에서 확인하실 수 있습니다.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          새 캠페인 만들기
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">캠페인 생성</h2>
        <p className="text-gray-600">모든 정보를 입력하고 스크롤하여 캠페인을 생성하세요.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-8">
        <div className="pb-8 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">1. 브랜드 소개</h3>
          <BrandInfoSection
            value={formData.brandDescription}
            onChange={(value) => updateFormData('brandDescription', value)}
          />
        </div>

        <div className="pb-8 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">2. 제품 정보</h3>
          <ProductInfoSection
            formData={formData}
            updateFormData={updateFormData}
          />
        </div>

        <div className="pb-8 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">3. 원고료 설정</h3>
          <PricingSection
            basePrice={formData.basePrice}
            allowHigherTier={formData.allowHigherTier}
            higherTierPrice={formData.higherTierPrice}
            productQuantity={formData.productQuantity}
            onUpdate={(field, value) => updateFormData(field, value)}
          />
        </div>

        <div className="pb-8 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">4. 캠페인 기간</h3>
          <TimelineSection
            formData={formData}
            updateFormData={updateFormData}
          />
        </div>

        <div className="pb-8 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">5. 택배사 선택</h3>
          <DeliverySection
            value={formData.deliveryService}
            onChange={(value) => updateFormData('deliveryService', value)}
          />
        </div>
      </div>

      <div className="flex justify-end mt-8 pt-6 border-t">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
        >
          {loading ? '생성 중...' : '캠페인 생성'}
        </button>
      </div>
    </div>
  );
}
