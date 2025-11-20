import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { SignUpForm } from './components/Auth/SignUpForm';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import { BrandAdminDashboard } from './pages/BrandAdminDashboard';
import { CreatorAdminDashboard } from './pages/CreatorAdminDashboard';
import { LogOut } from 'lucide-react';

function AppContent() {
  const { user, profile, loading, signOut } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="w-full max-w-md">
          {showSignUp ? (
            <SignUpForm onToggleMode={() => setShowSignUp(false)} />
          ) : (
            <LoginForm onToggleMode={() => setShowSignUp(true)} />
          )}
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (profile.role) {
      case 'super_admin':
        return <SuperAdminDashboard />;
      case 'brand_admin':
        return <BrandAdminDashboard />;
      case 'creator_admin':
        return <CreatorAdminDashboard />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return '슈퍼 관리자';
      case 'brand_admin':
        return '브랜드 관리자';
      case 'creator_admin':
        return '크리에이터';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900">캠페인 관리 플랫폼</h1>
              <p className="text-sm text-gray-500">{getRoleLabel(profile.role)}</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{profile.full_name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>로그아웃</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderDashboard()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
