/**
 * 공식 YouTube watch page에서 공개일·채널·제목을 교차 확인한 홈 VideoObject 후보입니다.
 * 확인일: 2026-08-29. 근거가 없는 활성 영상은 의도적으로 이 목록에 넣지 않습니다.
 */
export type VerifiedYouTubeVideoSeo = {
  title: string;
  videoId: string;
  description: string;
  uploadDate: string;
  sourceUrl: string;
};

export const VERIFIED_YOUTUBE_VIDEO_SEO: readonly VerifiedYouTubeVideoSeo[] = [
  {
    title: "눈밑지방재배치 부작용 무서워서 할까말까 고민이신 분!! 피부과전문의 Q&A 영상으로 도움 드립니다.",
    videoId: "XiOTXhPx7qw",
    description: "스타피부과 조시형 원장이 눈밑지방재배치술에 관해 자주 받는 질문을 설명하는 영상입니다.",
    uploadDate: "2024-09-06",
    sourceUrl: "https://www.youtube.com/watch?v=XiOTXhPx7qw",
  },
  {
    title: "울쎄라, 써마지 효과 제대로 보려면 샷수와 함께 이것도 체크하세요!",
    videoId: "s2ny6-qC9go",
    description: "스타피부과 조시형 원장이 울쎄라와 써마지 시술을 안내하는 영상입니다.",
    uploadDate: "2025-07-09",
    sourceUrl: "https://www.youtube.com/watch?v=s2ny6-qC9go",
  },
  {
    title: "피부에 줄기세포 주사는 어떤 효과가? #부산피부과 #줄기세포치료",
    videoId: "b49aByjIskc",
    description: "스타피부과에서 제공하는 피부 줄기세포 주사 관련 안내 영상입니다.",
    uploadDate: "2026-06-24",
    sourceUrl: "https://www.youtube.com/watch?v=b49aByjIskc",
  },
  {
    title: "울쎄라, 써마지 둘 다 리프팅이면 뭐가 달라요?",
    videoId: "6g2ngrso1uw",
    description: "스타피부과 조시형 원장이 울쎄라와 써마지의 차이를 설명하는 영상입니다.",
    uploadDate: "2026-01-14",
    sourceUrl: "https://www.youtube.com/watch?v=6g2ngrso1uw",
  },
];
