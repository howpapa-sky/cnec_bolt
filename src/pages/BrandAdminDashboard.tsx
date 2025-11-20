import { useState } from 'react';
import { Plus, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { CampaignForm } from '../components/Campaign/CampaignForm';

export function BrandAdminDashboard() {
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [campaigns] = useState<any[]>([]);
  const [stats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalApplications: 0,
  });


  const getStatusBadge = (status: string) => {
    const styles: any = {
      draft: 'bg-gray-100 text-gray-700',
      active: 'bg-green-100 text-green-700',
      completed: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700',
    };

    const labels: any = {
      draft: '임시저장',
      active: '진행중',
      completed: '완료',
      cancelled: '취소',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (showCampaignForm) {
    return (
      <div>
        <button
          onClick={() => setShowCampaignForm(false)}
          className="mb-4 text-blue-600 hover:text-blue-700 font-medium"
        >
          ← 대시보드로 돌아가기
        </button>
        <CampaignForm />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">브랜드 관리자 대시보드</h1>
          <p className="text-gray-600 mt-2">캠페인을 생성하고 관리하세요.</p>
        </div>
        <button
          onClick={() => setShowCampaignForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>새 캠페인 만들기</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">전체 캠페인</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalCampaigns}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">진행중 캠페인</p>
          <p className="text-3xl font-bold text-gray-900">{stats.activeCampaigns}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">총 지원자</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">내 캠페인</h2>
        </div>

        {campaigns.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-4">아직 생성된 캠페인이 없습니다</p>
            <button
              onClick={() => setShowCampaignForm(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              첫 캠페인 만들기 →
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {campaign.brand_description?.substring(0, 50) || '캠페인'}
                      </h3>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <p className="text-sm text-gray-600">
                      생성일: {new Date(campaign.created_at).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  {campaign.campaign_pricing?.[0] && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600">총 예산</p>
                      <p className="text-lg font-bold text-blue-600">
                        {campaign.campaign_pricing[0].total_budget?.toLocaleString()}원
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  {campaign.recruitment_start && campaign.recruitment_end && (
                    <span>
                      모집기간: {new Date(campaign.recruitment_start).toLocaleDateString()} - {new Date(campaign.recruitment_end).toLocaleDateString()}
                    </span>
                  )}
                  {campaign.delivery_service && (
                    <span>택배: {campaign.delivery_service}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
