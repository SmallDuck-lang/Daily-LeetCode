#!/usr/bin/env python3
"""
根据秋招计划 11 月安排（E:\\秋招计划.html 中新增的 DATA_NOV），
生成 11 月每日错题笔记模板与题目索引。

只做纯增量：
  - notes/2026-11/2026-11-XX.md   ← 每天一份笔记模板（题目+英文文件名）
  - notes/题目索引-11月.md         ← 11 月题目 slug 速查表
不会修改 10 月的任何文件。
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NOTES_DIR = ROOT / "notes" / "2026-11"
INDEX_FILE = ROOT / "notes" / "题目索引-11月.md"

# 每日安排：(阶段标签, 专题, 题目列表)
# 题目：(编号, 中文名, 英文slug, 难度)
SCHEDULE = {
    14: ("DP深入启动 · CSS补强", "动态规划",
         [(322,"零钱兑换","coin-change","中等"),
          (300,"最长递增子序列","longest-increasing-subsequence","中等")]),
    15: ("周日 · 错题二刷日", "错题重做", []),
    16: ("DP · CSS", "动态规划",
         [(139,"单词拆分","word-break","中等"),
          (64,"最小路径和","minimum-path-sum","中等")]),
    17: ("DP · 项目补强", "动态规划",
         [(152,"乘积最大子数组","maximum-product-subarray","中等"),
          (1143,"最长公共子序列","longest-common-subsequence","中等")]),
    18: ("DP · 简历素材", "动态规划",
         [(5,"最长回文子串","longest-palindromic-substring","中等"),
          (62,"不同路径","unique-paths","中等")]),
    19: ("回溯启动 · Vue复习", "回溯",
         [(46,"全排列","permutations","中等"),
          (78,"子集","subsets","中等")]),
    20: ("回溯 · 浏览器复习", "回溯",
         [(39,"组合总和","combination-sum","中等"),
          (77,"组合","combinations","中等")]),
    21: ("堆 · 项目加功能", "堆",
         [(215,"数组中第K个最大元素","kth-largest-element-in-an-array","中等"),
          (347,"前K个高频元素","top-k-frequent-elements","中等")]),
    22: ("周日 · 二刷日", "错题重做", []),
    23: ("二分 · 工程化", "二分",
         [(704,"二分查找","binary-search","简单"),
          (33,"搜索旋转排序数组","search-in-rotated-sorted-array","中等")]),
    24: ("二分 · Vue3进阶", "二分",
         [(153,"寻找旋转排序数组中的最小值","find-minimum-in-rotated-sorted-array","中等"),
          (4,"寻找两个正序数组的中位数","median-of-two-sorted-arrays","困难")]),
    25: ("图/BFS · 安全", "图 / BFS",
         [(200,"岛屿数量","number-of-islands","中等"),
          (994,"腐烂的橘子","rotting-oranges","中等")]),
    26: ("Vue生态 · composable", "贪心 / DP",
         [(121,"买卖股票的最佳时机","best-time-to-buy-and-sell-stock","简单"),
          (53,"最大子数组和","maximum-subarray","中等")]),
    27: ("综合 · 工程化", "区间",
         [(56,"合并区间","merge-intervals","中等")]),
    28: ("收官 · Hot100复习", "二刷",
         [(206,"反转链表","reverse-linked-list","简单"),
          (146,"LRU 缓存","lru-cache","中等")]),
    29: ("周日 · 月度二刷", "错题重做", []),
    30: ("收官 · 滚动12月", "字符串",
         [(415,"字符串相加","add-strings","简单")]),
}

WEEKDAYS = {14:"六",15:"日",16:"一",17:"二",18:"三",19:"四",20:"五",
            21:"六",22:"日",23:"一",24:"二",25:"三",26:"四",27:"五",
            28:"六",29:"日",30:"一"}


def lc_url(slug: str) -> str:
    return f"https://leetcode.cn/problems/{slug}/"


def build_daily_note(day, label, topic, problems):
    wd = WEEKDAYS[day]
    date_str = f"2026-11-{day:02d}"
    lines = [
        f"# {date_str} · {label}",
        "",
        f"**日期**：2026 年 11 月 {day} 日（星期{wd}）  ",
        f"**专题**：{topic}  ",
        "**文件命名规则**：`problems/<英文slug>.js`（如 `coin-change.js`）",
        "",
        "---",
        "",
    ]
    if problems:
        lines.append("## 今日题目")
        lines.append("")
        for n, name, slug, diff in problems:
            lines += [
                f"### {n}. {name}（{diff}）",
                f"- **力扣链接**：[{n}. {name}]({lc_url(slug)})",
                f"- **保存为**：`problems/{slug}.js`",
                "- **思路**：",
                "- **卡点**：",
                "- **一句话总结**：",
                "",
            ]
    else:
        lines += [
            "## 今日题目（自选 / 错题二刷）",
            "",
            "> 二刷日。从 `notes/题目索引.md`（10月）、`notes/题目索引-11月.md` 或自己的错题本里挑 3 题。",
            "",
        ]
        for i in range(1, 4):
            lines += [
                f"### 题目 {i}",
                "- **题目链接**：",
                "- **保存为**：`problems/<slug>.js`",
                "- **思路**：",
                "- **卡点**：",
                "- **一句话总结**：",
                "",
            ]

    lines += ["## 今日感悟", "", "- ", ""]
    return "\n".join(lines)


def build_index():
    lines = [
        "# 题目索引 · 2026 年 11 月",
        "",
        "> 每天 AC 后，把代码保存为 `problems/<英文slug>.js`，再 `git add` + `git commit`。",
        "> **英文 slug 怎么找**：从力扣题目 URL 复制最后一段，例如 `https://leetcode.cn/problems/coin-change/` → `coin-change`。",
        "",
        "## 文件命名速查",
        "",
        "| 日期 | 编号 | 题目 | 难度 | 英文 slug | 文件名 |",
        "|------|------|------|------|-----------|--------|",
    ]
    for day in sorted(SCHEDULE.keys()):
        _, _, problems = SCHEDULE[day]
        for n, name, slug, diff in problems:
            lines.append(f"| 11.{day:02d} | {n} | {name} | {diff} | `{slug}` | `{slug}.js` |")

    lines += ["", "## 按专题分组", ""]
    topic_map = {}
    for day, (_, topic, problems) in SCHEDULE.items():
        for p in problems:
            topic_map.setdefault(topic, []).append(p)
    for topic, items in topic_map.items():
        lines.append(f"### {topic}")
        lines.append("")
        for n, name, slug, diff in items:
            lines.append(f"- [{n}. {name}]({lc_url(slug)}) → `problems/{slug}.js`")
        lines.append("")
    return "\n".join(lines)


def main():
    NOTES_DIR.mkdir(parents=True, exist_ok=True)
    INDEX_FILE.parent.mkdir(parents=True, exist_ok=True)

    INDEX_FILE.write_text(build_index(), encoding="utf-8")
    print(f"生成：{INDEX_FILE.relative_to(ROOT)}")

    for day in sorted(SCHEDULE.keys()):
        label, topic, problems = SCHEDULE[day]
        path = NOTES_DIR / f"2026-11-{day:02d}.md"
        path.write_text(build_daily_note(day, label, topic, problems), encoding="utf-8")
        count = len(problems) if problems else "自选"
        print(f"生成：{path.relative_to(ROOT)}（{count} 题）")


if __name__ == "__main__":
    main()
