/**
 * doctors-data.ts — 의료진 정적 데이터
 *
 * [R12-P1-2] DoctorsSection.tsx에서 데이터 레이어 분리
 * - 이미지 URL, Doctor 타입, doctors 배열을 별도 파일로 관리
 * - DoctorsSection은 표현(렌더링)만 담당
 */
import React from "react";
import { Award, GraduationCap, Stethoscope, Zap } from "lucide-react";

// ── CDN 기반 이미지 URL ──────────────────────────────────────────────────────
const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e";

export const DR_JO_IMAGE_DESKTOP_JPG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/01_5e3176cb.png";
export const DR_JO_IMAGE_MOBILE_WEBP = `${CDN}/dr_jo_profile-mobile_ee5a7e09.webp`;

export const DR_WOO_IMAGE_DESKTOP_JPG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/0211_8cfcf452.png";
export const DR_WOO_IMAGE_MOBILE_WEBP = `${CDN}/sub_01_02_img2-mobile_ceacc144.webp`;

export const DR_LEE_IMAGE_DESKTOP_JPG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/03_46691618.png";
export const DR_LEE_IMAGE_MOBILE_WEBP = `${CDN}/sub_01_02_img5-mobile_2e57f5ca.webp`;

export const DR_JO_CARD_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/01_5e3176cb.png";

// ── 디자인 토큰 ──────────────────────────────────────────────────────────────
export const GOLD = "#d2ac67";
export const GOLD_LIGHT = "#f9f3e8";
export const GOLD_MID = "#e8d5a3";

// ── 타입 ─────────────────────────────────────────────────────────────────────
export interface Doctor {
  id: number;
  name: string;
  nameEn: string;
  title: string;
  image: string;
  cardImage?: string;
  cardImagePosition?: string;
  mobileImage?: string;
  mobileObjectPosition?: string;
  badge: string;
  intro: string[];
  credentials: { icon: React.ElementType; label: string; text: string }[];
  specialties: string[];
}

// ── 의료진 데이터 ─────────────────────────────────────────────────────────────
export const doctors: Doctor[] = [
  {
    id: 0,
    name: "조시형 원장",
    nameEn: "Dr. JO SI-HYUNG",
    title: "피부과 전문의 · 의학박사",
    image: DR_JO_IMAGE_DESKTOP_JPG,
    cardImage: DR_JO_CARD_IMAGE,
    cardImagePosition: "center 15%",
    mobileImage: DR_JO_IMAGE_MOBILE_WEBP,
    badge: "원장",
    intro: [
      "2006년 부산 서면에서 첫 진료를 시작한 이래, 어느덧 20년이 넘는 시간 동안 수많은 환자분들의 피부 고민을 마주해 왔습니다.",
      "피부 치료는 단순히 장비를 사용하는 기술이 아니라, 환자의 피부 상태를 정확히 읽어내는 '안목'에서 시작됩니다. 무리한 시술보다는 가장 안전하고 자연스러운 결과를 지향합니다.",
      "앞으로도 변함없이 정직하고 숙련된 진료로 여러분의 피부 건강을 지켜드리겠습니다.",
    ],
    credentials: [
      { icon: Award, label: "자격", text: "피부과 전문의" },
      { icon: GraduationCap, label: "학력", text: "부산대학병원 피부과 수련" },
      { icon: GraduationCap, label: "학력", text: "인제대 피부과 교수역임" },
      { icon: GraduationCap, label: "학력", text: "인제대, 부산대 외래교수역임" },
      { icon: Award, label: "경력", text: "부산경남울산피부과의사회 회장 역임" },
      { icon: Zap, label: "자문의", text: "써마지 FLX 자문의" },
      { icon: Award, label: "경력", text: "미국 피부과 학회 정회원(AAD)" },
      { icon: Stethoscope, label: "현직", text: "현) 스타피부과 원장" },
    ],
    specialties: [
      "눈밑지방재배치", "리프팅", "울쎄라", "써마지",
      "흉터치료", "색소치료", "백반증", "문신제거", "보톡스", "필러",
    ],
  },
  {
    id: 1,
    name: "우혜진 원장",
    nameEn: "Dr. WOO HYE-JIN",
    title: "피부과 전문의",
    image: DR_WOO_IMAGE_DESKTOP_JPG,
    cardImage: DR_WOO_IMAGE_DESKTOP_JPG,
    cardImagePosition: "center 15%",
    mobileImage: DR_WOO_IMAGE_MOBILE_WEBP,
    badge: "원장",
    intro: [
      "피부과 전문의로서 환자분들의 피부 건강을 최우선으로 생각합니다.",
      "정확한 진단과 맞춤형 치료를 통해 최고의 결과를 제공하기 위해 노력하겠습니다.",
    ],
    credentials: [
      { icon: Award, label: "자격", text: "피부과 전문의" },
      { icon: GraduationCap, label: "학력", text: "카톨릭의대 피부과 수련" },
      { icon: GraduationCap, label: "학력", text: "카톨릭의대 피부과 외래교수 역임" },
      { icon: Stethoscope, label: "학회", text: "대한 피부과 학회 정회원" },
      { icon: Stethoscope, label: "학회", text: "미국 피부과 학회 정회원(AAD)" },
      { icon: Award, label: "경력", text: "전) 고운세상 김양제 피부과원장" },
    ],
    specialties: [
      "리프팅", "울쎄라", "써마지", "흉터치료",
      "색소치료", "피부질환", "문신제거", "손발톱무좀", "보톡스",
    ],
  },
  {
    id: 2,
    name: "이기욱 원장",
    nameEn: "Dr. LEE GI-WOOK",
    title: "피부과 전문의 · 의학박사",
    image: DR_LEE_IMAGE_DESKTOP_JPG,
    cardImage: DR_LEE_IMAGE_DESKTOP_JPG,
    cardImagePosition: "center 15%",
    mobileImage: DR_LEE_IMAGE_MOBILE_WEBP,
    badge: "원장",
    intro: [
      "의학박사로서 최신 피부과학 지식을 바탕으로 환자분들께 최고 수준의 의료 서비스를 제공합니다.",
      "안전하고 효과적인 치료를 통해 여러분의 피부 건강을 지켜드리겠습니다.",
    ],
    credentials: [
      { icon: Award, label: "자격", text: "피부과 전문의" },
      { icon: GraduationCap, label: "학력", text: "고신대학교 의과대학 의학박사" },
      { icon: GraduationCap, label: "학력", text: "고신대학교 의과대학 피부과 외래교수" },
      { icon: Stethoscope, label: "학회", text: "대한 피부과학회 정회원" },
      { icon: Stethoscope, label: "학회", text: "대한 피부과의사회 정회원" },
      { icon: Award, label: "경력", text: "전) 아름다운피부과 원장" },
    ],
    specialties: [
      "리프팅", "울쎄라", "써마지", "색소치료",
      "백반증", "피부질환", "문신제거", "손발톱무좀",
    ],
  },
];
