import { useLocation } from "wouter";
import { MessageCircle, Nfc, ShieldCheck } from "lucide-react";

function safeReturnTo(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/my-reservations";
}

export default function SocialLogin() {
  const [, navigate] = useLocation();
  const returnTo = safeReturnTo(new URLSearchParams(window.location.search).get("returnTo"));
  const beginLogin = (provider: "naver" | "kakao") => {
    window.location.assign(`/api/auth/${provider}/start?returnTo=${encodeURIComponent(returnTo)}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f7f9fc] px-4">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/60" aria-labelledby="social-login-title">
        <button type="button" onClick={() => navigate(returnTo)} className="mb-8 text-sm text-slate-500 hover:text-slate-800">← 돌아가기</button>
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#12395f] text-white"><ShieldCheck size={25} /></div>
          <h1 id="social-login-title" className="text-2xl font-bold text-slate-900">소셜 로그인으로 예약하기</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">별도 회원가입이나 비밀번호 없이 네이버 또는 카카오 계정으로 예약하고 내 예약을 관리할 수 있습니다.</p>
        </div>
        <div className="space-y-3">
          <button type="button" onClick={() => beginLogin("naver")} className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#03c75a] px-5 py-4 font-semibold text-white transition hover:bg-[#02b351]">
            <Nfc size={20} aria-hidden="true" /> 네이버로 계속하기
          </button>
          <button type="button" onClick={() => beginLogin("kakao")} className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#fee500] px-5 py-4 font-semibold text-[#191600] transition hover:bg-[#f5dd00]">
            <MessageCircle size={20} aria-hidden="true" /> 카카오로 계속하기
          </button>
        </div>
        <p className="mt-7 text-center text-xs leading-5 text-slate-500">로그인 시 개인정보처리방침 및 소셜 계정 제공 정보 처리에 동의한 것으로 간주됩니다. 예약을 위해 별도 연락처를 입력받을 수 있습니다.</p>
      </section>
    </main>
  );
}
