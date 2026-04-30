import React, { useState } from "react";
import {
  Award,
  GraduationCap,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  Phone,
  MessageCircle,
  Zap,
} from "lucide-react";

const DR_JO_IMAGE =
  "https://cdn.manus.space/starpibu-v4/doctors/jo-si-hyeong.jpg";
const DR_WOO_IMAGE =
  "https://cdn.manus.space/starpibu-v4/doctors/woo-hye-jin.jpg";
const DR_LEE_IMAGE =
  "https://cdn.manus.space/starpibu-v4/doctors/lee-gi-wook.jpg";

const DR_JO_IMAGE_DESKTOP_JPG =
  "https://cdn.manus.space/starpibu-v4/doctors/jo-si-hyeong-desktop.jpg";
const DR_WOO_IMAGE_DESKTOP_JPG =
  "https://cdn.manus.space/starpibu-v4/doctors/woo-hye-jin-desktop.jpg";
const DR_LEE_IMAGE_DESKTOP_JPG =
  "https://cdn.manus.space/starpibu-v4/doctors/lee-gi-wook-desktop.jpg";

const doctors = [
  {
    id: 0,
    name: "조시형 원장",
    nameEn: "Dr. JO SI-HYEONG",
    title: "피부과 전문의",
    image: DR_JO_IMAGE,
    cardImage: DR_JO_IMAGE_DESKTOP_JPG,
    cardImagePosition: "center 15%",
    badge: "원장",
    intro: `2006년 부산 서면에서 첫 진료를 시작한 이래, 어느덧 20년이 넘는 시간 동안 수많은 환자분들의 피부 고민을 마주해 왔습니다.
피부 치료는 단순히 장비를 사용하는 기술이 아니라, 환자의 피부 상태를 정확히 읽어내는 '안목'에서 시작됩니다. 무리한 시술보다는 가장 안전하고 자연스러운 결과를 지향합니다.
앞으로도 변함없이 정직하고 숙련된 진료로 여러분의 피부 건강을 지켜드리겠습니다.`,
    credentials: [
      { icon: Award, label: "자격", text: "피부과 전문의" },
      { icon: GraduationCap, label: "학력", text: "부산대학병원 피부과 수련" },
      { icon: GraduationCap, label: "학력", text: "인제대 피부과 교수역임" },
      { icon: GraduationCap, label: "학력", text: "인제대, 부산대 외래교수역임" },
      { icon: Award, label: "경력", text: "부산경남울산피부과의사회 회장 역임" },
      { icon: Award, label: "자문의", text: "써마지 FLX 자문의" },
      { icon: Stethoscope, label: "학회", text: "미국 피부과 학회 정회원(AAD)" },
      { icon: Stethoscope, label: "현직", text: "현) 스타피부과 원장" },
    ],
    specialties: ["눈밑지방재배치", "울쎄라 프라임", "써마지", "흉터치료"],
  },
  {
    id: 1,
    name: "우혜진 원장",
    nameEn: "Dr. WOO HYE-JIN",
    title: "피부과 전문의",
    image: DR_WOO_IMAGE,
    cardImage: DR_WOO_IMAGE_DESKTOP_JPG,
    cardImagePosition: "center 15%",
    badge: "원장",
    intro: `피부과 전문의로서 환자분들의 피부 건강을 최우선으로 생각합니다.
정확한 진단과 맞춤형 치료를 통해 최고의 결과를 제공하기 위해 노력하겠습니다.`,
    credentials: [
      { icon: Award, label: "자격", text: "피부과 전문의" },
      { icon: GraduationCap, label: "학력", text: "카톨릭의대 피부과 수련" },
      { icon: GraduationCap, label: "학력", text: "카톨릭의대 피부과 외래교수 역임" },
      { icon: Stethoscope, label: "학회", text: "대한 피부과 학회 정회원" },
      { icon: Stethoscope, label: "학회", text: "미국 피부과 학회 정회원(AAD)" },
      { icon: Award, label: "경력", text: "전) 고운세상 김양제 피부과원장" },
    ],
    specialties: ["여드름·흉터", "색소 치료", "피부 관리", "리프팅", "보톡스·필러", "피부질환", "울쎄라", "써마지"],
  },
  {
    id: 2,
    name: "이기욱 원장",
    nameEn: "Dr. LEE GI-WOOK",
    title: "피부과 전문의 · 의학박사",
    image: DR_LEE_IMAGE,
    cardImage: DR_LEE_IMAGE_DESKTOP_JPG,
    cardImagePosition: "center 15%",
    badge: "원장",
    intro: `의학박사로서 최신 피부과학 지식을 바탕으로 환자분들께 최고 수준의 의료 서비스를 제공합니다.
안전하고 효과적인 치료를 통해 여러분의 피부 건강을 지켜드리겠습니다.`,
    credentials: [
      { icon: Award, label: "자격", text: "피부과 전문의" },
      { icon: GraduationCap, label: "학력", text: "고신대학교 의과대학 의학박사" },
      { icon: GraduationCap, label: "학력", text: "고신대학교 의과대학 피부과 외래교수" },
      { icon: Stethoscope, label: "학회", text: "대한 피부과학회 정회원" },
      { icon: Stethoscope, label: "학회", text: "대한 피부과의사회 정회원" },
      { icon: Award, label: "경력", text: "전) 아름다운피부과 원장" },
    ],
    specialties: ["레이저 시술", "피부질환", "손발톱무좀", "흉터 치료", "색소 레이저", "피부 관리", "울쎄라", "써마지"],
  },
];

