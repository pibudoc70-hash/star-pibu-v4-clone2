/**
 * EquipmentPanel.tsx
 * 장비 패널 컴포넌트 — 접기/펼치기 + 상세 모달 포함.
 * TreatmentsEquipmentSection에서 분리된 독립 컴포넌트.
 */
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import OptimizedImage from "@/components/OptimizedImage";
import { useLang } from "@/contexts/LangContext";
import type { Equipment } from "@/types/treatment";

interface EquipmentPanelProps {
  items: Equipment[];
  catId: string;
}

export default function EquipmentPanel({ items, catId }: EquipmentPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedEq, setSelectedEq] = useState<Equipment | null>(null);
  const visible = expanded ? items : items.slice(0, 4);
  const { lang, t } = useLang();
  const tr = t.treatments;

  function getEqText(eq: Equipment, field: "desc" | "detail" | "sessions" | "effect") {
    const base = eq[field] ?? "";
    const en   = eq[`${field}En` as keyof Equipment] as string | undefined;
    const ja   = eq[`${field}Ja` as keyof Equipment] as string | undefined;
    const zh   = eq[`${field}Zh` as keyof Equipment] as string | undefined;
    if (lang === "en" && en) return en;
    if (lang === "ja" && ja) return ja;
    if (lang === "zh" && zh) return zh;
    return base;
  }

  function getEqName(eq: Equipment) {
    if (lang === "ja" && eq.nameJa) return eq.nameJa;
    if (lang === "zh" && eq.nameZh) return eq.nameZh;
    return eq.name;
  }

  return (
    <div className="space-y-3">
      {visible.map((eq, i) => (
        <div
          key={`${catId}-eq-${i}`}
          className="flex items-start gap-3 p-3 rounded-xl bg-white/60 hover:bg-white/90 border border-slate-100 cursor-pointer transition-all duration-200 hover:shadow-md group"
          onClick={() => setSelectedEq(eq)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setSelectedEq(eq)}
          aria-label={`${eq.name} 장비 상세 보기`}
        >
          <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
            <OptimizedImage
              src={eq.image}
              alt={eq.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-slate-400 font-medium tracking-wider uppercase mb-0.5">{eq.brand}</div>
            <div className="text-sm font-semibold text-slate-800 group-hover:text-[#2a5298] transition-colors">
              {getEqName(eq)}
            </div>
            <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">{getEqText(eq, "desc")}</div>
          </div>
        </div>
      ))}

      {items.length > 4 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-2 text-xs text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1 transition-colors"
          aria-expanded={expanded}
        >
          {expanded ? (
            <><ChevronUp size={14} />{tr?.collapseBtn ?? "접기"}</>
          ) : (
            <><ChevronDown size={14} />{tr?.moreBtn ?? `+${items.length - 4}개 더 보기`}</>
          )}
        </button>
      )}

      {/* 장비 상세 모달 */}
      {selectedEq && (
        <Dialog open={!!selectedEq} onOpenChange={() => setSelectedEq(null)}>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogTitle className="sr-only">{selectedEq.name} 상세 정보</DialogTitle>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                  <OptimizedImage
                    src={selectedEq.image}
                    alt={selectedEq.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium tracking-wider uppercase">{selectedEq.brand}</div>
                  <h3 className="text-lg font-bold text-slate-800 mt-0.5">{getEqName(selectedEq)}</h3>
                  <p className="text-sm text-slate-600 mt-1">{getEqText(selectedEq, "desc")}</p>
                </div>
              </div>
              {getEqText(selectedEq, "detail") && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-1">{tr?.equipmentDetailPending ?? "상세 설명"}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{getEqText(selectedEq, "detail")}</p>
                </div>
              )}
              {getEqText(selectedEq, "sessions") && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-1">{tr?.modalSessions ?? "권장 횟수"}</h4>
                  <p className="text-sm text-slate-600">{getEqText(selectedEq, "sessions")}</p>
                </div>
              )}
              {getEqText(selectedEq, "effect") && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-1">{tr?.modalEffect ?? "기대 효과"}</h4>
                  <p className="text-sm text-slate-600">{getEqText(selectedEq, "effect")}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
