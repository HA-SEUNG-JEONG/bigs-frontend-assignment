# 빅스페이먼츠 과제 프로젝트

## 주요 기능

- **사용자 인증**: 회원가입, 로그인, 로그아웃
- **게시판 관리**: 게시글 작성, 수정, 조회, 목록 조회
- **카테고리 관리**: 게시글 카테고리 분류
- **파일 업로드**: 게시글에 이미지 첨부
- **토큰 관리**: JWT 기반 인증 및 자동 토큰 갱신

## 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Form Management**: React Hook Form, Zod
- **Authentication**: JWT (JSON Web Token)
- **HTTP Client**: Fetch API

## 실행 가이드

### 1. 프로젝트 클론 및 의존성 설치

```bash
# 프로젝트 클론
git clone <repository-url>
cd bigspayments-assignment

# 의존성 설치
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://front-mission.bigs.or.kr
```

> **참고**: 기본 API URL은 `https://front-mission.bigs.or.kr`로 설정되어 있습니다. 다른 서버를 사용하는 경우 해당 URL로 변경하세요.

### 3. 개발 서버 실행

```bash
npm run dev
```

개발 서버가 실행되면 [http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다.

### 4. 프로덕션 빌드 및 실행

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

### 5. 코드 린팅

```bash
npm run lint
```

## 프로젝트 구조

```
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   │   ├── auth/          # 인증 관련 API
│   │   └── boards/        # 게시판 관련 API
│   ├── boards/            # 게시판 페이지
│   ├── signin/            # 로그인 페이지
│   ├── signup/            # 회원가입 페이지
│   └── write-post/        # 게시글 작성 페이지
├── components/            # React 컴포넌트
│   ├── auth/              # 인증 관련 컴포넌트
│   ├── layout/            # 레이아웃 컴포넌트
│   ├── pages/             # 페이지별 컴포넌트
│   └── ui/                # 재사용 가능한 UI 컴포넌트
├── hooks/                 # 커스텀 훅
├── lib/                   # 유틸리티 및 타입 정의
└── middleware.ts          # Next.js 미들웨어
```

## API 엔드포인트

### 인증

- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/signin` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 사용자 정보 조회

### 게시판

- `GET /api/boards` - 게시글 목록 조회
- `POST /api/boards` - 게시글 작성
- `GET /api/boards/[id]` - 게시글 상세 조회
- `PATCH /api/boards/[id]` - 게시글 수정
- `GET /api/boards/categories` - 카테고리 목록 조회

## 주요 특징

- **자동 토큰 갱신**: JWT 토큰이 만료되면 자동으로 갱신
- **쿠키 기반 인증**: 보안을 위한 HttpOnly 쿠키 사용
- **반응형 디자인**: 모바일과 데스크톱 모두 지원
- **타입 안전성**: TypeScript로 타입 안전성 보장
- **폼 검증**: Zod를 사용한 클라이언트/서버 사이드 검증

### 폴더 구조 가이드

- `app/`: Next.js App Router 기반 페이지 및 API 라우트
- `components/`: 재사용 가능한 React 컴포넌트
- `hooks/`: 커스텀 훅
- `lib/`: 유틸리티 함수 및 타입 정의

### 환경 변수

- `NEXT_PUBLIC_API_URL`: 외부 API 서버 URL
- 모든 환경 변수는 `.env.local` 파일에 정의
