/**
 * Privacy Policy Page - 개인정보처리방침
 * 의료기관 개인정보처리방침 (개인정보 보호법 제30조 준수)
 */

import { Link } from "wouter";
import { ArrowLeft, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

const SECTIONS = [
  {
    title: "제1조 (개인정보의 처리 목적)",
    content: `스타피부과의원(이하 '병원')은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.

1. 진료 예약 및 접수: 환자 본인 확인, 진료 예약 관리, 진료 결과 안내
2. 의료 서비스 제공: 진료, 처방, 의료 기록 관리
3. 고객 상담 및 민원 처리: 문의 사항 처리, 불만 처리, 공지 사항 전달
4. 홈페이지 회원 관리: 회원 가입 의사 확인, 회원 자격 유지·관리, 서비스 부정 이용 방지`,
  },
  {
    title: "제2조 (개인정보의 처리 및 보유 기간)",
    content: `병원은 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용 기간 내에서 개인정보를 처리·보유합니다.

1. 진료 기록: 의료법 제22조에 따라 최종 진료일로부터 10년
2. 처방전: 의료법 제22조에 따라 발급일로부터 5년
3. 예약 정보: 예약 완료 후 1년
4. 회원 정보: 회원 탈퇴 시까지 (단, 관계 법령에 따라 일정 기간 보관)
5. 상담 기록: 상담 종료 후 3년`,
  },
  {
    title: "제3조 (처리하는 개인정보의 항목)",
    content: `병원은 다음의 개인정보 항목을 처리하고 있습니다.

1. 필수 항목
   - 진료 예약: 성명, 생년월일, 성별, 연락처(전화번호)
   - 회원 가입: 아이디, 비밀번호, 성명, 이메일 주소, 연락처
   - 의료 서비스: 진료 기록, 처방 내역, 건강 정보

2. 선택 항목
   - 이메일 수신 동의 여부
   - 마케팅 정보 수신 동의 여부

3. 자동 수집 항목
   - 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보`,
  },
  {
    title: "제4조 (개인정보의 제3자 제공)",
    content: `병원은 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.

현재 병원은 정보주체의 개인정보를 제3자에게 제공하고 있지 않습니다. 단, 다음의 경우에는 예외로 합니다.

1. 정보주체가 사전에 동의한 경우
2. 법률에 특별한 규정이 있거나 법령상 의무를 준수하기 위하여 불가피한 경우
3. 공공기관이 법령 등에서 정하는 소관 업무의 수행을 위하여 불가피한 경우`,
  },
  {
    title: "제5조 (개인정보 처리의 위탁)",
    content: `병원은 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.

| 수탁자 | 위탁 업무 내용 |
|--------|---------------|
| 의료정보시스템 운영사 | 전자의무기록(EMR) 시스템 운영 및 유지보수 |
| 문자 발송 서비스 | 예약 확인 및 진료 안내 문자 발송 |

병원은 위탁계약 체결 시 개인정보 보호법 제26조에 따라 위탁업무 수행 목적 외 개인정보 처리 금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.`,
  },
  {
    title: "제6조 (정보주체의 권리·의무 및 행사 방법)",
    content: `정보주체는 병원에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.

1. 개인정보 열람 요구
2. 오류 등이 있을 경우 정정 요구
3. 삭제 요구
4. 처리 정지 요구

위 권리 행사는 병원에 대해 서면, 전화, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며, 병원은 이에 대해 지체 없이 조치하겠습니다.

정보주체가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한 경우에는 병원은 정정 또는 삭제를 완료할 때까지 당해 개인정보를 이용하거나 제공하지 않습니다.`,
  },
  {
    title: "제7조 (개인정보의 파기)",
    content: `병원은 개인정보 보유 기간의 경과, 처리 목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.

정보주체로부터 동의받은 개인정보 보유 기간이 경과하거나 처리 목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관 장소를 달리하여 보존합니다.

파기 방법:
- 전자적 파일 형태의 정보: 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제
- 종이에 출력된 개인정보: 분쇄기로 분쇄하거나 소각`,
  },
  {
    title: "제8조 (개인정보의 안전성 확보 조치)",
    content: `병원은 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.

1. 관리적 조치: 내부 관리 계획 수립·시행, 정기적 직원 교육
2. 기술적 조치: 개인정보 처리 시스템 등의 접근 권한 관리, 접근 통제 시스템 설치, 고유 식별 정보 등의 암호화, 보안 프로그램 설치
3. 물리적 조치: 전산실, 자료 보관실 등의 접근 통제`,
  },
  {
    title: "제9조 (개인정보 보호 책임자)",
    content: `병원은 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만 처리 및 피해 구제 등을 위하여 아래와 같이 개인정보 보호 책임자를 지정하고 있습니다.

개인정보 보호 책임자
- 성명: 조시형
- 직책: 대표원장
- 연락처: 051-818-2300
- 이메일: starpibu@naver.com

정보주체께서는 병원의 서비스(또는 사업)을 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만 처리, 피해 구제 등에 관한 사항을 개인정보 보호 책임자 및 담당 부서로 문의하실 수 있습니다. 병원은 정보주체의 문의에 대해 지체 없이 답변 및 처리해 드릴 것입니다.`,
  },
  {
    title: "제10조 (개인정보 처리방침의 변경)",
    content: `이 개인정보 처리방침은 2024년 1월 1일부터 적용됩니다.

이전의 개인정보 처리방침은 아래에서 확인하실 수 있습니다.
- 2023년 1월 1일 ~ 2023년 12월 31일 적용 (문의: 051-818-2300)

개인정보 처리방침이 변경될 경우 홈페이지 공지사항을 통해 사전 공지합니다.`,
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      <SeoHead
        title="개인정보처리방침 | 부산 서면 스타피부과"
        description="스타피부과의원 개인정보처리방침입니다. 개인정보 보호법 제30조에 따라 개인정보의 처리 목적, 항목, 보유 기간 등을 안내합니다."
        canonical="https://www.star-pibu.com/privacy"
        noindex={true}
      />
      <Header />

      <main className="pt-24 pb-20">
        <div className="container max-w-4xl mx-auto px-4">
          {/* 뒤로가기 */}
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors hover:opacity-70" style={{ color: "#4A6FA5" }}>
            <ArrowLeft size={16} />
            홈으로 돌아가기
          </Link>

          {/* 헤더 */}
          <div className="mb-10 pb-8 border-b" style={{ borderColor: "#E5E7EB" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#EEF7F7" }}>
                <Shield size={20} style={{ color: "#4A6FA5" }} />
              </div>
              <h1 className="text-2xl font-bold" style={{ color: "#1F2937" }}>
                개인정보처리방침
              </h1>
            </div>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              스타피부과의원(이하 '병원')은 개인정보 보호법 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
            </p>
            <p className="text-xs mt-3 font-semibold" style={{ color: "#81C7C9" }}>
              시행일: 2024년 1월 1일
            </p>
          </div>

          {/* 목차 */}
          <nav className="mb-10 p-5 rounded-xl" style={{ background: "white", border: "1px solid #E5E7EB" }}>
            <p className="text-sm font-bold mb-3" style={{ color: "#1F2937" }}>목차</p>
            <ol className="space-y-1.5">
              {SECTIONS.map((s, i) => (
                <li key={i}>
                  <a
                    href={`#section-${i + 1}`}
                    className="text-sm transition-colors hover:underline"
                    style={{ color: "#4A6FA5" }}
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* 본문 */}
          <div className="space-y-10">
            {SECTIONS.map((s, i) => (
              <section key={i} id={`section-${i + 1}`}>
                <h2
                  className="text-base font-bold mb-4 pb-2 border-b"
                  style={{ color: "#1F2937", borderColor: "#E5E7EB" }}
                >
                  {s.title}
                </h2>
                <div
                  className="text-sm leading-relaxed whitespace-pre-line"
                  style={{ color: "#4B5563" }}
                >
                  {s.content}
                </div>
              </section>
            ))}
          </div>

          {/* 문의 안내 */}
          <div className="mt-12 p-6 rounded-xl" style={{ background: "#EEF7F7", border: "1px solid #81C7C933" }}>
            <p className="text-sm font-bold mb-2" style={{ color: "#1F2937" }}>개인정보 관련 문의</p>
            <p className="text-sm" style={{ color: "#4B5563" }}>
              개인정보 처리방침에 관한 문의사항은 아래 연락처로 문의해 주시기 바랍니다.
            </p>
            <div className="mt-3 flex flex-col sm:flex-row gap-2 text-sm" style={{ color: "#4A6FA5" }}>
              <span className="font-semibold">전화: 051-818-2300</span>
              <span className="hidden sm:inline" style={{ color: "#D1D5DB" }}>|</span>
              <span className="font-semibold">이메일: starpibu@naver.com</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
