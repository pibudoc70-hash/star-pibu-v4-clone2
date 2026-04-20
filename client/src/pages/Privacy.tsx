import MainLayout from "@/components/MainLayout";

export default function Privacy() {
  return (
    <MainLayout>
      <div className="pt-24 pb-16 min-h-screen bg-[var(--star-bg-section)]">
        <div className="container max-w-3xl">
          <div className="mb-10">
            <p className="section-label mb-2">PRIVACY POLICY</p>
            <h1 className="text-3xl font-black text-[#1a2744]">개인정보처리방침</h1>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6 text-sm text-gray-600 leading-relaxed">
            <section>
              <h2 className="font-black text-[#1a2744] text-base mb-2">제1조 (개인정보의 처리 목적)</h2>
              <p>스타피부과(이하 "병원")는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>진료 예약 및 상담 서비스 제공</li>
                <li>환자 본인 확인 및 진료 기록 관리</li>
                <li>이벤트 및 공지사항 안내</li>
              </ul>
            </section>
            <section>
              <h2 className="font-black text-[#1a2744] text-base mb-2">제2조 (개인정보의 처리 및 보유 기간)</h2>
              <p>병원은 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
            </section>
            <section>
              <h2 className="font-black text-[#1a2744] text-base mb-2">제3조 (개인정보의 제3자 제공)</h2>
              <p>병원은 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>
            </section>
            <section>
              <h2 className="font-black text-[#1a2744] text-base mb-2">제4조 (개인정보 보호책임자)</h2>
              <p>병원은 개인정보 처리에 관한 업무를 총괄해서 책임지고, 정보주체의 개인정보 관련 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
              <div className="mt-2 p-3 bg-[var(--star-bg-section)] rounded-lg">
                <p>개인정보 보호책임자: 조시형 원장</p>
                <p>연락처: 051-818-2300</p>
              </div>
            </section>
            <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">시행일: 2024년 1월 1일</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
