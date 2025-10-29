# 빅스페이먼츠 과제 프로젝트

## 주요 기능

- **사용자 인증**

  - 회원가입, 로그인, 로그아웃
  - JWT 기반 토큰 인증 (Access Token, Refresh Token)
  - 자동 토큰 갱신 메커니즘
  - 쿠키 기반 보안 인증

- **게시판 관리**

  - 게시글 작성, 수정, 삭제, 조회
  - 게시글 목록 조회 및 페이지네이션
  - 게시글 상세 보기
  - 카테고리별 분류
  - 이미지 파일 업로드 (FormData)

- **사용자 경험**
  - 반응형 디자인 (모바일/태블릿/데스크톱)
  - Toast 알림 시스템
  - 로딩 상태 관리
  - 폼 검증 및 에러 처리
  - 접근성(접근성) 고려 설계

## 기술 스택

### 핵심 기술

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4

### 주요 라이브러리

- **Form Management**: React Hook Form 7.65, Zod 4.1
- **Authentication**: JWT (JSON Web Token)
- **HTTP Client**: Fetch API (네이티브)
- **Fonts**: Geist Sans, Geist Mono (Next.js Font Optimization)

## 프로젝트 구조

```
bigspayments-assignment/
├── app/                          # Next.js App Router
│   ├── api/                      # API 라우트 (서버 사이드)
│   │   ├── auth/                 # 인증 API
│   │   │   ├── signup/           # 회원가입
│   │   │   ├── signin/           # 로그인
│   │   │   ├── logout/           # 로그아웃
│   │   │   ├── refresh/          # 토큰 갱신
│   │   │   └── me/               # 사용자 정보 조회
│   │   └── boards/               # 게시판 API
│   │       ├── route.ts          # 게시글 목록, 작성
│   │       ├── [id]/route.ts     # 게시글 상세, 수정, 삭제
│   │       └── categories/       # 카테고리 목록
│   ├── boards/                   # 게시판 페이지
│   │   └── [id]/page.tsx         # 게시글 상세 페이지
│   ├── signin/                   # 로그인 페이지
│   ├── signup/                   # 회원가입 페이지
│   ├── write-post/               # 게시글 작성 페이지
│   ├── layout.tsx                # 루트 레이아웃
│   ├── page.tsx                  # 홈 페이지
│   └── globals.css               # 전역 스타일
├── components/                    # React 컴포넌트
│   ├── auth/                     # 인증 관련 컴포넌트
│   │   ├── SignInForm.tsx        # 로그인 폼
│   │   ├── SignupForm.tsx        # 회원가입 폼
│   │   ├── FormHeader.tsx        # 폼 헤더
│   │   └── FormFooter.tsx        # 폼 푸터
│   ├── layout/                   # 레이아웃 컴포넌트
│   │   ├── Header.tsx            # 헤더 네비게이션
│   │   └── AuthLayout.tsx        # 인증 페이지 레이아웃
│   ├── pages/                    # 페이지별 컴포넌트
│   │   ├── HomeClient.tsx        # 홈 페이지 클라이언트
│   │   ├── BoardList.tsx         # 게시글 목록
│   │   ├── BoardDetailClient.tsx # 게시글 상세 페이지
│   │   ├── BoardViewMode.tsx     # 게시글 보기 모드
│   │   ├── BoardEditMode.tsx     # 게시글 수정 모드
│   │   └── WritePostClient.tsx   # 게시글 작성 페이지
│   └── ui/                       # 재사용 가능한 UI 컴포넌트
│       ├── Button.tsx            # 버튼
│       ├── Input.tsx              # 입력 필드
│       ├── Textarea.tsx           # 텍스트 영역
│       ├── Select.tsx             # 선택 드롭다운
│       ├── FileUpload.tsx         # 파일 업로드
│       ├── Pagination.tsx         # 페이지네이션
│       ├── Toast.tsx              # 토스트 알림
│       ├── ToastProvider.tsx     # 토스트 컨텍스트
│       ├── ConfirmModal.tsx      # 확인 모달
│       └── Alert.tsx              # 알림 컴포넌트
├── hooks/                         # 커스텀 훅
│   ├── useBoards.ts              # 게시글 목록 조회 훅
│   ├── useCategories.ts          # 카테고리 조회 훅
│   └── useUserInfo.ts            # 사용자 정보 조회 훅
├── lib/                           # 유틸리티 및 타입
│   ├── types/                     # TypeScript 타입 정의
│   │   └── board.ts              # 게시글 타입
│   └── utils/                     # 유틸리티 함수
│       ├── api-client.ts          # 서버 사이드 API 클라이언트
│       ├── client-fetch.ts       # 클라이언트 사이드 fetch (토큰 갱신)
│       ├── auth.ts                # 인증 관련 유틸리티
│       └── cookies.ts             # 쿠키 관리 유틸리티
├── middleware.ts                  # Next.js 미들웨어 (인증 체크)
├── next.config.ts                # Next.js 설정
├── tailwind.config.ts            # Tailwind CSS 설정
├── tsconfig.json                 # TypeScript 설정
└── package.json                  # 프로젝트 의존성
```

