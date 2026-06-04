import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import OptimizedImage from '@/components/OptimizedImage';
import { useLang } from '@/contexts/LangContext';

interface YouTubeVideo {
  id: number;
  title: string;
  videoId: string;
  type: 'video' | 'shorts';
}

export default function YouTubeSection() {
  const { t } = useLang();
  const yt = t.youtube;
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [shorts, setShorts] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // DB에서 YouTube 영상 데이터 조회
  const { data: allVideos } = trpc.youtube.getAll.useQuery();

  useEffect(() => {
    if (allVideos === undefined) return; // 로딩 중
    const videoList = allVideos.filter((v) => v.type === 'video') as YouTubeVideo[];
    const shortsList = allVideos.filter((v) => v.type === 'shorts') as YouTubeVideo[];
    setVideos(videoList);
    setShorts(shortsList);
    setIsLoading(false);
  }, [allVideos]);

  // H-4: 모달 ESC 키 닫기 (WCAG 2.1 SC 2.1.2)
  useEffect(() => {
    if (!selectedVideo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedVideo(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [selectedVideo]);

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* 섹션 제목 */}
        <div className="text-center mb-12">
          <p className="text-sm md:text-base font-medium mb-2" style={{ color: '#D1AB67' }}>
            YOUTUBE CHANNEL
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {yt.sectionTitle}
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            {yt.sectionSubtitle}
          </p>
        </div>

        {/* 상단 영상 4개 */}
        {videos.length > 0 && (
          <div className="mb-16">
            <h3 className="text-lg md:text-xl font-semibold mb-6 text-gray-900">{yt.latestVideos}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {videos.map((video) => (
                <button type="button"
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className="group relative overflow-hidden rounded-lg cursor-pointer transition-transform hover:scale-105"
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
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors">
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
                <button type="button"
                  key={short.id}
                  onClick={() => setSelectedVideo(short)}
                  className="group relative overflow-hidden rounded-lg cursor-pointer transition-transform hover:scale-105"
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
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors">
                      <div className="absolute bottom-2 left-2 w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/90 flex items-center justify-center">
                        <div className="w-0 h-0 border-l-4 border-l-transparent border-r-0 border-t-3 border-t-transparent border-b-3 border-b-transparent" style={{ borderLeftColor: '#D1AB67' }} />
                      </div>
                    </div>
                  </div>

                  {/* 제목 */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
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
            className="inline-block px-8 py-3 rounded-full font-semibold transition-all hover:shadow-lg"
            style={{ background: '#D1AB67', color: 'white' }}
          >
            {yt.visitChannel}
          </a>
        </div>
      </div>

      {/* 모달 - 영상 재생 */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="yt-modal-title"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedVideo(null); }}
        >
          {/* 일반 영상: 가로 모달 */}
          {selectedVideo.type === 'video' ? (
            <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden">
              {/* 닫기 버튼 */}
              <button type="button"
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
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
              <div className="p-4 bg-gray-900">
                <h3 id="yt-modal-title" className="text-white font-semibold text-sm md:text-base line-clamp-2">
                  {selectedVideo.title}
                </h3>
              </div>
            </div>
          ) : (
            /* 쇼츠: 세로 모달 */
            <div className="relative w-full max-w-sm h-[80vh] md:h-auto md:max-h-[90vh] bg-black rounded-2xl overflow-hidden flex flex-col">
              {/* 닫기 버튼 */}
              <button type="button"
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
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

              {/* 제목 */}
              <div className="p-4 bg-gray-900 border-t border-gray-800">
                <h3 className="text-white font-semibold text-sm line-clamp-2 mb-3">
                  {selectedVideo.title}
                </h3>
                {/* 하단 닫기 버튼 */}
                <button type="button"
                  onClick={() => setSelectedVideo(null)}
                  className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
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
