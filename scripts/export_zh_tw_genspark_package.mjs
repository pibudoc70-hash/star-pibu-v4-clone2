import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");

const outputDir = "/home/ubuntu/Downloads/star-pibu_zh_tw_faq_translation_package";
const batchDir = path.join(outputDir, "input_batches");
const batchSize = 6;

const quoteReference = {
  heading: "診療與療程資訊",
  locationLabel: "地址",
  location: "韓國釜山廣域市釜山鎮區 Seomyeon-ro 74，愛奧城市大廈 2、4樓",
  hoursLabel: "診療時間",
  hours: "週一至週五 10:00–19:00 · 週六 09:30–15:00 · 週日及國定假日休診 · 平日午休 13:00–14:00",
  providerLabel: "療程主體",
  provider: "由皮膚科專科醫師親自負責從諮詢到療程的全過程。",
  painManagementLabel: "疼痛與鎮靜管理",
  painManagement: "針對需要疼痛管理的療程，醫師會在諮詢後評估表面麻醉膏、局部麻醉或鎮靜等合適方式，並由皮膚科專科醫師管理全過程。",
};

const prompt = `# 스타피부과 한국어 FAQ → 대만 번체 중국어(zh-TW) 현지화 지침

## 역할과 목표
당신은 한국 의료기관 웹사이트의 전문 의료 콘텐츠 현지화 번역가입니다. 첨부된 JSON 배치의 한국어 FAQ를 **대만 사용자가 자연스럽게 읽을 수 있는 번체 중국어**로 번역하세요. 중국어 간체 문장을 기계적으로 번체로 바꾸지 말고, 대만 의료 웹사이트에서 통용되는 어휘와 문장 흐름으로 현지화하세요.

## 절대 준수 사항
1. 각 페이지의 id, slug, faqIndex, FAQ 문항 수와 순서를 절대 바꾸거나 누락하지 마세요.
2. 한국어 원문의 수치, 시간, 횟수, 기간, 파장, 용량, 층수, 전화번호는 바꾸지 마세요. 예: 10–20분, 3회, 3–6個月, 755nm, 1064nm, 2·4樓. 단위만 대만식 문맥에 맞게 현지화할 수 있습니다.
3. 원문에 있는 부산·서면·스타피부과 언급은 자연스럽게 보존하고 삭제하지 마세요. 원문에 없는 지역·병원 주장을 새로 추가하지 마세요.
4. 최상급·보증·확정 효과 표현(예: 最好, 保證, 一定有效, 零副作用)을 추가하지 마세요. 원문의 한계·주의 문구를 보존하고, 결과/효果의 개인차는 **「效果因人而異」** 또는 문맥상 동등한 대만 번체 표현으로 유지하세요.
5. 마취·진정은 원문에 있는 경우에만 번역하세요. 마취과 전문의 상주, 보장된 안전성처럼 원문에 없는 사실을 추가하지 마세요.
6. 장비명은 existingNames의 현재 사이트 표기를 우선 참고하세요. 번체 전용 이름이 없으면 브랜드 영문을 보존하거나 대만식 자연스러운 번체 표기를 제안하되, 임의의 공식 명칭을 단정하지 마세요.
7. BBL 스킨타이트는 페이지 내 FAQ에서 **「BBL緊膚」**를 사용하세요. 이 표기는 검수 승인된 간체 「BBL紧肤」의 대만 번체 대응 표기입니다.
8. 고정 인용 블록은 이미 사이트 코드에 현지화되어 있으므로 번역 결과에 포함하지 마세요. 아래 용어 기준은 FAQ 문체 통일을 위해서만 참고하세요.

## JSON 출력 규칙
입력 JSON의 pages 배열과 같은 순서로 아래 구조의 **순수 JSON만** 반환하세요. Markdown, 설명, 코드 블록을 절대 추가하지 마세요.

{
  "pages": [
    {
      "id": 120001,
      "slug": "example-slug",
      "treatmentNameZhTwSuggestion": "대만 번체 장비명 제안 또는 기존 영문 브랜드명",
      "faqs": [
        {
          "faqIndex": 1,
          "question": "번체 중국어 질문",
          "answer": "번체 중국어 답변"
        }
      ]
    }
  ]
}

## 제출 전 자체 점검
- 각 페이지의 FAQ 개수·faqIndex가 원문과 같은가?
- 모든 숫자 및 반복 횟수가 원문과 같은가?
- 한국어·간체 중국어가 남아 있지 않은가?
- 「效果因人而異」 계열의 개인차 표현과 원문의 주의 사항이 보존됐는가?
- 장비명을 일관되게 표기했는가?
`;

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(batchDir, { recursive: true });

