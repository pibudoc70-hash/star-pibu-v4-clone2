import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MAX_EQUIPMENT_FAQS, parseEquipmentFaqDrafts, type EquipmentFaq } from "@shared/equipmentFaq";

type EquipmentFaqEditorProps = {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
};

const EMPTY_FAQ: EquipmentFaq = { question: "", answer: "" };

export function EquipmentFaqEditor({ id, label, value, onChange }: EquipmentFaqEditorProps) {
  const faqs = parseEquipmentFaqDrafts(value);
  const editFaqs = faqs.length > 0 ? faqs : [EMPTY_FAQ];
  const questionKeys = editFaqs.map((faq) => faq.question.trim().replace(/\s+/g, " ").toLocaleLowerCase());
  const duplicateIndexes = new Set<number>();
  questionKeys.forEach((key, index) => {
    if (!key) return;
    if (questionKeys.indexOf(key) !== index) duplicateIndexes.add(index);
  });
  const incompleteCount = editFaqs.filter((faq) => !faq.question.trim() || !faq.answer.trim()).length;

  const update = (next: EquipmentFaq[]) => onChange(JSON.stringify(next));
  const updateEntry = (index: number, field: keyof EquipmentFaq, nextValue: string) => {
    update(editFaqs.map((faq, currentIndex) => currentIndex === index ? { ...faq, [field]: nextValue } : faq));
  };

  return (
    <fieldset className="space-y-4">
      <legend className="font-semibold text-slate-900">{label}</legend>
      <p className="text-xs text-slate-500">질문과 답변은 상세 페이지 및 FAQPage 구조화 데이터에 함께 노출됩니다. 빈 항목은 공개하지 않습니다.</p>
      {(incompleteCount > 0 || duplicateIndexes.size > 0) && (
        <p role="status" className="text-xs text-amber-700">
          {incompleteCount > 0 && `작성 중인 FAQ ${incompleteCount}개는 질문과 답변을 모두 입력해야 공개됩니다.`}
          {incompleteCount > 0 && duplicateIndexes.size > 0 && " "}
          {duplicateIndexes.size > 0 && `같은 질문 ${duplicateIndexes.size}개는 공개 FAQ와 구조화 데이터에서 한 번만 사용됩니다.`}
        </p>
      )}
      {editFaqs.map((faq, index) => (
        <div key={`${id}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor={`${id}-question-${index}`}>질문 {index + 1}</Label>
            {editFaqs.length > 1 && (
              <Button type="button" variant="ghost" size="sm" onClick={() => update(editFaqs.filter((_, currentIndex) => currentIndex !== index))} className="text-red-600 hover:text-red-700">
                <Trash2 className="mr-1 h-4 w-4" />삭제
              </Button>
            )}
          </div>
          <Input id={`${id}-question-${index}`} value={faq.question} onChange={(event) => updateEntry(index, "question", event.target.value)} placeholder="예: 시술 후 바로 일상생활이 가능한가요?" maxLength={500} />
          {duplicateIndexes.has(index) && <p className="text-xs text-amber-700">동일한 질문이 이미 있습니다. 질문을 구분해 주세요.</p>}
          <Label htmlFor={`${id}-answer-${index}`}>답변 {index + 1}</Label>
          <Textarea id={`${id}-answer-${index}`} value={faq.answer} onChange={(event) => updateEntry(index, "answer", event.target.value)} placeholder="의료진 검수 완료 문구를 입력하세요." rows={4} maxLength={4000} />
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => update([...editFaqs, EMPTY_FAQ])} disabled={editFaqs.length >= MAX_EQUIPMENT_FAQS} className="gap-1">
        <Plus className="h-4 w-4" />FAQ 추가
      </Button>
      {editFaqs.length >= MAX_EQUIPMENT_FAQS && <p className="text-xs text-slate-500">언어별 FAQ는 최대 {MAX_EQUIPMENT_FAQS}개까지 추가할 수 있습니다.</p>}
    </fieldset>
  );
}
