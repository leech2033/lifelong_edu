# Firebase Hosting 배포

## 현재 설정

- Firebase 프로젝트 기본값: `lifelong-edu`
- Hosting 공개 디렉터리: `dist/public`
- SPA rewrite: 모든 경로를 `index.html`로 전달

## 배포 전 준비

1. Firebase CLI 설치
   - `npm.cmd install -g firebase-tools`
2. 로그인
   - `firebase login`
3. 내부 페이지 기본 비노출 유지
   - `.env` 또는 호스팅 환경에서 `VITE_ENABLE_INTERNAL_PAGES=false`

## 배포 명령

```powershell
npm.cmd install
npm.cmd run check
npm.cmd run report:institution-quality
npm.cmd run firebase:build
npm.cmd run firebase:deploy
```

## 브라우저 확인 경로

- `/`
- `/institutions?region=all&view=list`
- `/online`
- `/local`

## 참고

- 현재 설정은 `Firebase Hosting` 기준의 정적 배포다.
- `/dashboard`, `/internal/institution-quality`는 `VITE_ENABLE_INTERNAL_PAGES=true`일 때만 열린다.
