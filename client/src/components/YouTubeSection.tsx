/**
 * YouTubeSection
 *
 * S1-T4: isError 처리 + 이중 state 제거
 *   - trpc isLoading/isError/data 직접 사용 (useEffect + 중간 state 제거)
 *   - 에러 상태에서 에러 메시지 + 재시도 버튼 표시
 *
 * S1-T5: modal focus trap + focus restore
 *   - 모달 열릴 때 닫기 버튼에 자동 포커스
 *   - Tab/Shift+Tab이 모달 내부에서만 순환
 *   - 모달 닫힐 때 트리거 버튼으로 포커스 복귀
 *
 * P1 수정 (2025-06-06):
 *   - body scroll lock: 모달 열릴 때 document.body overflow hidden, 닫힐 때 복원
 *   - duplicate id 버그: yt-modal-title이 video/shorts 두 브랜치 모두에 동일 id 사용 → 조건부 단일 렌더로 수정
 *   - focus trap stale ref: focusable 목록을 Tab 이벤트 시점에 재쿼리하여 DOM 변경에 안전하게 대응
 *   - i18n 하드코딩 제거: 로딩/에러/aria 문자열을 i18n.ts youtube 블록으로 이전
 *   - useAuth.ts useMemo 사이드이펙트: localStorage 쓰기를 useEffect로 분리 (별도 파일)
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
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

export default function YouTubeSection() {
  const { t } = useLang();
  const yt = t.youtube;

  // [P0-OPT] viewport 진입 후에만 API fetch 활성화 — 첫 렌더 시 query 비용 제거
  const [sectionRef, isVisible] = useVisibleFetch('300px 0px');

  // S1-T4: tRPC 직접 사용 — 이중 state 제거
  const { data: allVideos, isLoading, isError, refetch } = trpc.youtube.getAll.useQuery(
    undefined,
    { enabled: isVisible, staleTime: 10 * 60 * 1000 }
  );

  // 파생 상태 — useEffect + 중간 state 불필요
  const videos = (allVideos ?? []).filter((v) => v.type === 'video') as YouTubeVideo[];
  const shorts = (allVideos ?? []).filter((v) => v.type === 'shorts') as YouTubeVideo[];

  // S1-T5: modal state + trigger ref (focus restore용)
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
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
      requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
      });
    } else {
      // 모달 닫힘 — 트리거 버튼으로 포커스 복귀
      triggerRef.current?.focus();
      triggerRef.current = null;
    }
  }, [selectedVideo]);

  // S1-T5 + P1-B: focus trap — Tab/Shift+Tab을 모달 내부로 제한
  // P1-B 수정: focusable 목록을 이벤트 핸들러 내부에서 재쿼리 (stale ref 방지)
  useEffect(() => {
    if (!selectedVideo || !modalRef.current) return;
    const modal = modalRef.current;

    const onTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      // 이벤트 시점에 재쿼리 — iframe 로드 완료 후 DOM 변경에 안전
      const focusable = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, iframe, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onTab);
    return () => document.removeEventListener('keydown', onTab);
  }, [selectedVideo]);

  // H-4: ESC 키로 모달 닫기 (WCAG 2.1 SC 2.1.2)
  useEffect(() => {
    if (!selectedVideo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedVideo(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [selectedVideo]);

  const openModal = useCallback((video: YouTubeVideo, btn: HTMLButtonElement) => {
    triggerRef.current = btn;
    setSelectedVideo(video);
  }, []);

  const closeModal = useCallback(() => setSelectedVideo(null), []);

  // S1-T4: 로딩 상태 — shimmer 스켈레톤 UI
  if (isLoading) {
    return (
      <section
        ref={sectionRef as React.RefObject<HTMLElement & HTMLDivElement>}
        className="py-16 md:py-24 bg-white"
        aria-label={yt.loadingLabel}
        aria-busy="true"
      >
        <div className="container">
          {/* 섹션 헤더 스켈레톤 */}
          <div className="text-center flex flex-col items-center mb-12" aria-hidden="true">
            <div className="skeleton-shimmer rounded-sm h-3 w-20 mb-4" />
            <div className="skeleton-shimmer rounded-md h-8 w-56 mb-4" />
            <div className="skeleton-shimmer rounded-md h-4 w-72" />
          </div>
          {/* 영상 카드 그리드 스켈레톤 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" aria-hidden="true">
            {[0,1,2,3,4,5,6,7].map((i) => (
              <div key={i} className="rounded-xl overflow-hidden">
                <div className="skeleton-shimmer" style={{ aspectRatio: '16/9' }} />
                <div className="p-3 space-y-2">
                  <div className="skeleton-shimmer rounded h-4 w-full" />
                  <div className="skeleton-shimmer rounded h-3 w-2/3" />
                </div>
              </div>
            ))}
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
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full font-semibold text-white transition-all hover:shadow-lg"
            style={{ background: '#D1AB67' }}
          >
            <RefreshCw size={16} aria-hidden="true" />
            {yt.retry}
          </button>
        </div>
      </section>
    );
  }

  // 빈 상태
  if (!videos.length && !shorts.length) {
    return null;
  }

  return (
    <section ref={sectionRef as React.RefObject<HTMLElement & HTMLDivElement>} className="py-16 md:py-24 bg-white">
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
          <p className="section-subtitle">
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
                  className="group relative overflow-hidden rounded-lg cursor-pointer transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D1AB67]"
                >
                  {/* 썸네일 */}
                  <div className="relative w-full aspect-video bg-gray-200 overflow-hidden">
                    <OptimizedImage
                      src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      usePicture={false}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
                      }}
                    />
                    {/* 플레이 버튼 오버레이 */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors" aria-hidden="true">
                      <div className="absolute bottom-3 left-3 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/60 flex items-center justify-center">
                        <div className="w-0 h-0 border-l-5 md:border-l-7 border-l-transparent border-r-0 border-t-3 md:border-t-4 border-t-transparent border-b-3 md:border-b-4 border-b-transparent" style={{ borderLeftColor: '#D1AB67' }} />
                      </div>
                    </div>
                  </div>

                  {/* 제목 */}
                  <div className="p-3 bg-white">
                    <p className="text-xs md:text-sm font-medium text-gray-900 line-clamp-2 text-left">
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
            <h3 className="text-lg md:text-xl font-semibold mb-6 text-gray-900">{yt.shorts}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
              {shorts.map((short) => (
                <button
                  type="button"
                  key={short.id}
                  onClick={(e) => openModal(short, e.currentTarget)}
                  aria-label={`${short.title} ${yt.playShorts}`}
                  className="group relative overflow-hidden rounded-lg cursor-pointer transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D1AB67]"
                >
                  {/* 썸네일 */}
                  <div className="relative w-full aspect-[9/16] bg-gray-200 overflow-hidden">
                    <OptimizedImage
                      src={`https://img.youtube.com/vi/${short.videoId}/maxresdefault.jpg`}
                      alt={short.title}
                      className="w-full h-full object-cover"
                      usePicture={false}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${short.videoId}/hqdefault.jpg`;
                      }}
                    />
                    {/* 플레이 버튼 오버레이 */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors" aria-hidden="true">
                      <div className="absolute bottom-2 left-2 w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/90 flex items-center justify-center">
                        <div className="w-0 h-0 border-l-4 border-l-transparent border-r-0 border-t-3 border-t-transparent border-b-3 border-b-transparent" style={{ borderLeftColor: '#D1AB67' }} />
                      </div>
                    </div>
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
            className="inline-block px-8 py-3 rounded-full font-semibold transition-all hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D1AB67]"
            style={{ background: '#D1AB67', color: 'white' }}
          >
            {yt.visitChannel}
          </a>
        </div>
      </div>

      {/* S1-T5: 모달 — focus trap + focus restore + body scroll lock 구현 */}
      {selectedVideo && (
        <div
          ref={modalRef}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={MODAL_TITLE_ID}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          {/* P1-C: 단일 브랜치 렌더 — duplicate id 제거 */}
          {selectedVideo.type === 'video' ? (
            /* 일반 영상: 가로 모달 */
            <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden">
              {/* 닫기 버튼 — 모달 열릴 때 자동 포커스 */}
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

              {/* 제목 — P1-C: 단일 id 보장 */}
              <div className="p-4 bg-gray-900">
                <h3 id={MODAL_TITLE_ID} className="text-white font-semibold text-sm md:text-base line-clamp-2">
                  {selectedVideo.title}
                </h3>
              </div>
            </div>
          ) : (
            /* 쇼츠: 세로 모달 */
            <div className="relative w-full max-w-sm h-[80vh] md:h-auto md:max-h-[90vh] bg-black rounded-2xl overflow-hidden flex flex-col">
              {/* 닫기 버튼 — 모달 열릴 때 자동 포커스 */}
              <button
                type="button"
                ref={closeButtonRef}
                onClick={closeModal}
                aria-label={yt.closeModal}
                className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="w-6 h-6 text-white" aria-hidden="true" />
              </button>

              {/* YouTube 임베드 플레이어 - 세로 비율 */}
              <div className="flex-1 flex items-center justify-center bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                  title={selectedVideo.title}
                  style={{ border: 'none', aspectRatio: '9/16' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              {/* 제목 + 하단 닫기 버튼 — P1-C: 단일 id 보장 */}
              <div className="p-4 bg-gray-900 border-t border-gray-800">
                <h3 id={MODAL_TITLE_ID} className="text-white font-semibold text-sm line-clamp-2 mb-3">
                  {selectedVideo.title}
                </h3>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {yt.close}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
