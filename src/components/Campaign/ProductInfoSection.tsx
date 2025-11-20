import { useState, useEffect } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ProductInfoSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export function ProductInfoSection({ formData, updateFormData }: ProductInfoSectionProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (formData.categoryId) {
      loadSubcategories(formData.categoryId);
    }
  }, [formData.categoryId]);

  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .is('parent_id', null);

    if (data) setCategories(data);
  };

  const loadSubcategories = async (parentId: string) => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('parent_id', parentId);

    if (data) setSubcategories(data);
  };

  const addColor = () => {
    const newColor = {
      colorCode: '#000000',
      colorName: '',
      thumbnailUrl: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400',
      quantity: 1,
    };
    updateFormData('colors', [...formData.colors, newColor]);
  };

  const updateColor = (index: number, field: string, value: any) => {
    const updatedColors = [...formData.colors];
    updatedColors[index] = { ...updatedColors[index], [field]: value };
    updateFormData('colors', updatedColors);
  };

  const removeColor = (index: number) => {
    const updatedColors = formData.colors.filter((_: any, i: number) => i !== index);
    updateFormData('colors', updatedColors);
  };

  const addDetailImage = () => {
    const newImage = 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800';
    updateFormData('detailImages', [...formData.detailImages, newImage]);
  };

  const removeDetailImage = (index: number) => {
    const updatedImages = formData.detailImages.filter((_: any, i: number) => i !== index);
    updateFormData('detailImages', updatedImages);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            제품명 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.productName}
            onChange={(e) => updateFormData('productName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="브랜드명을 포함하지 말고 순수하게 제품명만 입력해 주세요."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            value={formData.productUrl}
            onChange={(e) => updateFormData('productUrl', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/product"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            시중가 <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.retailPrice}
            onChange={(e) => updateFormData('retailPrice', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            수량 <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.productQuantity}
            onChange={(e) => updateFormData('productQuantity', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상위 카테고리 <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.categoryId}
            onChange={(e) => {
              updateFormData('categoryId', e.target.value);
              updateFormData('subcategoryId', '');
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">선택</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            하위 카테고리 <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.subcategoryId}
            onChange={(e) => updateFormData('subcategoryId', e.target.value)}
            disabled={!formData.categoryId}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">
              {formData.categoryId ? '선택' : '상위 카테고리를 먼저 선택해주세요.'}
            </option>
            {subcategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-4">색상 정보 입력</h4>

        {formData.colors.map((color: any, index: number) => (
          <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-gray-700">색상 {index + 1}</span>
              <button
                onClick={() => removeColor(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  색상값 <span className="text-red-500">*</span>
                </label>
                <input
                  type="color"
                  value={color.colorCode}
                  onChange={(e) => updateColor(index, 'colorCode', e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  색상명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={color.colorName}
                  onChange={(e) => updateColor(index, 'colorName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: 블랙, 화이트"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  수량 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={color.quantity}
                  onChange={(e) => updateColor(index, 'quantity', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                대표 이미지 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-4">
                <img
                  src={color.thumbnailUrl}
                  alt="썸네일"
                  className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                />
                <div className="flex-1">
                  <input
                    type="url"
                    value={color.thumbnailUrl}
                    onChange={(e) => updateColor(index, 'thumbnailUrl', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="이미지 URL"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    정사각형 비율을 권장합니다. 5MB 이하의 파일을 업로드 해주세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addColor}
          className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          <span>다른 색상 추가하기</span>
        </button>
      </div>

      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-4">상세 이미지 업로드</h4>
        <p className="text-sm text-gray-600 mb-4">
          세로 길이 10,000px 이상의 이미지는 여러 장으로 나누어서 업로드 해주세요. 5MB 이하의 파일을 업로드 해주세요.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {formData.detailImages.map((image: string, index: number) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`상세 이미지 ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-300"
              />
              <button
                onClick={() => removeDetailImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addDetailImage}
          className="flex items-center justify-center space-x-2 w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
        >
          <Upload className="w-5 h-5 text-gray-400" />
          <span className="text-gray-600">이미지 추가</span>
        </button>
      </div>
    </div>
  );
}
