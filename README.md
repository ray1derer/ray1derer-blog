# AI Auto Blog System

AI 기반 자동 블로그 관리 시스템 - 올인원 블로깅 플랫폼

## 🌐 프로젝트 접속 정보

### AWS EC2 서버 상세 정보
- **퍼블릭 IP**: 13.124.18.14
- **메인 URL**: http://13.124.18.14/
- **전체 기능 페이지**: http://13.124.18.14/full-featured-blog.html
- **인스턴스 ID**: i-0f10b3dc904f98138
- **인스턴스 이름**: artisan-code-lab
- **리전**: ap-northeast-2 (아시아 태평양 - 서울)
- **가용 영역**: ap-northeast-2a
- **인스턴스 타입**: t2.micro (1 vCPU, 1GB RAM)
- **운영체제**: Amazon Linux 2
- **웹서버**: Nginx
- **보안 그룹**: sg-05a5315ca83731665
  - 인바운드: SSH (22), HTTP (80)
  - 아웃바운드: 모든 트래픽 허용

### GitHub 정보
- **레포지토리 이름**: ray1derer-blog
- **레포지토리 URL**: https://github.com/ray1derer/ray1derer-blog
- **GitHub Pages**: https://ray1derer.github.io/ray1derer-blog/
- **기본 브랜치**: main
- **사용자명**: ray1derer

## 🚀 주요 기능

### 1. 대시보드
- 실시간 통계 (조회수, 구독자, 참여율)
- 인기 게시글 순위
- 최근 활동 내역
- 카테고리별 분석

### 2. AI 글쓰기 도구
- **AI 인사이트**: 트렌드 분석 및 주제 추천
- **스마트 글쓰기**: AI 지원 콘텐츠 작성
- **AI 템플릿**: 다양한 글쓰기 템플릿
- **톤 매니저**: 글의 톤과 스타일 조정

### 3. 연구 및 분석 도구
- **스마트 리서치**: 주제별 심층 연구
- **팩트 체크**: 사실 검증 시스템
- **SEO 최적화**: 검색엔진 최적화 분석
- **가독성 분석**: 텍스트 가독성 평가

### 4. 콘텐츠 최적화
- **제목 A/B 테스트**: 제목 성과 비교
- **썸네일 생성기**: AI 기반 이미지 생성
- **해시태그 AI**: 플랫폼별 해시태그 추천

### 5. 콘텐츠 변환 도구
- **포맷 변환**: 다양한 형식으로 변환
- **SNS 카드**: 소셜미디어용 카드 생성
- **전자책 변환**: EPUB, PDF, MOBI 형식 지원
- **팟캐스트 변환**: 텍스트를 오디오로 변환

### 6. 창의적 도구
- **음성 메모**: 음성 기록 및 텍스트 변환
- **AI 브레인스토밍**: 아이디어 생성 도우미
- **아이디어 보드**: 아이디어 관리 시스템

### 7. 관리 기능
- **글 목록**: 전체 콘텐츠 관리
- **카테고리 관리**: 분류 체계 설정
- **통계 분석**: 상세 분석 리포트

## 🛠 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **UI Framework**: Tailwind CSS
- **Icons**: Font Awesome
- **Data Storage**: LocalStorage (클라이언트 사이드)
- **Server**: AWS EC2 + Nginx
- **Version Control**: Git + GitHub

## 📁 프로젝트 구조

```
ray1derer-blog/
├── index.html                 # 메인 페이지
├── full-featured-blog.html    # 전체 기능 통합 페이지
├── assets/                    # 정적 자원
│   ├── css/                   # 스타일시트
│   │   └── main.css
│   ├── sidebar-autoblog.html  # 자동블로그 사이드바
│   └── sidebar-new.html       # 새 사이드바
├── css/                       # 추가 CSS
│   └── styles.css
├── js/                        # JavaScript 파일
│   └── dashboard.js           # 대시보드 관리
└── README.md                  # 프로젝트 문서
```

## 🔧 로컬 개발 환경 설정

```bash
# 레포지토리 클론
git clone https://github.com/ray1derer/ray1derer-blog.git

# 디렉토리 이동
cd ray1derer-blog

# 로컬 서버 실행 (Python 3)
python -m http.server 8000

# 브라우저에서 접속
# http://localhost:8000/full-featured-blog.html
```

## 🚀 배포 방법

### AWS EC2 배포
```bash
# 파일 업로드
scp full-featured-blog.html ec2-user@13.124.18.14:/tmp/

# EC2 접속
ssh ec2-user@13.124.18.14

# Nginx 디렉토리로 복사
sudo cp /tmp/full-featured-blog.html /usr/share/nginx/html/
sudo chown nginx:nginx /usr/share/nginx/html/full-featured-blog.html
```

### GitHub Pages 배포
```bash
# 변경사항 커밋
git add .
git commit -m "Update blog features"

# GitHub에 푸시
git push origin main
```

## 📊 현재 상태

- ✅ 모든 메뉴 기능 구현 완료
- ✅ AWS EC2 서버 정상 작동
- ✅ GitHub Pages 백업 사이트 활성화
- ✅ 실시간 데이터 업데이트 시스템
- ✅ 로컬스토리지 기반 데이터 저장

## 🔗 빠른 접속 링크

### 라이브 서버
- **AWS EC2 메인**: http://13.124.18.14/
- **전체 기능 대시보드**: http://13.124.18.14/full-featured-blog.html
- **GitHub Pages (백업)**: https://ray1derer.github.io/ray1derer-blog/

### SSH 접속
```bash
# EC2 서버 SSH 접속
ssh ec2-user@13.124.18.14
```

## 🔐 보안 정보

- AWS 계정 ID와 액세스 키는 별도 관리
- EC2 보안 그룹: SSH(22), HTTP(80) 포트만 개방
- HTTPS 설정 권장 (향후 구현)

## 📝 향후 계획

1. 백엔드 API 서버 구축
2. 데이터베이스 연동 (MongoDB/PostgreSQL)
3. 사용자 인증 시스템
4. 실제 AI API 연동 (OpenAI, Claude API)
5. 파일 업로드 및 미디어 관리
6. 다중 사용자 지원

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

- GitHub: [@ray1derer](https://github.com/ray1derer)
- Repository: [ray1derer-blog](https://github.com/ray1derer/ray1derer-blog)

---

*Last updated: 2025-01-04*