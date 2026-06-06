import { readFileSync } from 'node:fs';
import path from 'node:path';

const source = readFileSync(
  path.resolve(process.cwd(), 'client/src/components/TreatmentsEquipmentSection.tsx'),
  'utf8',
);

// ─── 번역 누락 회귀 방지 테스트 ────────────────────────────────────────────────
describe('TreatmentsEquipmentSection 다국어 번역 완전성 검증', () => {
  it('TREATMENTS 섹션의 모든 nameEn 항목에 descEn이 존재해야 한다', () => {
    const nameEnMatches = [...source.matchAll(/nameEn: "([^"]+)"/g)];
    const missing: string[] = [];
    for (let i = 0; i < nameEnMatches.length; i++) {
      const m = nameEnMatches[i];
      const start = m.index!;
      const end = i + 1 < nameEnMatches.length ? nameEnMatches[i + 1].index! : source.length;
      const chunk = source.slice(start, end);
      if (chunk.includes('desc:') && !chunk.includes('descEn:')) {
        missing.push(m[1]);
      }
    }
    if (missing.length > 0) {
      throw new Error(
        `다음 항목에 descEn 번역이 없습니다 (외국어 페이지에서 한국어 노출됨):\n${missing.map(n => `  - ${n}`).join('\n')}`,
      );
    }
  });

  it('EQUIPMENT 섹션의 모든 brand 항목에 descEn이 존재해야 한다', () => {
    const eqStart = source.indexOf('const EQUIPMENT: Record<string, Equipment[]> = {');
    const eqEndA = source.indexOf('\nfunction TreatmentCard', eqStart);
    const eqEndB = source.indexOf('\nexport default', eqStart);
    const eqEnd = eqEndA !== -1 ? eqEndA : eqEndB;
    const eqSection = source.slice(eqStart, eqEnd);

    const brandMatches = [...eqSection.matchAll(/brand: "([^"]+)"/g)];
    const missing: string[] = [];
    for (let i = 0; i < brandMatches.length; i++) {
      const m = brandMatches[i];
      const start = m.index!;
      const end = i + 1 < brandMatches.length ? brandMatches[i + 1].index! : eqSection.length;
      const chunk = eqSection.slice(start, end);
      if (chunk.includes('desc:') && !chunk.includes('descEn:')) {
        const nameMatch = chunk.match(/name: "([^"]+)"/);
        missing.push(`${m[1]} / ${nameMatch?.[1] ?? '?'}`);
      }
    }
    if (missing.length > 0) {
      throw new Error(
        `다음 장비 항목에 descEn 번역이 없습니다 (외국어 페이지에서 한국어 노출됨):\n${missing.map(n => `  - ${n}`).join('\n')}`,
      );
    }
  });

  it('getText 헬퍼가 TreatmentCard 함수 내에 정의되어 있어야 한다', () => {
    expect(source).toContain(
      'function getText(ko: string, en?: string, ja?: string, zh?: string): string',
    );
  });

  it('카드 desc 렌더링에 getText(item.desc, item.descEn, item.descJa, item.descZh)를 사용해야 한다', () => {
    expect(source).toContain('getText(item.desc, item.descEn, item.descJa, item.descZh)');
  });

  it('장비 패널 desc 렌더링에 getEqText를 사용해야 한다', () => {
    expect(source).toContain('getEqText(selectedEq.desc, selectedEq.descEn, selectedEq.descJa, selectedEq.descZh)');
  });
});

// ─── 기존 카피 검증 테스트 ────────────────────────────────────────────────────
describe('TreatmentsEquipmentSection 카피 검증', () => {
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
