import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function LoginForm({ onToggleMode }: { onToggleMode: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔑 로그인 시도:', email);
      await signIn(email, password);
      console.log('✅ 로그인 성공');
    } catch (err: any) {
      console.error('❌ 로그인 에러:', err);
      console.error('에러 메시지:', err.message);
      console.error('에러 전체:', JSON.stringify(err, null, 2));

      if (err.message?.includes('Invalid login credentials')) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다. 계정이 없다면 회원가입을 진행해주세요.');
      } else if (err.message?.includes('Email not confirmed')) {
        setError('이메일 인증이 완료되지 않았습니다. 이메일을 확인하여 계정을 활성화해주세요.');
      } else {
        setError(`로그인 실패: ${err.message || '알 수 없는 오류'}`);
      }

      alert(`로그인 실패\n\n에러: ${err.message}\n\n콘솔(F12)에서 자세한 내용을 확인하세요.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">로그인</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="이메일을 입력하세요"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          계정이 없으신가요?{' '}
          <button
            type="button"
            onClick={onToggleMode}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            회원가입
          </button>
        </p>
      </div>
    </div>
  );
}
