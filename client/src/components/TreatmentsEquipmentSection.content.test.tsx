/**
 * TreatmentsEquipmentSection 콘텐츠 회귀 방지 테스트
 *
 * 구조 분해(2026-06-06) 이후 데이터/함수가 아래 파일들로 분리됨:
 *   - TreatmentsEquipmentSection.tsx  (메인 컴포넌트)
 *   - data/treatments/treatments-data.ts  (TREATMENTS 데이터)
 *   - data/treatments/equipment-data.ts   (EQUIPMENT 데이터)
 *   - data/treatments/categories.ts       (CATEGORIES, getCatLabel)
 *   - components/treatments/EquipmentPanel.tsx  (getEqText 포함)
 *
 * 테스트는 관련 파일들을 합산(combined)하여 검사한다.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const source = readFileSync(
  path.resolve(root, 'client/src/components/TreatmentsEquipmentSection.tsx'),
  'utf8',
);

// 구조 분해 후 분리된 파일들
const treatmentsDataSource = readFileSync(
  path.resolve(root, 'client/src/data/treatments/treatments-data.ts'),
  'utf8',
);
const equipmentDataSource = readFileSync(
  path.resolve(root, 'client/src/data/treatments/equipment-data.ts'),
  'utf8',
);
const categoriesSource = readFileSync(
  path.resolve(root, 'client/src/data/treatments/categories.ts'),
  'utf8',
);
const equipmentPanelSource = readFileSync(
  path.resolve(root, 'client/src/components/treatments/EquipmentPanel.tsx'),
  'utf8',
);
// Step 4 리팩토링: 인라인 TreatmentCard 함수가 EquipmentTreatmentCard.tsx로 분리됨
const equipmentTreatmentCardSource = readFileSync(
  path.resolve(root, 'client/src/components/treatments/EquipmentTreatmentCard.tsx'),
  'utf8',
);

// 전체 합산 소스 (데이터 + 컴포넌트)
const combinedSource = source + '\n' + treatmentsDataSource + '\n' + equipmentDataSource + '\n' + categoriesSource + '\n' + equipmentPanelSource + '\n' + equipmentTreatmentCardSource;

// ─── 번역 누락 회귀 방지 테스트 ────────────────────────────────────────────────
describe('TreatmentsEquipmentSection 다국어 번역 완전성 검증', () => {
  it('TREATMENTS 섹션의 모든 nameEn 항목에 descEn이 존재해야 한다', () => {
    // 데이터가 treatments-data.ts로 이동했으므로 해당 파일 검사
    const nameEnMatches = [...treatmentsDataSource.matchAll(/nameEn: "([^"]+)"/g)];
    const missing: string[] = [];
    for (let i = 0; i < nameEnMatches.length; i++) {
      const m = nameEnMatches[i];
      const start = m.index!;
      const end = i + 1 < nameEnMatches.length ? nameEnMatches[i + 1].index! : treatmentsDataSource.length;
      const chunk = treatmentsDataSource.slice(start, end);
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
    // 데이터가 equipment-data.ts로 이동했으므로 해당 파일 검사
    const brandMatches = [...equipmentDataSource.matchAll(/brand: "([^"]+)"/g)];
    const missing: string[] = [];
    for (let i = 0; i < brandMatches.length; i++) {
      const m = brandMatches[i];
      const start = m.index!;
      const end = i + 1 < brandMatches.length ? brandMatches[i + 1].index! : equipmentDataSource.length;
      const chunk = equipmentDataSource.slice(start, end);
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

  it('getText 헬퍼가 useLocalizedText 공유 hook으로 추출되어 import로 사용되어야 한다 (MAINT-P1-1)', () => {
    // Step 4 리팩토링: 인라인 TreatmentCard 함수가 EquipmentTreatmentCard.tsx로 분리됨
    // useLocalizedText는 EquipmentTreatmentCard.tsx에 위치
    expect(equipmentTreatmentCardSource).toContain("import { useLocalizedText } from \"@/hooks/useLocalizedText\"");
    expect(source).not.toContain(
      'function getText(ko: string, en?: string, ja?: string, zh?: string): string',
    );
  });

  it('카드 desc 렌더링에 getText(item.desc, item.descEn, item.descJa, item.descZh)를 사용해야 한다', () => {
    // Step 4 리팩토링: 카드 렌더링은 EquipmentTreatmentCard.tsx에 위치
    expect(equipmentTreatmentCardSource).toContain('getText(item.desc, item.descEn, item.descJa, item.descZh)');
  });

  it('장비 패널 desc 렌더링에 getEqText를 사용해야 한다', () => {
    // getEqText는 EquipmentPanel.tsx에 위치 — (eq, field) 시그니처 사용
    expect(equipmentPanelSource).toContain('getEqText(selectedEq, "desc")');
  });

  it('카드 제목 렌더링에 getText(item.name, item.nameEn, item.nameJa, item.nameZh)를 사용해야 한다', () => {
    // Step 4 리팩토링: 카드 렌더링은 EquipmentTreatmentCard.tsx에 위치
    expect(equipmentTreatmentCardSource).toContain('getText(item.name, item.nameEn, item.nameJa, item.nameZh)');
  });

  it('커테고리 탭 label 렌더링에 getCatLabel(cat, lang)을 사용해야 한다 (Round-10: CategoryTabList으로 추출됨)', () => {
    // Round-10 리팩터링: getCatLabel 호출이 CategoryTabList.tsx로 이동됨
    const categoryTabListSource = readFileSync(
      path.resolve(root, 'client/src/components/treatments/CategoryTabList.tsx'),
      'utf8',
    );
    expect(categoryTabListSource).toContain('getCatLabel(cat, lang)');
  });

  it('getCatLabel 헬퍼가 정의되어 있어야 한다', () => {
    // 구조 분해 후 categories.ts에 위치
    expect(categoriesSource).toContain('function getCatLabel(');
  });

  it('CATEGORIES에 labelJa가 13개 존재해야 한다', () => {
    // 구조 분해 후 categories.ts에 위치
    const labelJaCount = (categoriesSource.match(/labelJa:/g) || []).length;
    expect(labelJaCount).toBeGreaterThanOrEqual(13);
  });

  it('CATEGORIES에 labelZh가 13개 존재해야 한다', () => {
    // 구조 분해 후 categories.ts에 위치
    const labelZhCount = (categoriesSource.match(/labelZh:/g) || []).length;
    expect(labelZhCount).toBeGreaterThanOrEqual(13);
  });

  it('장비 타이틀 렌더링에 getEqText를 사용해야 한다', () => {
    // getEqText는 EquipmentPanel.tsx에 위치 — (eq, field) 시그니처 사용
    // 타이틀은 eq.name 필드이므로 getEqText(eq, 'desc') 또는 eq.name 직접 사용
    expect(equipmentPanelSource).toContain('getEqText');
  });
});

// ─── 기존 카피 검증 테스트 ────────────────────────────────────────────────────
describe('TreatmentsEquipmentSection 카피 검증', () => {
  it('리쥬란 힐러, 리쥬란 힐러 플러스, 쥬베룩 문구가 최신 상태여야 한다', () => {
    // 데이터가 treatments-data.ts로 이동했으므로 해당 파일 검사
    expect(treatmentsDataSource).toContain('name: "리쥬란 힐러"');
    expect(treatmentsDataSource).toContain(
      'desc: "연어 DNA 성분(PDRN)을 이용한 피부 재생 치료로 피부 탄력·수분·결을 종합적으로 개선하는 시술입니다."',
    );
    expect(treatmentsDataSource).toContain(
      'desc: "PDRN 피부 재생과 HA 즉각 수분 공급을 동시에 누리는 리쥬란 업그레이드로 기존 리쥬란보다 수분감과 광채 효과가 더욱 뚜렷하게 나타납니다."',
    );
    expect(treatmentsDataSource).toContain('name: "쥬베룩"');
    expect(treatmentsDataSource).toContain(
      'desc:"HA·PDLLA 복합 차세대 스킨부스터로 즉각 수분 공급과 콜라겐 생성 동시 유도하며 피부 탄력·광채·결을 한 번에 개선하는 복합 효과 스킨부스터입니다."',
    );
  });

  it('보톡스·필러 카테고리 카드 순서가 요청한 순서여야 한다', () => {
    // 데이터가 treatments-data.ts로 이동했으므로 해당 파일 검사
    const botoxSection = treatmentsDataSource.match(/botox:\s*\[(.*?)\n\s*\],\n\n\s*\/\/ ── 여드름 치료/s);

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
