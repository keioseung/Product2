"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChartLine, FaArrowRight, FaCoins, FaChartBar, FaBullseye, FaFire, FaStar, FaBookOpen, FaGraduationCap, FaUsers, FaCalendar } from 'react-icons/fa'
import { TrendingUp, Calendar, Trophy, Target, BarChart3, BookOpen, Award, DollarSign } from 'lucide-react'
import Sidebar from '@/components/sidebar'
import AIInfoCard from '@/components/ai-info-card'
import TermsQuizSection from '@/components/terms-quiz-section'
import ProgressSection from '@/components/progress-section'
import LearnedTermsSection from '@/components/learned-terms-section'
import useAIInfo from '@/hooks/use-ai-info'
import useUserProgress, { useUserStats } from '@/hooks/use-user-progress'
import { useRouter } from 'next/navigation'
import { useFetchAINews } from '@/hooks/use-ai-info'
import { useQueryClient } from '@tanstack/react-query'
import { userProgressAPI } from '@/lib/api'

// 금융 용어 샘플 데이터
const TERMS = [
  { term: "주식", description: "회사의 소유권을 나타내는 증서" },
  { term: "채권", description: "정부나 기업이 발행하는 부채 증서" },
  { term: "배당금", description: "주주들에게 지급하는 이익의 일부" },
  { term: "P/E 비율", description: "주가를 주당순이익으로 나눈 가치평가 지표" },
  { term: "포트폴리오", description: "투자자가 보유한 모든 투자자산의 조합" },
  { term: "분산투자", description: "여러 자산에 투자하여 위험을 분산하는 전략" },
  { term: "복리", description: "원금과 이자에 대한 이자까지 계산하는 방식" },
  { term: "인플레이션", description: "전반적인 물가 수준이 지속적으로 상승하는 현상" },
  { term: "ROE", description: "자기자본이익률, 기업의 수익성을 나타내는 지표" },
  { term: "변동성", description: "자산 가격의 변동 정도를 나타내는 지표" }
]

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('sessionId')
      if (!id) {
        id = Math.random().toString(36).substring(2, 15)
        localStorage.setItem('sessionId', id)
      }
      return id
    }
    return 'default'
  })
  const { data: aiInfo, isLoading: aiInfoLoading } = useAIInfo(selectedDate)
  const { data: userProgress, isLoading: progressLoading } = useUserProgress(sessionId)
  const { data: userStats } = useUserStats(sessionId)
  const router = useRouter()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'ai' | 'quiz' | 'progress' | 'news' | 'term'>('ai')
  const { data: news, isLoading: newsLoading } = useFetchAINews()
  const [randomTerm, setRandomTerm] = useState(() => TERMS[Math.floor(Math.random() * TERMS.length)])
  
  // 타이핑 애니메이션 상태
  const [typedText, setTypedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const fullText = "Finance Mastery Hub"
  
  // 환영 메시지 애니메이션
  const [currentWelcome, setCurrentWelcome] = useState(0)
  const welcomeMessages = [
    "오늘도 금융 학습을 시작해보세요! 🚀",
    "새로운 투자 지식이 여러분을 기다리고 있어요! 💡",
    "함께 성장하는 금융 여정을 떠나볼까요? 🌟"
  ]

  const handleRandomTerm = () => {
    setRandomTerm(TERMS[Math.floor(Math.random() * TERMS.length)])
  }

  // 타이핑 애니메이션
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, 150)
      return () => clearTimeout(timeout)
    } else {
      setIsTyping(false)
    }
  }, [currentIndex, fullText])

  // 환영 메시지 순환
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWelcome((prev) => (prev + 1) % welcomeMessages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [welcomeMessages.length])

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser')
    if (!userStr) {
      router.replace('/auth')
      return
    }
    const user = JSON.parse(userStr)
    if (user.role !== 'user') {
      router.replace('/admin')
    }
  }, [router])

  // 학습 진행률 계산
  const totalFinanceInfo = aiInfo?.length || 0
  const totalTerms = 60 // 3개 금융 정보 × 20개 용어씩
  
  // 로컬 스토리지에서 학습 상태 확인
  const localProgress = (() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('userProgress')
        if (stored) {
          const parsed = JSON.parse(stored)
          return parsed[sessionId]?.[selectedDate] || []
        }
      } catch (error) {
        console.error('Failed to parse local progress:', error)
      }
    }
    return []
  })()
  
  // 백엔드 데이터와 로컬 데이터 통합
  const backendProgress = userProgress?.[selectedDate] || []
  const learnedFinanceInfo = Math.max(localProgress.length, backendProgress.length)
  const financeInfoProgress = totalFinanceInfo > 0 ? (learnedFinanceInfo / totalFinanceInfo) * 100 : 0

  const learnedTerms = Array.isArray(userProgress?.total_terms_learned) ? userProgress.total_terms_learned.length : (userProgress?.total_terms_learned ?? 0)
  const termsProgress = totalTerms > 0 ? (learnedTerms / totalTerms) * 100 : 0

  const [forceUpdate, setForceUpdate] = useState(0)
  
  const handleProgressUpdate = () => {
    setForceUpdate(prev => prev + 1)
    queryClient.invalidateQueries({ queryKey: ['user-progress'] })
    queryClient.invalidateQueries({ queryKey: ['user-stats'] })
  }

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['ai-info'] })
    queryClient.invalidateQueries({ queryKey: ['user-progress'] })
    queryClient.invalidateQueries({ queryKey: ['ai-news'] })
    setForceUpdate(prev => prev + 1)
  }

  const aiInfoFixed = aiInfo || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-900 relative">
      {/* 배경 효과 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-40 right-32 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl animate-pulse" />
      </div>

      {/* 헤더 */}
      <header className="relative z-20 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <FaChartLine className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">Finance Mastery</h1>
              <p className="text-emerald-400 text-sm">Professional Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white font-medium">Welcome back!</p>
              <p className="text-emerald-400 text-sm">{welcomeMessages[currentWelcome]}</p>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem('currentUser')
                router.push('/auth')
              }}
              className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/30 transition-all"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* 사이드바 */}
        <div className="w-80 h-screen sticky top-0">
          <Sidebar 
            selectedDate={selectedDate} 
            onDateChange={setSelectedDate} 
            sessionId={sessionId}
          />
        </div>

        {/* 메인 컨텐츠 */}
        <main className="flex-1 relative z-10 p-6">
          {/* 대시보드 개요 카드들 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <FaBookOpen className="text-white text-xl" />
                </div>
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{learnedFinanceInfo}/3</div>
              <div className="text-emerald-300 text-sm">금융 정보 학습</div>
            </div>

            <div className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                  <FaGraduationCap className="text-white text-xl" />
                </div>
                <Award className="w-6 h-6 text-teal-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{learnedTerms}</div>
              <div className="text-teal-300 text-sm">습득한 용어</div>
            </div>

            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center">
                  <FaChartBar className="text-white text-xl" />
                </div>
                <BarChart3 className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{userStats?.quiz_score || 0}점</div>
              <div className="text-cyan-300 text-sm">퀴즈 점수</div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <FaFire className="text-white text-xl" />
                </div>
                <Trophy className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{userStats?.streak_days || 0}일</div>
              <div className="text-blue-300 text-sm">연속 학습</div>
        </div>
      </div>

          {/* 날짜 선택 (금융 정보 탭에서만 표시) */}
      {activeTab === 'ai' && (
            <div className="flex justify-center mb-6">
              <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-2 border border-white/10">
            <input 
              type="date" 
              value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
                <span className="ml-3 text-emerald-300 font-medium">
              {selectedDate === new Date().toISOString().split('T')[0] ? '오늘' : selectedDate}
            </span>
          </div>
        </div>
      )}

      {/* 탭 메뉴 */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-2 bg-black/20 backdrop-blur-xl rounded-2xl p-2 border border-white/10">
          {[
                { id: 'ai', label: '금융 정보', icon: DollarSign, gradient: 'from-emerald-500 to-teal-500' },
                { id: 'quiz', label: '용어 퀴즈', icon: Award, gradient: 'from-teal-500 to-cyan-500' },
                { id: 'progress', label: '진행률', icon: TrendingUp, gradient: 'from-cyan-500 to-blue-500' },
                { id: 'news', label: '금융 뉴스', icon: BookOpen, gradient: 'from-blue-500 to-indigo-500' },
                { id: 'term', label: '용어 학습', icon: Target, gradient: 'from-indigo-500 to-purple-500' }
          ].map((tab) => (
            <button
              key={tab.id}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                activeTab === tab.id 
                  ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg` 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setActiveTab(tab.id as any)}
            >
                  <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        <button 
          onClick={handleRefresh} 
                className="ml-3 px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all font-semibold border border-white/10"
        >
          새로고침
        </button>
            </div>
      </div>

          {/* 탭별 컨텐츠 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
            className="max-w-6xl mx-auto"
        >
          {activeTab === 'ai' && (
              <section className="mb-16">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">오늘의 금융 정보</h2>
                  <p className="text-gray-400">전문가가 엄선한 최신 금융 정보를 학습하세요</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {aiInfoFixed.length === 0 && (
                    <div className="col-span-2 bg-black/20 backdrop-blur-xl rounded-2xl p-12 flex flex-col items-center justify-center text-center border border-white/10">
                      <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                        <FaBookOpen className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">금융 정보가 없습니다</h3>
                      <p className="text-gray-400">오늘의 학습 자료를 준비 중입니다</p>
                  </div>
                )}
                {aiInfoFixed.map((info, index) => {
                  const isLearnedLocally = localProgress.includes(index)
                  const isLearnedBackend = backendProgress.includes(index)
                  const isLearned = isLearnedLocally || isLearnedBackend
                  
                  return (
                    <AIInfoCard
                      key={index}
                      info={info}
                      index={index}
                      date={selectedDate}
                      sessionId={sessionId}
                      isLearned={isLearned}
                      onProgressUpdate={handleProgressUpdate}
                      forceUpdate={forceUpdate}
                      setForceUpdate={setForceUpdate}
                    />
                  )
                })}
              </div>
            </section>
          )}

          {activeTab === 'quiz' && (
              <section className="mb-16">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">금융 용어 퀴즈</h2>
                  <p className="text-gray-400">학습한 내용을 퀴즈로 확인해보세요</p>
                </div>
                <TermsQuizSection sessionId={sessionId} selectedDate={selectedDate} />
            </section>
          )}

          {activeTab === 'progress' && (
              <section className="mb-16">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">학습 진행률</h2>
                  <p className="text-gray-400">체계적인 학습 분석으로 성장을 확인하세요</p>
                </div>
                <ProgressSection sessionId={sessionId} />
            </section>
          )}

          {activeTab === 'news' && (
              <section className="mb-16">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">금융 뉴스</h2>
                  <p className="text-gray-400">최신 금융 트렌드를 놓치지 마세요</p>
                </div>
              {newsLoading ? (
                  <div className="text-white/80 text-center py-12">뉴스를 불러오는 중...</div>
              ) : news && news.length > 0 ? (
                  <div className="space-y-6">
                  {news.map((item: any, idx: number) => (
                    <a 
                      key={idx} 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                        className="block bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/5 transition-all hover:scale-[1.02]"
                    >
                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{item.title}</h3>
                        <p className="text-gray-300 mb-4 line-clamp-3">{item.content}</p>
                        <span className="text-emerald-400 font-medium">뉴스 원문 보기 →</span>
                    </a>
                  ))}
                </div>
              ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <BookOpen className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">금융 뉴스가 없습니다</h3>
                    <p className="text-gray-400">새로운 뉴스를 준비 중입니다</p>
                  </div>
              )}
            </section>
          )}

          {activeTab === 'term' && (
              <section className="mb-16">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">용어 학습</h2>
                  <p className="text-gray-400">금융 전문용어를 마스터하세요</p>
                </div>
              <LearnedTermsSection sessionId={sessionId} />
            </section>
          )}
        </motion.div>
      </main>
      </div>
    </div>
  )
} 