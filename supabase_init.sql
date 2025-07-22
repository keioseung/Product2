-- =====================================================
-- Finance Mastery Hub - Supabase 데이터베이스 초기화 스크립트
-- =====================================================

-- 1. 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 활동 로그 테이블
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    username VARCHAR(255),
    action VARCHAR(255) NOT NULL,
    details TEXT,
    log_type VARCHAR(50) DEFAULT 'user',
    log_level VARCHAR(50) DEFAULT 'info',
    ip_address VARCHAR(255),
    user_agent TEXT,
    session_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 백업 히스토리 테이블
CREATE TABLE IF NOT EXISTS backup_history (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    file_size INTEGER,
    backup_type VARCHAR(50) DEFAULT 'manual',
    tables_included TEXT,
    description TEXT,
    created_by INTEGER,
    created_by_username VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 금융 정보 테이블 (기존 ai_info)
CREATE TABLE IF NOT EXISTS ai_info (
    id SERIAL PRIMARY KEY,
    date VARCHAR(20),
    info1_title TEXT,
    info1_content TEXT,
    info1_terms TEXT DEFAULT '[]',
    info2_title TEXT,
    info2_content TEXT,
    info2_terms TEXT DEFAULT '[]',
    info3_title TEXT,
    info3_content TEXT,
    info3_terms TEXT DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 퀴즈 테이블
CREATE TABLE IF NOT EXISTS quiz (
    id SERIAL PRIMARY KEY,
    topic VARCHAR(255),
    question TEXT,
    option1 TEXT,
    option2 TEXT,
    option3 TEXT,
    option4 TEXT,
    correct INTEGER,
    explanation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 사용자 진행률 테이블
CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255),
    date VARCHAR(20),
    learned_info TEXT,
    stats TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. 프롬프트 테이블
CREATE TABLE IF NOT EXISTS prompt (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    category VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. 기반 내용 테이블
CREATE TABLE IF NOT EXISTS base_content (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    category VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. 용어 테이블
CREATE TABLE IF NOT EXISTS term (
    id SERIAL PRIMARY KEY,
    term VARCHAR(255) UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 인덱스 생성
-- =====================================================

-- 사용자 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 활동 로그 인덱스
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_log_type ON activity_logs(log_type);

-- 금융 정보 인덱스
CREATE INDEX IF NOT EXISTS idx_ai_info_date ON ai_info(date);

-- 퀴즈 인덱스
CREATE INDEX IF NOT EXISTS idx_quiz_topic ON quiz(topic);

-- 사용자 진행률 인덱스
CREATE INDEX IF NOT EXISTS idx_user_progress_session_id ON user_progress(session_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_date ON user_progress(date);

-- 용어 인덱스
CREATE INDEX IF NOT EXISTS idx_term_term ON term(term);

-- =====================================================
-- 기본 데이터 삽입
-- =====================================================

-- 기본 관리자 계정 생성 (비밀번호: admin123)
INSERT INTO users (username, email, hashed_password, role) 
VALUES ('admin', 'admin@financemastery.com', '$2b$12$5YJM8ybBcJ7AYNrL8oZMYO7V3KvZhDGMVJz7ZqGQxl3zW9yE8KdKa', 'admin')
ON CONFLICT (username) DO NOTHING;

-- 테스트 사용자 계정 생성 (비밀번호: user123)
INSERT INTO users (username, email, hashed_password, role) 
VALUES ('user', 'user@financemastery.com', '$2b$12$3YJM8ybBcJ7AYNrL8oZMYO7V3KvZhDGMVJz7ZqGQxl3zW9yE8KdKb', 'user')
ON CONFLICT (username) DO NOTHING;

-- 기본 금융 퀴즈 데이터
INSERT INTO quiz (topic, question, option1, option2, option3, option4, correct, explanation) VALUES
('Finance', '주식의 배당수익률이 높다는 것은 무엇을 의미합니까?', '주가가 높다', '배당금이 주가 대비 높다', '회사 수익이 많다', '주식 거래량이 많다', 2, '배당수익률은 연간 배당금을 현재 주가로 나눈 비율로, 높을수록 투자금 대비 받는 배당이 많음을 의미합니다.'),
('Finance', 'P/E 비율이 낮은 주식은 일반적으로 어떤 특성을 가집니까?', '고성장 기대주', '저평가된 주식', '배당금이 높은 주식', '위험한 주식', 2, 'P/E(주가수익비율)이 낮다는 것은 주가가 수익 대비 상대적으로 저평가되어 있을 가능성을 의미합니다.'),
('Finance', '복리의 힘이 가장 잘 나타나는 조건은?', '높은 수익률', '긴 투자기간', '자주 투자', '큰 투자금액', 2, '복리는 시간이 지날수록 기하급수적으로 증가하므로, 긴 투자기간이 가장 중요한 요소입니다.'),
('Finance', '인플레이션이 발생하면 어떤 일이 일어납니까?', '돈의 가치가 오른다', '돈의 가치가 내린다', '금리가 내린다', '주가가 오른다', 2, '인플레이션은 물가상승을 의미하므로, 같은 돈으로 살 수 있는 물건이 줄어들어 돈의 가치가 하락합니다.'),
('Finance', '분산투자의 주요 목적은 무엇입니까?', '수익률 극대화', '거래비용 절약', '위험 분산', '세금 절약', 3, '분산투자는 여러 자산에 투자하여 특정 자산의 손실 위험을 줄이는 것이 주요 목적입니다.');

-- 기본 금융 용어
INSERT INTO term (term, description) VALUES
('주식', '회사의 소유권을 나타내는 증서로, 회사의 이익과 손실에 참여할 수 있는 권리를 가집니다.'),
('채권', '정부나 기업이 자금을 빌리기 위해 발행하는 증서로, 일정 기간 후 원금과 이자를 지급받을 수 있습니다.'),
('배당금', '주식회사가 주주들에게 이익의 일부를 현금으로 지급하는 것입니다.'),
('P/E 비율', '주가를 주당순이익으로 나눈 값으로, 주식의 가치 평가에 사용되는 지표입니다.'),
('ROE', '자기자본이익률로, 기업이 자기자본을 이용해 얼마나 효율적으로 이익을 창출했는지 나타내는 지표입니다.'),
('복리', '원금에 대한 이자뿐만 아니라 이자에 대한 이자까지 계산하는 방식입니다.'),
('인플레이션', '전반적인 물가 수준이 지속적으로 상승하는 현상을 말합니다.'),
('분산투자', '투자 위험을 줄이기 위해 여러 종류의 자산에 투자하는 전략입니다.'),
('포트폴리오', '투자자가 보유하고 있는 모든 투자자산의 조합을 의미합니다.'),
('변동성', '자산 가격의 변동 정도를 나타내는 지표로, 높을수록 위험이 큽니다.');

-- 샘플 금융 정보 (오늘 날짜)
INSERT INTO ai_info (date, info1_title, info1_content, info1_terms, info2_title, info2_content, info2_terms, info3_title, info3_content, info3_terms) 
VALUES (
    TO_CHAR(NOW(), 'YYYY-MM-DD'),
    '주식 투자의 기초',
    '주식 투자는 기업의 소유권을 구매하는 것입니다. 주가는 기업의 실적, 시장 상황, 투자자 심리 등에 따라 변동됩니다. 성공적인 주식 투자를 위해서는 기업 분석, 시장 동향 파악, 리스크 관리가 중요합니다.',
    '[{"term": "주식", "description": "회사의 소유권을 나타내는 증서"}, {"term": "P/E 비율", "description": "주가를 주당순이익으로 나눈 가치평가 지표"}, {"term": "변동성", "description": "자산 가격의 변동 정도를 나타내는 지표"}]',
    '채권 투자의 이해',
    '채권은 정부나 기업이 발행하는 부채 증서입니다. 주식보다 안전하지만 수익률은 상대적으로 낮습니다. 금리 변동에 민감하며, 만기까지 보유하면 원금과 이자를 받을 수 있습니다.',
    '[{"term": "채권", "description": "정부나 기업이 발행하는 부채 증서"}, {"term": "금리", "description": "돈을 빌려주거나 빌릴 때 적용되는 이자율"}, {"term": "만기", "description": "채권의 상환 기한"}]',
    '분산투자 전략',
    '분산투자는 투자 위험을 줄이는 핵심 전략입니다. 다양한 자산군, 지역, 산업에 투자하여 특정 투자의 손실을 다른 투자의 수익으로 상쇄할 수 있습니다. "계란을 한 바구니에 담지 마라"는 격언이 이를 잘 표현합니다.',
    '[{"term": "분산투자", "description": "여러 자산에 투자하여 위험을 분산하는 전략"}, {"term": "포트폴리오", "description": "투자자가 보유한 모든 투자자산의 조합"}, {"term": "자산배분", "description": "투자 목적에 따라 자산을 적절히 배분하는 것"}]'
)
ON CONFLICT DO NOTHING;

-- 기본 프롬프트 데이터
INSERT INTO prompt (title, content, category) VALUES
('금융 정보 생성', '오늘의 금융 학습 정보 3개를 생성해주세요. 각 정보는 제목, 내용(200자 내외), 관련 용어 3개(용어명과 설명 포함)를 포함해야 합니다. 초보자도 이해하기 쉽게 작성해주세요.', 'finance'),
('금융 퀴즈 생성', '금융 관련 객관식 퀴즈 5문제를 생성해주세요. 각 문제는 4개의 선택지와 정답, 해설을 포함해야 합니다. 난이도는 초급에서 중급 수준으로 해주세요.', 'quiz'),
('투자 전략 설명', '초보 투자자를 위한 기본적인 투자 전략을 설명해주세요. 주식, 채권, 펀드 등의 특징과 투자 시 주의사항을 포함해주세요.', 'investment');

-- =====================================================
-- RLS (Row Level Security) 정책 (선택사항)
-- =====================================================

-- 보안이 필요한 경우 아래 주석을 해제하여 사용
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE backup_history ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 완료 메시지
-- =====================================================

-- 설치 완료 확인을 위한 뷰 생성
CREATE OR REPLACE VIEW installation_check AS
SELECT 
    'Finance Mastery Hub 데이터베이스 설치 완료!' as message,
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM quiz) as total_quiz,
    (SELECT COUNT(*) FROM term) as total_terms,
    (SELECT COUNT(*) FROM ai_info) as total_finance_info,
    NOW() as installed_at;

-- 설치 상태 확인
SELECT * FROM installation_check; 