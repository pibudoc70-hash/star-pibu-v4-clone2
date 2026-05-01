import { getAllTreatments, updateTreatment } from './server/db';

// 원본 데이터 임포트
const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB";

const TREATMENTS_DATA = {
  best: [
    {
      name: "울써마지 리프팅 + 리쥬란",
      image: `${CDN}/울쎄라피프라임_1_0daba485.png`,
      images: JSON.stringify([
        `${CDN}/울쎄라피프라임_1_0daba485.png`,
        `${CDN}/써마지FLX_20a90462.png`,
      ]),
      youtubeUrl: "https://www.youtube.com/embed/Anuuso34vXw",
    },
    {
      name: "프로파운드 RF 리프팅",
      image: `${CDN}/프로파운드_93be7410.png`,
      images: JSON.stringify([
        `${CDN}/프로파운드_93be7410.png`,
      ]),
      youtubeUrl: "https://www.youtube.com/embed/vZ0rL_XAXUU",
    },
    {
      name: "볼륨업 프로그램",
      image: `${CDN}/볼륨업프로그램_3442a94f.png`,
      images: JSON.stringify([
        `${CDN}/볼륨업프로그램_3442a94f.png`,
      ]),
      youtubeUrl: "https://www.youtube.com/embed/SJZMHZHaYAA",
    },
    {
      name: "줄기세포 치료",
      image: `${CDN}/줄기세포_2d2f2e2e.png`,
      images: JSON.stringify([
        `${CDN}/줄기세포_2d2f2e2e.png`,
      ]),
      youtubeUrl: "https://www.youtube.com/embed/example",
    },
  ],
};

async function fixImages() {
  console.log('🔧 이미지 데이터 수정 시작...');
  
  // 먼저 DB에서 모든 시술 조회
  const allTreatments = await getAllTreatments();
  
  for (const treatment of TREATMENTS_DATA.best) {
    try {
      // 이름으로 시술 찾기
      const dbTreatment = allTreatments.find(t => t.name === treatment.name);
      
      if (!dbTreatment) {
        console.log(`⚠️ ${treatment.name} DB에서 찾을 수 없음 (대신 다른 시술들 업데이트는 나중에 진행)`);
        continue;
      }
      
      // updateTreatment 함수 사용
      console.log(`기존 ID: ${dbTreatment.id}, 이미지: ${treatment.image}`);
      await updateTreatment(dbTreatment.id, {
        imageUrl: treatment.image,
        images: treatment.images,
        youtubeUrl: treatment.youtubeUrl,
      });
      
      console.log(`✅ ${treatment.name} 이미지 수정 완료`);
    } catch (error) {
      console.error(`❌ ${treatment.name} 수정 실패:`, error);
    }
  }
  
  console.log('✨ 이미지 데이터 수정 완료!');
  process.exit(0);
}

fixImages().catch(err => {
  console.error('❌ 오류:', err);
  process.exit(1);
}).finally(() => {
  process.exit(0);
});
