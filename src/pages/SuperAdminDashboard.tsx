import { useState } from 'react';
import { Users, Briefcase, TrendingUp, FileText } from 'lucide-react';

export function SuperAdminDashboard() {
  const [stats] = useState({
    totalUsers: 0,
    totalBrands: 0,
    totalCampaigns: 0,
    activeCampaigns: 0,
  });

  const statCards = [
    { title: '전체 사용자', value: stats.totalUsers, icon: Users, color: 'blue' },
    { title: '등록 브랜드', value: stats.totalBrands, icon: Briefcase, color: 'green' },
    { title: '전체 캠페인', value: stats.totalCampaigns, icon: FileText, color: 'purple' },
    { title: '진행중 캠페인', value: stats.activeCampaigns, icon: TrendingUp, color: 'orange' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">통합 관리자 대시보드</h1>
        <p className="text-gray-600 mt-2">플랫폼 전체 현황을 확인하고 관리하세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">최근 활동</h2>
          <p className="text-gray-500 text-center py-8">최근 활동 내역이 표시됩니다</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">시스템 알림</h2>
          <p className="text-gray-500 text-center py-8">시스템 알림이 표시됩니다</p>
        </div>
      </div>
    </div>
  );
}
