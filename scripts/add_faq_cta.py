"""i18n.ja.ts / i18n.zh.ts faq 섹션에 ctaLabel/ctaDesc 추가"""

patches = {
    "client/src/lib/i18n.ja.ts": (
        '          { q: "施術の間隔と回数はどのくらいですか？", a: "最初は2〜4週間隔で4回程度の集中施術をお勧めし、その後は3〜6ヶ月ごとのメンテナンス施術で効果を長く維持することができます。" },\n        ]\n      },\n    ]\n  },\n  contact:',
        '          { q: "施術の間隔と回数はどのくらいですか？", a: "最初は2〜4週間隔で4回程度の集中施術をお勧めし、その後は3〜6ヶ月ごとのメンテナンス施術で効果を長く維持することができます。" },\n        ]\n      },\n    ],\n    ctaLabel: "LINEでお問い合わせ",\n    ctaDesc: "他にご質問はありますか？LINEでお気軽にお問い合わせください。",\n  },\n  contact:',
    ),
    "client/src/lib/i18n.zh.ts": (
        '          { q: "治疗间隔和次数是多少？", a: "建议最初每2-4周进行4次集中治疗，之后每3-6个月进行一次维护治疗，可以长期保持效果。" },\n        ]\n      },\n    ]\n  },\n  contact:',
        '          { q: "治疗间隔和次数是多少？", a: "建议最初每2-4周进行4次集中治疗，之后每3-6个月进行一次维护治疗，可以长期保持效果。" },\n        ]\n      },\n    ],\n    ctaLabel: "微信咨询",\n    ctaDesc: "还有其他问题吗？请通过WeChat随时联系我们。",\n  },\n  contact:',
    ),
}

for path, (old, new) in patches.items():
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    if old in content:
        content = content.replace(old, new, 1)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"{path}: OK")
    else:
        print(f"{path}: NOT FOUND")