const connection = await mysql.createConnection(databaseUrl);
try {
  const [rows] = await connection.execute(`
    SELECT id, slug, category, name, nameEn, nameJa, nameZh, faqs
    FROM equipment3
    WHERE faqs IS NOT NULL AND JSON_LENGTH(faqs) > 0
    ORDER BY category, sortOrder, id
  `);

  const pages = rows.map((row) => {
    const faqs = JSON.parse(row.faqs);
    return {
      id: Number(row.id),
      slug: row.slug,
      categoryKo: row.category,
      treatmentNameKo: row.name,
      existingNames: {
        en: row.nameEn || "",
        ja: row.nameJa || "",
        zhCn: row.nameZh || "",
        zhTw: row.name === "BBL 스킨타이트" ? "BBL緊膚 (검수 승인 기준)" : "",
      },
      targetUrl: `/zh-tw/equipment3/${encodeURIComponent(row.slug)}?tab=${encodeURIComponent(row.category)}`,
      faqs: faqs.map((faq, index) => ({
        faqIndex: index + 1,
        questionKo: faq.question,
        answerKo: faq.answer,
      })),
    };
  });

  if (pages.length !== 72) throw new Error(`Expected 72 pages, received ${pages.length}`);
  const faqCount = pages.reduce((sum, page) => sum + page.faqs.length, 0);
  if (faqCount !== 279) throw new Error(`Expected 279 FAQs, received ${faqCount}`);

  fs.writeFileSync(path.join(outputDir, "01_genspark_prompt_ko.md"), prompt, "utf8");
  writeJson(path.join(outputDir, "02_fixed_quote_reference_zh_tw.json"), quoteReference);

  const outputSchema = {
    description: "Genspark에 각 input_batches 파일을 입력한 뒤 받아야 하는 번체 FAQ JSON 구조입니다.",
    schema: {
      pages: [
        {
          id: "number (input id와 동일)",
          slug: "string (input slug와 동일)",
          treatmentNameZhTwSuggestion: "string",
          faqs: [{ faqIndex: "number", question: "string", answer: "string" }],
        },
      ],
    },
  };
  writeJson(path.join(outputDir, "03_output_schema.json"), outputSchema);

  const manifest = [];
  for (let i = 0; i < pages.length; i += batchSize) {
    const number = String(i / batchSize + 1).padStart(2, "0");
    const batchPages = pages.slice(i, i + batchSize);
    const batch = {
      package: "star-pibu-zh-tw-faq-translation",
      batch: Number(number),
      instructionFile: "../01_genspark_prompt_ko.md",
      fixedQuoteReferenceFile: "../02_fixed_quote_reference_zh_tw.json",
      pages: batchPages,
    };
    const fileName = `batch_${number}_${batchPages[0].id}-${batchPages.at(-1).id}.json`;
    writeJson(path.join(batchDir, fileName), batch);
    manifest.push({ fileName: `input_batches/${fileName}`, pageCount: batchPages.length, faqCount: batchPages.reduce((sum, page) => sum + page.faqs.length, 0), ids: batchPages.map((page) => page.id) });
  }
  writeJson(path.join(outputDir, "04_batch_manifest.json"), manifest);

  const csvLines = [
    ["id", "category_ko", "slug", "target_url", "treatment_name_ko", "faq_index", "question_ko", "answer_ko", "question_zh_tw", "answer_zh_tw", "name_zh_tw_review", "numeric_check", "terminology_check", "review_status"].map(csvCell).join(","),
  ];
  for (const page of pages) {
    for (const faq of page.faqs) {
      csvLines.push([
        page.id, page.categoryKo, page.slug, page.targetUrl, page.treatmentNameKo, faq.faqIndex,
        faq.questionKo, faq.answerKo, "", "", "", "", "", "pending",
      ].map(csvCell).join(","));
    }
  }
  fs.writeFileSync(path.join(outputDir, "05_translation_comparison_template.csv"), `${csvLines.join("\n")}\n`, "utf8");

  const readme = `# 스타피부과 중국어 번체 FAQ 외부 AI 번역 패키지

이 패키지는 한국어 FAQ가 저장된 **72개 상세페이지, 279문항**을 대만 번체 중국어로 현지화하기 위한 입력 자료입니다.

## 사용 순서

1. 01_genspark_prompt_ko.md 전체를 Genspark의 첫 메시지로 붙여넣습니다.
2. 02_fixed_quote_reference_zh_tw.json을 함께 첨부하거나 붙여넣어 사이트의 기존 용어 기준을 전달합니다.
3. input_batches의 JSON 파일을 **한 번에 한 파일씩** 입력합니다. 한 배치는 6개 상세페이지이며, 총 12개 배치입니다.
4. Genspark가 반환한 순수 JSON을 파일명과 같은 번호로 저장합니다. 예: result_batch_01.json.
5. 05_translation_comparison_template.csv에 결과를 붙여넣어 숫자·장비명·개인차 표현을 검수합니다.
6. 검수한 결과 JSON을 전달하면 사이트의 faqsZhTw 필드에 안전하게 반영할 수 있습니다.

## 주의

- 간체 중국어 결과를 자동 변환해 사용하지 마세요.
- 페이지의 한국어 본문·URL·FAQ 순서는 변경하지 마세요.
- 현재 번체 전용 페이지 제목 필드가 없으므로 treatmentNameZhTwSuggestion은 검수용입니다. FAQ 본문 외에 페이지 제목을 자동 변경하지 마세요.
- BBL 스킨타이트 FAQ의 번체 표기는 BBL緊膚를 사용하도록 프롬프트에 명시돼 있습니다.
`;
  fs.writeFileSync(path.join(outputDir, "README_ko.md"), readme, "utf8");

  console.log(JSON.stringify({ outputDir, pages: pages.length, faqs: faqCount, batches: manifest.length }));
} finally {
  await connection.end();
}
