/**
 * imageOptimizer.ts
 * 관리자 이미지 업로드 파이프라인: WebP 변환 + 1600px 리사이즈
 *
 * - PNG/JPEG → WebP (quality 80, effort 4)
 * - 이미 WebP/AVIF → 리사이즈만
 * - SVG, GIF, 50KB 미만 → pass-through (원본 그대로 반환)
 * - 최대 너비 1600px (초과 시 비율 유지 축소, 미만 시 유지)
 * - EXIF 메타데이터 제거
 * - sharp 로드 실패 시 원본 그대로 반환 (throw 하지 않음)
 */

const MAX_WIDTH = 1600;
const WEBP_QUALITY = 80;
const WEBP_EFFORT = 4;
const SMALL_FILE_THRESHOLD = 50 * 1024; // 50KB

export interface OptimizeResult {
  buffer: Buffer;
  mimeType: string;
  fileName: string;
  width: number | null;
  height: number | null;
  originalSize: number;
  optimizedSize: number;
}

/**
 * 파일명에서 확장자를 .webp 로 교체
 */
function replaceExtWithWebp(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, "") + ".webp";
}

/**
 * MIME 타입이 pass-through 대상인지 확인
 */
function isPassThrough(mimeType: string, fileSize: number): boolean {
  if (mimeType === "image/svg+xml") return true;
  if (mimeType === "image/gif") return true;
  if (fileSize < SMALL_FILE_THRESHOLD) return true;
  return false;
}

/**
 * 이미지 최적화 메인 함수
 * @param buffer  원본 이미지 바이너리
 * @param originalFileName  원본 파일명 (확장자 포함)
 * @param mimeType  원본 MIME 타입 (e.g. "image/png")
 * @returns OptimizeResult
 */
export async function optimizeImage(
  buffer: Buffer,
  originalFileName: string,
  mimeType: string
): Promise<OptimizeResult> {
  const originalSize = buffer.length;

  // pass-through 조건
  if (isPassThrough(mimeType, originalSize)) {
    console.log(
      `[imageOptimizer] pass-through (${mimeType}, ${(originalSize / 1024).toFixed(1)}KB): ${originalFileName}`
    );
    return {
      buffer,
      mimeType,
      fileName: originalFileName,
      width: null,
      height: null,
      originalSize,
      optimizedSize: originalSize,
    };
  }

  try {
    // sharp 동적 import (설치 실패 시 catch 로 fallback)
    const sharp = (await import("sharp")).default;

    // EXIF 제거: withMetadata 호출 없이 sharp 실행 (sharp는 기본적으로 EXIF 제거)
    let pipeline = sharp(buffer);

    // 메타데이터로 원본 크기 확인
    const meta = await sharp(buffer).metadata();
    const origWidth = meta.width ?? 0;
    const origHeight = meta.height ?? 0;

    // 1600px 초과 시 리사이즈
    if (origWidth > MAX_WIDTH) {
      pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
    }

    let outputBuffer: Buffer;
    let outputMime: string;
    let outputFileName: string;

    if (mimeType === "image/webp" || mimeType === "image/avif") {
      // 이미 WebP/AVIF → 리사이즈만, 포맷 유지
      outputBuffer = await pipeline.toBuffer();
      outputMime = mimeType;
      outputFileName = originalFileName;
    } else {
      // PNG/JPEG 등 → WebP 변환
      outputBuffer = await pipeline
        .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
        .toBuffer();
      outputMime = "image/webp";
      outputFileName = replaceExtWithWebp(originalFileName);
    }

    const optimizedSize = outputBuffer.length;
    const savingPct = (((originalSize - optimizedSize) / originalSize) * 100).toFixed(1);
    console.log(
      `[imageOptimizer] ${(originalSize / 1024).toFixed(1)}KB → ${(optimizedSize / 1024).toFixed(1)}KB (${savingPct}% 절감): ${originalFileName} → ${outputFileName}`
    );

    // 최적화 후 크기 확인
    const outMeta = await sharp(outputBuffer).metadata();

    return {
      buffer: outputBuffer,
      mimeType: outputMime,
      fileName: outputFileName,
      width: outMeta.width ?? null,
      height: outMeta.height ?? null,
      originalSize,
      optimizedSize,
    };
  } catch (err) {
    // sharp 로드 실패 또는 처리 오류 → 원본 그대로 반환
    console.error("[imageOptimizer] 최적화 실패, 원본 사용:", err);
    return {
      buffer,
      mimeType,
      fileName: originalFileName,
      width: null,
      height: null,
      originalSize,
      optimizedSize: originalSize,
    };
  }
}
