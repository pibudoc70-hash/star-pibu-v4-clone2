/**
 * Login Page - STAR 피부과
 * 카카오·네이버·구글 소셜 로그인 지원 (Manus OAuth)
 */
import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

// 소셜 로그인 타입별 파라미터
const SOCIAL_PROVIDERS = [
  {
    id: "kakao",
    label: "카카오로 시작하기",
    labelEn: "Continue with Kakao",
    bg: "#FEE500",
    color: "#1F2937",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="#1F2937">
        <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.6 5.1 4 6.6l-1 3.7 4.3-2.8c.9.2 1.8.3 2.7.3 5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
      </svg>
    ),
    type: "kakao",
  },
  {
    id: "naver",
    label: "네이버로 시작하기",
    labelEn: "Continue with Naver",
    bg: "#03C75A",
    color: "#ffffff",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="#ffffff">
        <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
      </svg>
    ),
    type: "naver",
  },
  {
    id: "google",
    label: "Google로 시작하기",
    labelEn: "Continue with Google",
    bg: "#ffffff",
    color: "#1F2937",
    border: "1px solid #E5E7EB",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    ),
    type: "google",
  },
];

export default function Login() {
  const { isAuthenticated, loading } = useAuth();

  // 이미 로그인된 경우 홈으로 이동
  useEffect(() => {
    if (!loading && isAuthenticated) {
      window.location.href = "/";
    }
  }, [isAuthenticated, loading]);

  const handleSocialLogin = (providerType: string) => {
    // Manus OAuth는 단일 엔드포인트로 여러 소셜 로그인 지원
    // type 파라미터로 소셜 제공자 선택
    const baseUrl = getLoginUrl();
    const url = new URL(baseUrl);
    url.searchParams.set("loginMethod", providerType);
    window.location.href = url.toString();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #EEF7F7 0%, #E8F0FA 50%, #F0EEF7 100%)" }}
    >
      {/* 배경 장식 */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #4A9FA5 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #4A6FA5 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative w-full max-w-md mx-4">
        {/* 카드 */}
        <div
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)" }}
        >
          {/* 헤더 */}
          <div
            className="px-8 pt-10 pb-8 text-center"
            style={{ background: "linear-gradient(160deg, #0D2B4E 0%, #1A4A7A 100%)" }}
          >
            <div className="flex justify-center mb-4">
              <div
                style={{
                  padding: "3px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #F5D78E 0%, #C9A84C 50%, #E8C96A 100%)",
                  boxShadow: "0 0 20px rgba(201,168,76,0.4)",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(160deg, #ffffff 0%, #faf8f3 100%)",
                    borderRadius: "11px",
                    padding: "10px 20px",
                    minHeight: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 800,
                      fontSize: "1.25rem",
                      letterSpacing: "0.15em",
                      background: "linear-gradient(135deg, #0D2B4E 0%, #1A4A7A 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    STAR DERMATOLOGY
                  </span>
                </div>
              </div>
            </div>
            <h1 className="text-white text-2xl font-bold tracking-tight">
              스타피부과 회원
            </h1>
            <p className="text-white/70 text-sm mt-1">
              로그인하고 다양한 혜택을 누리세요
            </p>
          </div>

          {/* 소셜 로그인 버튼 */}
          <div className="px-8 py-8 space-y-3">
            <p className="text-center text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest mb-5">
              소셜 계정으로 간편 로그인
            </p>

            {SOCIAL_PROVIDERS.map((provider) => (
              <button type="button"
                key={provider.id}
                onClick={() => handleSocialLogin(provider.type)}
                className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  background: provider.bg,
                  color: provider.color,
                  border: provider.border ?? "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <span className="flex-shrink-0">{provider.icon}</span>
                <span className="flex-1 text-center">{provider.label}</span>
              </button>
            ))}

            <div className="pt-4 border-t border-[#F3F4F6]">
              <p className="text-center text-xs text-[#9CA3AF] leading-relaxed">
                로그인 시{" "}
                <a href="#" className="underline hover:text-[#4A6FA5]">이용약관</a>
                {" "}및{" "}
                <a href="#" className="underline hover:text-[#4A6FA5]">개인정보처리방침</a>
                에 동의하게 됩니다.
              </p>
            </div>
          </div>

          {/* 하단 */}
          <div
            className="px-8 py-4 text-center"
            style={{ background: "#F9FAFB", borderTop: "1px solid #F3F4F6" }}
          >
            <button type="button"
              onClick={() => window.history.back()}
              className="text-xs text-[#9CA3AF] hover:text-[#4A6FA5] transition-colors"
            >
              ← 홈으로 돌아가기
            </button>
          </div>
        </div>

        {/* 하단 안내 */}
        <p className="text-center text-xs text-[#9CA3AF] mt-4">
          STAR 피부과 | 부산 서면 아이온시티 4층
        </p>
      </div>
    </div>
  );
}
