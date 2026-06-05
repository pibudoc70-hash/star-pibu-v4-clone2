import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('TreatmentsEquipmentSection 카피 검증', () => {
  const source = readFileSync(
    path.resolve(process.cwd(), 'client/src/components/TreatmentsEquipmentSection.tsx'),
    'utf8',
  );

  it('리쥬란 힐러, 리쥬란 힐러 플러스, 쥬베룩 문구가 최신 상태여야 한다', () => {
    expect(source).toContain('name: "리쥬란 힐러"');
    expect(source).toContain(
      'desc: "연어 DNA 성분(PDRN)을 이용한 피부 재생 치료로 피부 탄력·수분·결을 종합적으로 개선하는 시술입니다."',
    );
    expect(source).toContain(
      'desc: "PDRN 피부 재생과 HA 즉각 수분 공급을 동시에 누리는 리쥬란 업그레이드로 기존 리쥬란보다 수분감과 광채 효과가 더욱 뚜렷하게 나타납니다."',
    );
    expect(source).toContain('name: "쥬베룩"');
    expect(source).toContain(
      'desc:"HA·PDLLA 복합 차세대 스킨부스터로 즉각 수분 공급과 콜라겐 생성 동시 유도하며 피부 탄력·광채·결을 한 번에 개선하는 복합 효과 스킨부스터입니다."',
    );
  });

  it('보톡스·필러 카테고리 카드 순서가 요청한 순서여야 한다', () => {
    const botoxSection = source.match(/botox:\s*\[(.*?)\n\s*\],\n\n\s*\/\/ ── 여드름 치료/s);

    expect(botoxSection?.[1]).toBeTruthy();

    const section = botoxSection![1];
    const expectedOrder = [
      'name: "보톡스"',
      'name: "필러"',
      'name: "윤곽 주사"',
      'name: "리쥬란 힐러"',
      'name: "리쥬란 힐러 플러스"',
      'name: "쥬베룩"',
    ];

    let lastIndex = -1;
    for (const entry of expectedOrder) {
      const currentIndex = section.indexOf(entry);
      expect(currentIndex).toBeGreaterThan(lastIndex);
      lastIndex = currentIndex;
    }
  });
});
