import { ReactNode, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, profile, signOut } = useAuth();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const getRoleLabel = () => {
    if (!profile) return '';
    switch (profile.role) {
      case 'super_admin':
        return '통합 관리자';
      case 'brand_admin':
        return '브랜드 관리자';
      case 'creator_admin':
        return '크리에이터';
      default:
        return '';
    }
  };

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <LayoutDashboard className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">캠페인 관리 플랫폼</h1>
                  {profile && (
                    <p className="text-sm text-gray-500">{getRoleLabel()}</p>
                  )}
                </div>
              </div>

              {user && (
                <nav className="flex items-center space-x-6">
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown('campaign')}
                      className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition"
                    >
                      <span>캠페인</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {openDropdown === 'campaign' && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenDropdown(null);
                          }}
                        >
                          캠페인 등록
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenDropdown(null);
                          }}
                        >
                          캠페인 관리
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenDropdown(null);
                          }}
                        >
                          크리에이터 찾기
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown('creator')}
                      className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition"
                    >
                      <span>크리에이터</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {openDropdown === 'creator' && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenDropdown(null);
                          }}
                        >
                          추천 크리에이터
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenDropdown(null);
                          }}
                        >
                          크리에이터 분석
                        </a>
                      </div>
                    )}
                  </div>
                </nav>
              )}
            </div>

            {user && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{profile?.full_name}</p>
                  {profile?.company_name && (
                    <p className="text-xs text-gray-500">{profile.company_name}</p>
                  )}
                </div>
                <button
                  onClick={signOut}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>로그아웃</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
