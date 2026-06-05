/**
 * StarLogo - 스타피부과 로고 이미지
 * CDN URL: 스타피부과_로고_e1d4f412.gif (배경 제거, 테두리 제거 완료)
 * 박스 테두리 제거 완료
 */

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/스타피부과_로고_64a097b7.gif";

interface StarLogoProps {
  variant?: "color" | "white" | "dark";
  height?: number;
  className?: string;
}

export default function StarLogo({ variant = "color", height = 52, className = "" }: StarLogoProps) {
  return (
    <img
      src={LOGO_URL}
      alt="스타피부과 로고"
      className={className}
      // 로고는 헤더 LCP 요소 — eager + high priority로 즉시 로드
      loading="eager"
      decoding="async"
      fetchPriority="high"
      style={{
        height: `${height}px`,
        width: "auto",
      }}
    />
  );
}
