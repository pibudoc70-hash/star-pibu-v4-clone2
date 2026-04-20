import { Phone, MessageCircle, Calendar } from "lucide-react";
import { useLang } from "@/contexts/useLang";

const KAKAO_URL = "https://pf.kakao.com/_xkxnxmxj";
const NAVER_URL = "https://booking.naver.com/booking/13/bizes/1166145";
const PHONE = "051-818-2300";

export default function FloatingCTA() {
  const { t } = useLang();

  return (
    <div className="fixed bottom-6 right-4 z-40 flex flex-col gap-2.5">
      <a
        href={`tel:${PHONE}`}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1a2744] text-white shadow-lg hover:bg-[#243560] transition-all hover:scale-110"
        title={t.cta.call}
      >
        <Phone size={20} />
      </a>
      <a
        href={KAKAO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-12 h-12 rounded-full bg-[#FEE500] text-[#3A1D1D] shadow-lg hover:bg-[#FFD700] transition-all hover:scale-110"
        title={t.cta.kakao}
      >
        <MessageCircle size={20} />
      </a>
      <a
        href={NAVER_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-12 h-12 rounded-full bg-[#03C75A] text-white shadow-lg hover:bg-[#02b050] transition-all hover:scale-110"
        title={t.cta.naver}
      >
        <Calendar size={20} />
      </a>
    </div>
  );
}
