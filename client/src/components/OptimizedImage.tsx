/**
 * OptimizedImage - 이미지 최적화 공통 컴포넌트
 *
 * 기능:
 * - loading="lazy" 기본 적용 (hero 등 LCP 이미지는 priority=true로 eager 전환)
 * - fetchpriority="high" (priority=true 시 적용)
 * - <picture> 태그로 WebP/AVIF 폴백 처리
 *   - CDN URL(cloudfront, manus-storage 등)은 쿼리스트링으로 포맷 힌트 추가
 *   - 로컬/알 수 없는 URL은 원본 그대로 사용
 * - width/height 속성으로 CLS(레이아웃 이동) 방지
 */
import React from "react";

// React 19+ 공식 타입에 fetchPriority가 추가됨
// 구버전 @types/react 호환을 위해 별도 타입 선언
declare module 'react' {
  interface ImgHTMLAttributes<T> {
    fetchPriority?: 'high' | 'low' | 'auto';
  }
}

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** true이면 loading="eager" + fetchpriority="high" (Hero/LCP 이미지용) */
  priority?: boolean;
  /** picture 태그 WebP/AVIF 소스 생성 여부 (기본 true) */
  usePicture?: boolean;
  /** 컨테이너 className (picture 태그 래퍼에 적용) */
  wrapperClassName?: string;
}

/**
 * CDN URL에 WebP/AVIF 포맷 힌트 쿼리스트링 추가
 * - CloudFront, manus-storage, 기타 CDN URL에만 적용
 * - 이미 확장자가 .webp/.avif/.svg/.gif인 경우 변환 불필요
 */
function buildFormatSrc(src: string, format: "webp" | "avif"): string | null {
  try {
    // SVG, GIF, 이미 WebP/AVIF인 경우 변환 불필요
    const lower = src.toLowerCase();
    if (
      lower.endsWith(".svg") ||
      lower.endsWith(".gif") ||
      lower.endsWith(".webp") ||
      lower.endsWith(".avif")
    ) {
      return null;
    }

    // CDN 도메인 패턴 확인
    const isCDN =
      lower.includes("cloudfront.net") ||
      lower.includes("manus-storage") ||
      lower.includes("amazonaws.com") ||
      lower.includes("d2xsxph8kpxj0f");

    if (!isCDN) return null;

    // 이미 쿼리스트링이 있으면 &format=, 없으면 ?format= 추가
    const separator = src.includes("?") ? "&" : "?";
    return `${src}${separator}format=${format}`;
  } catch {
    return null;
  }
}

export default function OptimizedImage({
  src,
  alt,
  priority = false,
  usePicture = true,
  className,
  wrapperClassName,
  width,
  height,
  style,
  onError,
  ...rest
}: OptimizedImageProps) {
  const loading: "lazy" | "eager" = priority ? "eager" : "lazy";
  const fetchPriorityValue = priority ? "high" : "auto";

  const avifSrc = usePicture ? buildFormatSrc(src, "avif") : null;
  const webpSrc = usePicture ? buildFormatSrc(src, "webp") : null;

  // picture 태그가 필요한 경우 (AVIF 또는 WebP 소스가 있을 때)
  const needsPicture = usePicture && (avifSrc || webpSrc);

  const imgElement = (
    <img
      src={src}
      alt={alt}
      loading={loading}
      fetchPriority={fetchPriorityValue as 'high' | 'low' | 'auto'}
      width={width}
      height={height}
      className={className}
      style={style}
      onError={onError}
      {...rest}
    />
  );

  if (!needsPicture) {
    return imgElement;
  }

  return (
    <picture className={wrapperClassName}>
      {avifSrc && <source srcSet={avifSrc} type="image/avif" />}
      {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
      {imgElement}
    </picture>
  );
}
