import fs from "node:fs";

const inputPath = process.argv[2] ?? "/tmp/equipment3_zh_tw_body_translations_retry2.json";
const outputPath = process.argv[3] ?? "/tmp/equipment3_zh_tw_body_translations_final.json";
const payload = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const byId = new Map(payload.items.map((item) => [item.id, item]));

byId.get(150003).translation.detail = "Enlighten III 為 Cutera 公司的三重波長（532nm·1064nm·670nm）皮秒·奈秒雙脈衝雷射。皮秒（超短脈衝）可將色素顆粒分解至奈米等級，奈秒脈衝則可到達較深層的色素。可用於肝斑、斑點、刺青、脂漏性角化症、日光性黑子等多種色素性病變，並盡量減少對周邊正常組織的影響。";
byId.get(180030).translation.detail = "RE20 為含有皮膚再生成分的高階肌膚增強療程，著重於協助受損肌膚修復並補充水分。可促進細胞再生並強化皮膚屏障，幫助肌膚恢復健康狀態。透過降低刺激，敏感性肌膚亦可接受；療程後可恢復日常作息。持續進行療程可望改善膚況，實際成效與適用性因人而異。";
byId.get(180036).translation.desc = "在局部麻醉後，於腋下兩處各做約3㎜的切口，再插入金屬管（cannula）以刮除汗腺的多汗症療程。著重於去除汗腺，並盡量降低代償性多汗的風險；實際狀況因人而異。";
byId.get(180036).translation.detail = "Liposet 抽吸術為在局部麻醉後，於腋下兩處各做約3㎜的切口，插入金屬管（cannula）以刮除汗腺的多汗症療程。所使用的金屬管在貼近真皮側的部位設有吸入口，能較精細地去除密集分布於皮下脂肪層與真皮層交界處的汗腺。由於該交界處以往以既有療法較難確實去除汗腺，效果不易理想；針對接受 Liposet 抽吸術的患者之調查顯示，術後可能出現代償性多汗，實際狀況因人而異。療程後隔天即可恢復日常生活；若穿著高彈性纖維製成的貼身衣物約2週，有助於減少腋下皮膚鬆垮，實際情況仍因人而異。";

fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
console.log(JSON.stringify({ outputPath, correctedIds: [150003, 180030, 180036] }));
