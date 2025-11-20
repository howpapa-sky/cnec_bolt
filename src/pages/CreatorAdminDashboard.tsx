import { useState } from 'react';
import { Search, Filter, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export function CreatorAdminDashboard() {
  const [campaigns] = useState<any[]>([]);
  const [myApplications] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'available' | 'applied'>('available');

  const handleApply = async (campaignId: string) => {
    alert('데모 모드에서는 지원 기능이 제한됩니다.');
  };

  const getApplicationStatus = (campaignId: string) => {
    return myApplications.find((app) => app.campaigns.id === campaignId);
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };

    const labels: any = {
      pending: '검토중',
      approved: '승인됨',
      rejected: '거절됨',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.brand_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.brands?.brand_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    availableCampaigns: campaigns.length,
    appliedCampaigns: myApplications.filter((a) => a.status === 'pending').length,
    approvedCampaigns: myApplications.filter((a) => a.status === 'approved').length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">크리에이터 대시보드</h1>
        <p className="text-gray-600 mt-2">참여 가능한 캠페인을 찾아보세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">참여 가능 캠페인</p>
          <p className="text-3xl font-bold text-gray-900">{stats.availableCampaigns}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">지원 대기중</p>
          <p className="text-3xl font-bold text-gray-900">{stats.appliedCampaigns}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">승인된 캠페인</p>
          <p className="text-3xl font-bold text-gray-900">{stats.approvedCampaigns}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setSelectedTab('available')}
                className={`px-4 py-2 font-medium rounded-lg transition ${
                  selectedTab === 'available'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                참여 가능 캠페인
              </button>
              <button
                onClick={() => setSelectedTab('applied')}
                className={`px-4 py-2 font-medium rounded-lg transition ${
                  selectedTab === 'applied'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                지원한 캠페인
              </button>
            </div>
          </div>

          {selectedTab === 'available' && (
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="캠페인 검색..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Filter className="w-4 h-4" />
                <span>필터</span>
              </button>
            </div>
          )}
        </div>

        <div className="divide-y divide-gray-200">
          {selectedTab === 'available' ? (
            filteredCampaigns.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-600">진행중인 캠페인이 없습니다</p>
              </div>
            ) : (
              filteredCampaigns.map((campaign) => {
                const application = getApplicationStatus(campaign.id);
                return (
                  <div key={campaign.id} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {campaign.brands?.brand_name}
                          </h3>
                          {campaign.campaign_pricing?.[0] && (
                            <span className="text-blue-600 font-bold">
                              {campaign.campaign_pricing[0].base_price?.toLocaleString()}원
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {campaign.brand_description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          {campaign.recruitment_end && (
                            <span>
                              마감: {new Date(campaign.recruitment_end).toLocaleDateString()}
                            </span>
                          )}
                          {campaign.products?.[0] && (
                            <span>{campaign.products[0].product_name}</span>
                          )}
                        </div>
                      </div>

                      <div className="ml-4">
                        {application ? (
                          getStatusBadge(application.status)
                        ) : (
                          <button
                            onClick={() => handleApply(campaign.id)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                          >
                            지원하기
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            myApplications.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-600">지원한 캠페인이 없습니다</p>
              </div>
            ) : (
              myApplications.map((application) => (
                <div key={application.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.campaigns?.brands?.brand_name}
                        </h3>
                        {getStatusBadge(application.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {application.campaigns?.brand_description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>
                          지원일: {new Date(application.applied_at).toLocaleDateString('ko-KR')}
                        </span>
                        {application.campaigns?.campaign_pricing?.[0] && (
                          <span className="text-blue-600 font-bold">
                            {application.campaigns.campaign_pricing[0].base_price?.toLocaleString()}원
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
}