const preloadImages = () => {
  [DR_JO_IMAGE, DR_WOO_IMAGE, DR_LEE_IMAGE].forEach((src) => {
    const img = new Image();
    img.src = src;
  });
};

preloadImages();

export default function DoctorsSection() {
  const [expandedDoctorId, setExpandedDoctorId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedDoctorId(expandedDoctorId === id ? null : id);
  };

  return (
    <section id="doctors" className="py-16 bg-white">
      <div className="container max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-amber-600 tracking-wider mb-2">
            MEDICAL TEAM
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            피부과전문의의 3인
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="flex flex-col h-full">
              {/* Card Container */}
              <div className="bg-gradient-to-b from-amber-50 to-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow flex-1 flex flex-col">
                {/* Image Section */}
                <div className="relative w-full h-64 md:h-72 overflow-hidden bg-gray-200">
                  <img
                    src={
                      window.innerWidth >= 768
                        ? doctor.cardImage
                        : doctor.image
                    }
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: doctor.cardImagePosition,
                    }}
                  />
                  {doctor.badge && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {doctor.badge}
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{doctor.nameEn}</p>
                  <p className="text-sm font-semibold text-gray-700 mb-4">
                    {doctor.title}
                  </p>

                  {/* Specialties */}
                  <div className="mb-4 flex-1">
                    <div className="flex flex-wrap gap-2">
                      {doctor.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <button
                    onClick={() => toggleExpand(doctor.id)}
                    className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold rounded transition-colors flex items-center justify-center gap-2"
                  >
                    {expandedDoctorId === doctor.id ? (
                      <>
                        <ChevronUp size={16} />
                        접기
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        자세히 보기
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedDoctorId === doctor.id && (
                <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  {/* Intro */}
                  <div className="mb-6">
                    <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                      {doctor.intro}
                    </p>
                  </div>

                  {/* Credentials */}
                  <div className="space-y-3 mb-6">
                    {doctor.credentials.map((cred, idx) => {
                      const Icon = cred.icon;
                      return (
                        <div key={idx} className="flex gap-3">
                          <Icon size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-gray-600">
                              {cred.label}
                            </p>
                            <p className="text-sm text-gray-700">{cred.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Contact Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href="https://pf.kakao.com/_HNyGC"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-2 px-3 bg-yellow-400 hover:bg-yellow-500 text-gray-800 text-xs font-semibold rounded transition-colors"
                    >
                      <MessageCircle size={14} />
                      카카오 상담
                    </a>
                    <a
                      href="tel:051-818-2300"
                      className="flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors"
                    >
                      <Phone size={14} />
                      전화 상담
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
