/**
 * YouTubeSection
 *
 * P3 수정 (2025-06-30):
 *   - Portal + 위치 계산 방식으로 모달 렌더
 *   - 각 섹션의 viewport 위치를 계산하여 모달을 정확히 중앙에 표시
 *   - 모달을 body 최상위에 렌더하여 stacking context 문제 해결
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertCircle, RefreshCw } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import OptimizedImage from '@/components/OptimizedImage';
import { useLang } from '@/contexts/LangContext';

/** viewport 진입 시점에 합성 후 enabled=true 리턴 — 마운트 즉시 API 호출 방지 */
function useVisibleFetch(rootMargin = '200px 0px'): [React.RefObject<HTMLElement>, boolean] {
  const ref = useRef<HTMLElement>(null!);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [visible, rootMargin]);
  return [ref, visible];
}

interface YouTubeVideo {
  id: number;
  title: string;
  videoId: string;
  type: 'video' | 'shorts';
}

// 모달 ID — 단일 aria-labelledby 참조 보장
const MODAL_TITLE_ID = 'yt-modal-title';
const YOUTUBE_VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export default function YouTubeSection() {
  const { t } = useLang();
  const yt = t.youtube;

  // [P0-OPT] viewport 진입 후에만 API fetch 활성화 — 첫 렌더 시 query 비용 제거
  const [sectionRef, isVisible] = useVisibleFetch('300px 0px');

  // S1-T4: tRPC 직접 사용 — 이중 state 제거
  const { data: allVideos, isLoading, isError, isFetching, refetch } = trpc.youtube.getAll.useQuery(
    undefined,
    { enabled: isVisible, staleTime: 10 * 60 * 1000 }
  );
  
  // 파생 상태 — useEffect + 중간 state 불필요
  const safeVideos = (allVideos ?? []).filter((video) => YOUTUBE_VIDEO_ID_PATTERN.test(video.videoId));
  const videos = safeVideos.filter((v) => v.type === 'video') as YouTubeVideo[];
  const shorts = safeVideos.filter((v) => v.type === 'shorts') as YouTubeVideo[];

  // S1-T5: modal state + trigger ref (focus restore용)
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [modalType, setModalType] = useState<'video' | 'shorts' | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // P1-A: body scroll lock — 모달 열릴 때 스크롤 차단, 닫힐 때 복원
  useEffect(() => {
    if (selectedVideo) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [selectedVideo]);

  // S1-T5: 모달 열릴 때 닫기 버튼 포커스, 닫힐 때 트리거 버튼 포커스 복귀
  useEffect(() => {
    if (selectedVideo) {
      // 모달 열림 — 닫기 버튼에 포커스
      setTimeout(() => closeButtonRef.current?.focus(), 0);
    } else {
      // 모달 닫힘 — 트리거 버튼 포커스 복귀
      triggerRef.current?.focus();
    }
  }, [selectedVideo]);

  const closeModal = useCallback(() => {
    setSelectedVideo(null);
    setModalType(null);
  }, []);

  useEffect(() => {
    if (!selectedVideo) return;
    const handleModalKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;
      const first = focusable[0] as HTMLElement;
      const last = focusable[focusable.length - 1] as HTMLElement;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleModalKeyDown);
    return () => document.removeEventListener("keydown", handleModalKeyDown);
  }, [selectedVideo, closeModal]);

  const openModal = useCallback((video: YouTubeVideo, triggerElement: HTMLElement) => {
    setSelectedVideo(video);
    setModalType(video.type);
    triggerRef.current = triggerElement as HTMLButtonElement;
  }, []);

  // S1-T4: 로딩 상태 — skeleton UI
  if (!isVisible || isLoading) {
    return (
      <section
        ref={sectionRef as React.RefObject<HTMLElement & HTMLDivElement>}
        className="py-16 md:py-24 bg-white"
        aria-label={yt.loadingLabel}
        aria-busy="true"
      >
        <div className="container mx-auto px-4">
          {/* 섹션 제목 스켈레톤 */}
          <div className="section-header-block mb-12">
            <div className="h-4 w-32 bg-gray-200 rounded mb-3 animate-pulse" />
            <div className="h-8 w-64 bg-gray-200 rounded mb-4 animate-pulse" />
            <div className="h-1 w-16 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
          </div>

          {/* 영상 스켈레톤 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <div className="w-full aspect-video bg-gray-200 animate-pulse" />
                <div className="p-3 bg-white space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* 쇼츠 스켈레톤 */}
          <div>
            <div className="h-6 w-20 bg-gray-200 rounded mb-6 animate-pulse" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden">
                  <div className="w-full aspect-[9/16] bg-gray-200 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // S1-T4: 에러 상태 — 재시도 버튼 포함, i18n 문자열 사용
  if (isError) {
    return (
      <section
        ref={sectionRef as React.RefObject<HTMLElement & HTMLDivElement>}
        className="py-16 md:py-24 bg-white"
        aria-label={yt.errorLabel}
      >
        <div className="container mx-auto px-4 text-center">
          <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} aria-hidden="true" />
          <p className="text-gray-600 mb-4">{yt.errorMessage}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isFetching}
              aria-busy={isFetching}
              className="inline-flex min-h-11 items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              style={{ background: 'var(--color-gold-primary)', color: 'var(--color-gold-dark, #7A5C35)' }}
            >
              <RefreshCw size={16} aria-hidden="true" />
              {isFetching ? yt.loadingLabel : yt.retry}
            </button>
            <a
              href="https://www.youtube.com/@starpibu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-2 rounded-full border border-slate-300 text-slate-700 font-semibold transition-all hover:border-slate-500 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"
            >
              {yt.visitChannel}
            </a>
          </div>
        </div>
      </section>
    );
  }

  // 빈 상태 — 데이터 없을 때 섹션 제목만 표시하고 나머지는 숨김
  if (!videos.length && !shorts.length) {
    // 섹션 제목만 표시하고 영상 그리드는 숨김
    return (
      <section ref={sectionRef as React.RefObject<HTMLElement & HTMLDivElement>} className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="section-header-block">
            <span className="section-eyebrow youtube-section-eyebrow">
              YOUTUBE CHANNEL
            </span>
            <h2 className="section-title youtube-section-title">
              {yt.sectionTitle}
            </h2>
            <div className="star-divider mx-auto" />
            <p className="section-subtitle body-text">
              {yt.sectionSubtitle}
            </p>
          </div>
          <div className="mt-12 text-center text-gray-500">
            <p className="mb-4">{yt.errorMessage || 'YouTube 영상을 불러올 수 없습니다.'}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => void refetch()}
                disabled={isFetching}
                aria-busy={isFetching}
                className="inline-flex min-h-11 items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                style={{ background: 'var(--color-gold-primary)', color: 'var(--color-gold-dark, #7A5C35)' }}
              >
                <RefreshCw size={16} aria-hidden="true" />
                {isFetching ? yt.loadingLabel : yt.retry}
              </button>
              <a
                href="https://www.youtube.com/@starpibu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-2 rounded-full border border-slate-300 text-slate-700 font-semibold transition-all hover:border-slate-500 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"
              >
                {yt.visitChannel}
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef as React.RefObject<HTMLElement & HTMLDivElement>} className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* 섹션 제목 */}
        <div className="section-header-block">
          <span className="section-eyebrow youtube-section-eyebrow">
            YOUTUBE CHANNEL
          </span>
          <h2 className="section-title youtube-section-title">
            {yt.sectionTitle}
          </h2>
          <div className="star-divider mx-auto" />
          <p className="section-subtitle body-text">
            {yt.sectionSubtitle}
          </p>
        </div>

        {/* 상단 영상 4개 */}
        {videos.length > 0 && (
          <div className="mb-16">
            <h3 className="text-lg md:text-xl font-semibold mb-6 text-gray-900">{yt.latestVideos}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {videos.map((video) => (
                <button
                  type="button"
                  key={video.id}
                  onClick={(e) => openModal(video, e.currentTarget)}
                  aria-label={`${video.title} ${yt.playVideo}`}
                  className="group relative overflow-hidden rounded-lg cursor-pointer transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                >
                  {/* 썸네일 */}
                  <div className="relative w-full aspect-video bg-gray-200 overflow-hidden">
                    <OptimizedImage
                      src={`/api/youtube-thumbnail/${video.videoId}`}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      usePicture={false}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
                      }}
                    />
                    {/* 호버 오버레이 — 기본 투명, 호버 시만 어두워짐 */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" aria-hidden="true" />
                  </div>

                  {/* 제목 */}
                  <div className="p-3" style={{ background: "rgba(30,18,8,0.85)" }}>
                    <p className="text-xs md:text-sm font-medium line-clamp-2 text-left" style={{ color: "rgba(236,229,211,0.88)" }}>
                      {video.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 하단 쇼츠 6개 (2줄) */}
        {shorts.length > 0 && (
          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-6" style={{ color: "rgba(236,229,211,0.92)" }}>{yt.shorts}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
              {shorts.map((short) => (
                <button
                  type="button"
                  key={short.id}
                  onClick={(e) => openModal(short, e.currentTarget)}
                  aria-label={`${short.title} ${yt.playShorts}`}
                  className="group relative overflow-hidden rounded-lg cursor-pointer transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                >
                  {/* 썸네일 */}
                  <div className="relative w-full aspect-[9/16] bg-gray-200 overflow-hidden">
                    <OptimizedImage
                      src={`/api/youtube-thumbnail/${short.videoId}`}
                      alt={short.title}
                      className="w-full h-full object-cover"
                      usePicture={false}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${short.videoId}/hqdefault.jpg`;
                      }}
                    />
                    {/* 호버 오버레이 — 기본 투명, 호버 시만 어두워짐 */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" aria-hidden="true" />
                  </div>

                  {/* 제목 */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2" aria-hidden="true">
                    <p className="text-xs font-medium text-white line-clamp-2">
                      {short.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 채널 링크 */}
        <div className="text-center mt-12">
          <a
            href="https://www.youtube.com/@starpibu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 rounded-full font-semibold transition-all hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            style={{ background: 'var(--color-gold-primary)', color: 'var(--color-gold-dark, #7A5C35)' }}
          >
            {yt.visitChannel}
          </a>
        </div>
      </div>

      {/* P3: Portal을 사용하여 모달을 body 최상위에 렌더 */}
      {selectedVideo && createPortal(
        <div
          ref={modalRef}
          className="fixed inset-0 bg-black/80 z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={MODAL_TITLE_ID}
        >
          <button
            type="button"
            data-testid="youtube-modal-backdrop"
            aria-label={yt.closeModal}
            tabIndex={-1}
            onClick={closeModal}
            className="absolute inset-0 cursor-default border-0 bg-transparent p-0"
          />
          {/* 모달 컨테이너 - viewport 중앙에 고정 */}
          <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-full max-w-4xl px-4 flex justify-center">
          {modalType === 'video' ? (
            // 일반 영상: 가로 모달
            <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
              {/* 닫기 버튼 */}
              <button
                type="button"
                ref={closeButtonRef}
                onClick={closeModal}
                aria-label={yt.closeModal}
                className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="w-6 h-6 text-white" aria-hidden="true" />
              </button>

              {/* YouTube 임베드 플레이어 */}
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                  title={selectedVideo.title}
                  style={{ border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              {/* 제목 */}
              <div className="p-4 bg-gray-900 flex items-center justify-between gap-4">
                <h3 id={MODAL_TITLE_ID} className="text-white font-semibold text-sm md:text-base line-clamp-2">
                  {selectedVideo.title}
                </h3>
                <a
                  href={`https://www.youtube.com/watch?v=${selectedVideo.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs font-medium text-white underline underline-offset-4 hover:text-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  aria-label={`${selectedVideo.title} YouTube`}
                >
                  YouTube
                </a>
              </div>
            </div>
          ) : (
            // 쇼츠: 세로 모달
            <div className="relative w-full max-w-xs md:max-w-md bg-black rounded-2xl overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 2rem)', height: 'auto' }}>
              {/* 닫기 버튼 */}
              <button
                type="button"
                ref={closeButtonRef}
                onClick={closeModal}
                aria-label={yt.closeModal}
                className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="w-6 h-6 text-white" aria-hidden="true" />
              </button>

              {/* YouTube 임베드 플레이어 */}
              <div className="flex-1 overflow-hidden" style={{ aspectRatio: '9/16' }}>
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                  title={selectedVideo.title}
                  style={{ border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              {/* 제목 */}
              <div className="p-3 bg-gray-900 flex-shrink-0 flex items-center justify-between gap-3">
                <h3 id={MODAL_TITLE_ID} className="text-white font-semibold text-xs md:text-sm line-clamp-2">
                  {selectedVideo.title}
                </h3>
                <a
                  href={`https://www.youtube.com/watch?v=${selectedVideo.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs font-medium text-white underline underline-offset-4 hover:text-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  aria-label={`${selectedVideo.title} YouTube`}
                >
                  YouTube
                </a>
              </div>
            </div>
          )}
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
