// i18n.ts — 조립 파일 (STRUCT-I18N-6)
// 타입/상수는 i18n.types.ts, 언어 데이터는 i18n.{lang}.ts에서 관리
// 기존 import 경로 유지: import { i18n, Lang, ... } from "@/lib/i18n"

export type { Lang, I18nContent } from "./i18n.types";
export { langLabels, langCodes, langFlags } from "./i18n.types";

import type { Lang, I18nContent } from "./i18n.types";
import { ko } from "./i18n.ko";
import { en } from "./i18n.en";
import { ja } from "./i18n.ja";
import { zh } from "./i18n.zh";
import { zhTW } from "./i18n.zh-TW";

export const i18n: Record<Lang, I18nContent> = { ko, en, ja, zh, "zh-TW": zhTW };