## 시작하기

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

## API 엔드포인트

### 인증 API (`/api/auth`)

| 메서드 | 엔드포인트          | 설명             |
| ------ | ------------------- | ---------------- |
| POST   | `/api/auth/signup`  | 회원가입         |
| POST   | `/api/auth/signin`  | 로그인           |
| POST   | `/api/auth/logout`  | 로그아웃         |
| POST   | `/api/auth/refresh` | 토큰 갱신        |
| GET    | `/api/auth/me`      | 사용자 정보 조회 |

### 게시판 API (`/api/boards`)

| 메서드 | 엔드포인트               | 설명                                 |
| ------ | ------------------------ | ------------------------------------ |
| GET    | `/api/boards`            | 게시글 목록 조회 (페이지네이션 지원) |
| POST   | `/api/boards`            | 게시글 작성 (파일 업로드 포함)       |
| GET    | `/api/boards/[id]`       | 게시글 상세 조회                     |
| PATCH  | `/api/boards/[id]`       | 게시글 수정                          |
| DELETE | `/api/boards/[id]`       | 게시글 삭제                          |
| GET    | `/api/boards/categories` | 카테고리 목록 조회                   |

## 주요 특징 및 구현 세부사항

### 🔐 인증 시스템

- **JWT 토큰 기반 인증**

  - Access Token: 24시간 유효
  - Refresh Token: 7일 유효
  - HttpOnly 쿠키에 저장하여 XSS 공격 방지

- **자동 토큰 갱신 메커니즘**
  - 클라이언트 사이드: `fetchWithTokenRefresh` 함수가 401 응답 시 자동으로 토큰 갱신 후 재요청
  - 서버 사이드: Next.js 미들웨어에서 토큰 만료 감지 시 자동 갱신 시도
  - 사용자 경험에 영향을 주지 않는 자동 갱신

### 📱 반응형 디자인

- 모바일, 태블릿, 데스크톱 모든 화면 크기 지원
- Tailwind CSS의 반응형 클래스 활용 (`sm:`, `lg:` 등)
- 터치 친화적인 UI 요소 크기 조정

### 🎨 사용자 경험 (UX)

- **Toast 알림 시스템**

  - Context API 기반 전역 상태 관리
  - 성공/에러 타입별 스타일링
  - 자동 사라짐 기능

- **로딩 상태 관리**

  - 각 페이지별 로딩 인디케이터
  - 폼 제출 시 버튼 비활성화 및 로딩 표시

- **폼 검증**
  - React Hook Form으로 폼 상태 관리
  - Zod 스키마를 통한 타입 안전한 검증
  - 실시간 에러 메시지 표시

### 🔒 보안 기능

- **미들웨어 기반 라우트 보호**

  - 인증이 필요한 페이지 자동 리다이렉트
  - 이미 로그인한 사용자의 인증 페이지 접근 차단

- **토큰 검증**
  - 서버 사이드에서 JWT 토큰 유효성 검사
  - 만료된 토큰 자동 감지 및 갱신

### 📦 상태 관리

- **커스텀 훅 패턴**

  - `useBoards`: 게시글 목록 및 페이지네이션 관리
  - `useCategories`: 카테고리 목록 캐싱
  - `useUserInfo`: 사용자 정보 관리

- **서버 상태 관리**
  - 서버 컴포넌트와 클라이언트 컴포넌트 분리
  - API 라우트를 통한 서버 사이드 프록시

### 🎯 접근성 (Accessibility)

- 시맨틱 HTML 태그 사용 (`<main>`, `<header>`, `<nav>` 등)
- 스크린 리더를 위한 `aria-label` 속성
- 키보드 네비게이션 지원
- 포커스 관리 및 시각적 피드백

## 환경 변수

| 변수명                | 설명              | 기본값                             |
| --------------------- | ----------------- | ---------------------------------- |
| `NEXT_PUBLIC_API_URL` | 외부 API 서버 URL | `https://front-mission.bigs.or.kr` |

환경 변수는 `.env.local` 파일에 정의되어 있습니다. `.
