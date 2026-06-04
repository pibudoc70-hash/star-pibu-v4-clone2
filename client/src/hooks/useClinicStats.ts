/**
 * useClinicStats
 * CLINIC_STATS 수치와 STAT_UNITS 단위를 현재 언어에 맞게 조합하여 반환한다.
 *
 * 사용 컴포넌트: HeroSection, PhilosophySection, ResultsStatisticsSection
 *
 * 이 Hook이 해결하는 문제:
 * - 세 컴포넌트에서 `CLINIC_STATS.yearsExperience` + `STAT_UNITS.years[lang]` 패턴이 반복됨
 * - lang 타입 캐스팅 `lang as StatLang`이 각 컴포넌트에 분산됨
 * - 단위 폴백 로직 `?? STAT_UNITS.years.en`이 중복됨
 */
import { useLang } from "@/contexts/LangContext";
import { CLINIC_STATS, STAT_UNITS, type StatLang } from "@/lib/constants";

export interface ClinicStat {
  /** 표시할 숫자 값 (문자열, 천 단위 구분자 포함 가능) */
  value: string;
  /** 현재 언어에 맞는 단위 문자열 */
  unit: string;
}

export interface ClinicStats {
  /** 진료 경력 연수 */
  years: ClinicStat;
  /** 눈밑지방 재배치 시술 건수 */
  cases: ClinicStat;
  /** 레이저 장비 종류 수 */
  types: ClinicStat;
  /** 만족도 (%) */
  satisfaction: ClinicStat;
  /** 의사 1인당 환자 비율 */
  ratio: ClinicStat;
}

export function useClinicStats(): ClinicStats {
  const { lang } = useLang();
  const l = lang as StatLang;

  const unit = (key: keyof typeof STAT_UNITS): string =>
    STAT_UNITS[key][l] ?? STAT_UNITS[key].en;

  return {
    years: {
      value: String(CLINIC_STATS.yearsExperience),
      unit: unit("years"),
    },
    cases: {
      value: CLINIC_STATS.eyeBagCases.toLocaleString(),
      unit: unit("cases"),
    },
    types: {
      value: String(CLINIC_STATS.laserTypes),
      unit: unit("types"),
    },
    satisfaction: {
      value: String(CLINIC_STATS.satisfactionRate),
      unit: unit("percent"),
    },
    ratio: {
      value: String(CLINIC_STATS.doctorPatientRatio),
      unit: unit("ratio"),
    },
  };
}
