import { Package } from 'lucide-react';

interface DeliverySectionProps {
  value: string;
  onChange: (value: string) => void;
}

const DELIVERY_SERVICES = [
  { id: 'cj', name: 'CJ 대한통운', icon: '📦' },
  { id: 'post', name: '우체국 택배', icon: '📮' },
  { id: 'hanjin', name: '한진택배', icon: '🚚' },
  { id: 'lotte', name: '롯데택배', icon: '📫' },
  { id: 'logen', name: '로젠택배', icon: '🚛' },
  { id: 'etc', name: '기타', icon: '📋' },
];

export function DeliverySection({ value, onChange }: DeliverySectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">5. 이용 예정 택배사</h3>
        <p className="text-sm text-gray-600 mb-6">
          제품 발송에 사용할 택배사를 선택해주세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DELIVERY_SERVICES.map((service) => (
          <label
            key={service.id}
            className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition ${
              value === service.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input
              type="radio"
              name="deliveryService"
              value={service.id}
              checked={value === service.id}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
            <div className="flex items-center space-x-2 flex-1">
              <span className="text-2xl">{service.icon}</span>
              <span className="font-medium text-gray-900">{service.name}</span>
            </div>
          </label>
        ))}
      </div>

      {value === 'etc' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            기타 택배사명을 입력해주세요
          </label>
          <input
            type="text"
            placeholder="택배사명을 입력하세요"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4 flex items-start space-x-3">
        <Package className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-gray-700">
          <p className="font-medium mb-1">택배 발송 안내</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>선정된 인플루언서에게 개별 연락드립니다</li>
            <li>정확한 배송 정보를 입력해주세요</li>
            <li>출고 후 송장번호를 등록해주세요</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
