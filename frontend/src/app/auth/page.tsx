"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaChartLine, FaStar, FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaShieldAlt, FaCoins, FaChartBar } from 'react-icons/fa'
import { authAPI } from '@/lib/api'

export default function AuthPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const result = await authAPI.login({ 
        username: formData.username, 
        password: formData.password 
      })
      
      router.push(result.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (error: any) {
      if (error.response?.data?.detail) {
        setError(error.response.data.detail)
      } else {
        setError('로그인에 실패했습니다.')
      }
    }
    
    setIsLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const result = await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'user'
      })
      
      router.push('/dashboard')
    } catch (error: any) {
      if (error.response?.data?.detail) {
        setError(error.response.data.detail)
      } else {
        setError('회원가입에 실패했습니다.')
      }
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-900 relative overflow-hidden flex items-center justify-center">
      {/* 배경 장식 요소들 */}
      <div className="absolute inset-0">
        {/* 그리드 패턴 */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
        {/* 움직이는 도형들 */}
        <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/6 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-green-500/10 rounded-full blur-lg animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* 플로팅 아이콘들 */}
        <div className="absolute top-1/5 right-1/5 text-emerald-500/20 text-4xl animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }}>
          <FaCoins />
        </div>
                 <div className="absolute bottom-1/4 left-1/6 text-teal-500/20 text-3xl animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4s' }}>
           <FaChartBar />
         </div>
        <div className="absolute top-1/3 left-1/4 text-green-500/20 text-2xl animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '5s' }}>
          <FaShieldAlt />
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5" />
          <div className="relative z-10">
          {/* 로고 및 제목 */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl">
                    <FaChartLine className="text-3xl text-white" />
                </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <FaStar className="text-xs text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent mb-2">
                Finance Mastery Hub
            </h1>
              <p className="text-emerald-300 font-medium">투자 전문가로 성장하는 여정을 시작하세요</p>
          </div>

              {/* 탭 메뉴 */}
            <div className="flex mb-8 bg-white/5 rounded-2xl p-1">
                <button
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    tab === 'login' 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => { setTab('login'); setError('') }}
                >
                  로그인
                </button>
                <button
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    tab === 'register' 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => { setTab('register'); setError('') }}
                >
                  회원가입
                </button>
              </div>

            {/* 오류 메시지 */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

              {/* 폼 */}
              {tab === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    사용자명
                    </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                      placeholder="사용자명을 입력하세요"
                      required
                    />
                  </div>
                </div>

                  <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                      비밀번호
                    </label>
                    <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                        placeholder="비밀번호를 입력하세요"
                      required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                  {isLoading ? '로그인 중...' : '로그인'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-6">
                  <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    사용자명
                    </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                      placeholder="사용자명을 입력하세요"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    이메일
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                      placeholder="이메일을 입력하세요"
                      required
                    />
                  </div>
                </div>

                  <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                      비밀번호
                    </label>
                    <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                        placeholder="비밀번호를 입력하세요"
                      required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                  {isLoading ? '가입 중...' : '회원가입'}
                  </button>
                </form>
              )}

            {/* 추가 정보 */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <FaShieldAlt />
                  <span>보안 인증</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaStar />
                  <span>무료 시작</span>
                </div>
                                 <div className="flex items-center gap-1">
                   <FaChartBar />
                   <span>전문가 교육</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            이미 10,000명 이상의 투자자들이 Finance Mastery Hub와 함께 성장하고 있습니다
          </p>
        </div>
      </div>
    </div>
  )
} 