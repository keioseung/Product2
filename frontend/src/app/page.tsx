"use client"

import { useRouter } from 'next/navigation'
import { FaChartLine, FaArrowRight, FaCoins, FaChartBar, FaShieldAlt, FaStar, FaCheckCircle } from 'react-icons/fa'
import { useEffect, useState } from 'react'

export default function IntroPage() {
  const router = useRouter()
  const [typedText, setTypedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  
  const fullText = "Finance Mastery Hub"
  const taglines = [
    "스마트한 투자, 확실한 수익",
    "금융 지식으로 미래를 설계하세요",
    "전문가 수준의 금융 교육 플랫폼",
    "성공 투자의 첫 걸음을 시작하세요"
  ]
  const [currentTagline, setCurrentTagline] = useState(0)

  // 타이핑 애니메이션
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, 100)
      return () => clearTimeout(timeout)
    } else {
      setIsTyping(false)
    }
  }, [currentIndex, fullText])

  // 태그라인 순환
  useEffect(() => {
    if (!isTyping) {
      const interval = setInterval(() => {
        setCurrentTagline((prev) => (prev + 1) % taglines.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isTyping, taglines.length])

  // 스크롤 이벤트
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-900 relative overflow-hidden">
      {/* 헤더 */}
      <header className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <FaChartLine className="text-white text-lg" />
            </div>
            <span className="text-white font-bold text-xl">Finance Mastery</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-emerald-400 transition-colors">기능</a>
            <a href="#benefits" className="text-gray-300 hover:text-emerald-400 transition-colors">혜택</a>
            <a href="#testimonials" className="text-gray-300 hover:text-emerald-400 transition-colors">후기</a>
            <button 
              onClick={() => router.push('/auth')}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all"
            >
              시작하기
            </button>
          </nav>
        </div>
      </header>

      {/* 배경 요소들 */}
      <div className="absolute inset-0">
        {/* 그리드 패턴 */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* 움직이는 도형들 */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-32 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-green-500/10 rounded-full blur-lg animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* 플로팅 아이콘들 */}
        <div className="absolute top-1/3 right-1/4 text-emerald-500/20 text-6xl animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }}>
          <FaCoins />
        </div>
        <div className="absolute bottom-1/3 left-1/5 text-teal-500/20 text-4xl animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4s' }}>
          <FaChartBar />
        </div>
      </div>

      {/* 메인 히어로 섹션 */}
      <section className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* 메인 제목 */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-6">
              <FaStar className="text-emerald-400 text-sm" />
              <span className="text-emerald-300 text-sm font-medium">전문가들이 선택한 #1 금융 교육 플랫폼</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
                {typedText}
                {isTyping && <span className="animate-pulse">|</span>}
              </span>
            </h1>
            
            <div className="h-8 mb-8">
              <p className="text-xl md:text-2xl text-emerald-300 font-medium">
                {taglines[currentTagline]}
              </p>
            </div>
            
            <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10">
              체계적인 금융 교육과 실전 퀴즈로 투자 전문가로 성장하세요.<br />
              매일 업데이트되는 최신 금융 정보와 맞춤형 학습 시스템을 경험해보세요.
            </p>
          </div>

          {/* CTA 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={() => router.push('/auth')}
              className="group bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 flex items-center gap-3"
            >
              무료로 시작하기
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold text-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
              데모 보기
            </button>
          </div>

          {/* 신뢰도 지표 */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">10K+</div>
              <div className="text-gray-400 text-sm">활성 사용자</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">95%</div>
              <div className="text-gray-400 text-sm">만족도</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">4.9★</div>
              <div className="text-gray-400 text-sm">평점</div>
            </div>
          </div>
        </div>
      </section>

      {/* 기능 섹션 */}
      <section id="features" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              전문가 수준의 금융 교육
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              체계적인 커리큘럼과 실전 중심의 학습으로 투자 성공의 길을 안내합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FaCoins,
                title: "실전 투자 교육",
                desc: "주식, 채권, 펀드 등 다양한 투자 상품에 대한 깊이 있는 분석과 전략을 학습하세요. 실제 시장 데이터를 기반으로 한 케이스 스터디를 제공합니다.",
                color: "from-emerald-500 to-teal-500",
                bgColor: "bg-emerald-500/10"
              },
              {
                icon: FaChartBar,
                title: "맞춤형 퀴즈 시스템",
                desc: "개인의 학습 수준에 맞춰 난이도가 조절되는 퀴즈로 실력을 체크하세요. AI가 분석한 취약점을 보완할 수 있는 맞춤 문제를 제공합니다.",
                color: "from-teal-500 to-cyan-500",
                bgColor: "bg-teal-500/10"
              },
              {
                icon: FaShieldAlt,
                title: "리스크 관리 교육",
                desc: "성공적인 투자의 핵심인 리스크 관리 전략을 체계적으로 학습하세요. 포트폴리오 분산과 헤지 전략까지 전문가 노하우를 전수합니다.",
                color: "from-cyan-500 to-blue-500",
                bgColor: "bg-cyan-500/10"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`${feature.bgColor} border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/5 transition-all duration-500 hover:scale-105 group relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 혜택 섹션 */}
      <section id="benefits" className="relative z-10 py-20 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                투자 성공률을<br />
                <span className="text-emerald-400">3배 높이는</span><br />
                체계적 학습
              </h2>
              
              <div className="space-y-6">
                {[
                  "매일 업데이트되는 최신 시장 분석",
                  "개인별 맞춤 학습 커리큘럼",
                  "전문가 인사이트와 투자 전략",
                  "실시간 포트폴리오 분석 도구"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaCheckCircle className="text-white text-sm" />
                    </div>
                    <span className="text-gray-300 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => router.push('/auth')}
                className="mt-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300"
              >
                지금 시작하기
              </button>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl p-8 backdrop-blur-sm border border-white/10">
                <div className="text-center">
                  <div className="text-6xl font-black text-emerald-400 mb-4">₩</div>
                  <h3 className="text-2xl font-bold text-white mb-4">월 평균 수익률</h3>
                  <div className="text-4xl font-bold text-emerald-400 mb-2">+12.5%</div>
                  <p className="text-gray-300">사용자 평균 (최근 6개월)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 CTA */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            금융 전문가로의 여정을<br />
            지금 시작하세요
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            무료 계정으로 시작해서 프리미엄 콘텐츠까지, 단계별로 성장하는 투자 여정을 경험해보세요.
          </p>
          <button
            onClick={() => router.push('/auth')}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
          >
            무료로 시작하기
          </button>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <FaChartLine className="text-white text-sm" />
            </div>
            <span className="text-white font-bold text-lg">Finance Mastery Hub</span>
          </div>
          <p className="text-gray-400 mb-4">스마트한 투자로 더 나은 미래를 만들어가세요</p>
          <p className="text-gray-500 text-sm">© 2024 Finance Mastery Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
} 

