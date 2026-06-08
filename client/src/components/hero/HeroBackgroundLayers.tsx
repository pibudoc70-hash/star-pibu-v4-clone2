/**
 * HeroBackgroundLayers — Hero 배경 레이어 조립 컴포넌트
 *
 * [R18-P0-2] HeroSection에서 직접 조립되던 4개 배경 레이어를 한 컴포넌트로 추상화:
 * - HeroDarkOverlay: 어두운 오버레이 (가독성 향상)
 * - HeroVignette: 비네트 효과 (가장자리 어둡게)
 * - HeroGoldGlow: 골드 글로우 효과 (상단 조명)
 * - GoldParticles: 파티클 애니메이션
 *
 * HeroSection은 이 컴포넌트만 렌더링하면 되며,
 * 배경 레이어 구성 변경 시 이 파일만 수정하면 된다.
 */
import GoldParticles from "@/components/hero/GoldParticles";
import { HeroDarkOverlay, HeroVignette, HeroGoldGlow } from "@/components/hero/HeroOverlays";

export function HeroBackgroundLayers() {
  return (
    <>
      <HeroDarkOverlay />
      <HeroVignette />
      <HeroGoldGlow />
      <GoldParticles />
    </>
  );
}
