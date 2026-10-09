#!/usr/bin/env python3
"""
根据秋招计划（E:\\秋招计划.html）生成每日错题笔记模板与题目索引。

运行后会在：
  - notes/题目索引.md            ← 所有题目的英文 slug 速查表
  - notes/2026-10/2026-10-XX.md  ← 每天一份笔记模板（含题目与文件名）
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NOTES_DIR = ROOT / "notes" / "2026-10"
INDEX_FILE = ROOT / "notes" / "题目索引.md"

# 每日安排：(阶段标签, 专题, 题目列表)
# 题目：(编号, 中文名, 英文slug, 难度)
SCHEDULE = {
    8:  ("简历抢救 · 哈希启动", "哈希表",
         [(1,"两数之和","two-sum","简单"),
          (49,"字母异位词分组","group-anagrams","中等")]),
    9:  ("简历抢救 · 哈希", "哈希表",
         [(128,"最长连续序列","longest-consecutive-sequence","中等"),
          (167,"两数之和 II","two-sum-ii-input-array-is-sorted","简单")]),
    10: ("哈希 · 双指针", "哈希 / 双指针",
         [(3,"无重复字符的最长子串","longest-substring-without-repeating-characters","中等"),
          (15,"三数之和","3sum","中等")]),
    11: ("周日 · 错题重做日", "错题重做", []),
    12: ("双指针 · 滑动窗口", "双指针 / 滑动窗口",
         [(11,"盛最多水的容器","container-with-most-water","中等"),
          (283,"移动零","move-zeroes","简单")]),
    13: ("滑动窗口", "滑动窗口",
         [(560,"和为 K 的子数组","subarray-sum-equals-k","中等"),
          (239,"滑动窗口最大值","sliding-window-maximum","困难")]),
    14: ("滑动窗口 · 收官", "滑动窗口",
         [(76,"最小覆盖子串","minimum-window-substring","困难")]),
    15: ("周复盘 · 简历终稿", "自测", []),
    16: ("链表启动 · Vue 原理", "链表",
         [(206,"反转链表","reverse-linked-list","简单"),
          (21,"合并两个有序链表","merge-two-sorted-lists","简单")]),
    17: ("链表", "链表",
         [(141,"环形链表","linked-list-cycle","简单"),
          (142,"环形链表 II","linked-list-cycle-ii","中等")]),
    18: ("周日 · 错题重做日", "错题重做", []),
    19: ("链表 · Vue", "链表",
         [(19,"删除链表倒数第 N 个结点","remove-nth-node-from-end-of-list","中等"),
          (160,"相交链表","intersection-of-two-linked-lists","简单")]),
    20: ("链表 · Vue Router", "链表",
         [(146,"LRU 缓存","lru-cache","中等")]),
    21: ("栈", "栈",
         [(20,"有效的括号","valid-parentheses","简单"),
          (155,"最小栈","min-stack","中等")]),
    22: ("队列 · Vue3", "队列",
         [(232,"用栈实现队列","implement-queue-using-stacks","简单")]),
    23: ("二叉树启动 · 浏览器", "二叉树",
         [(102,"二叉树层序遍历","binary-tree-level-order-traversal","中等"),
          (104,"二叉树最大深度","maximum-depth-of-binary-tree","简单")]),
    24: ("二叉树 · 浏览器", "二叉树",
         [(226,"翻转二叉树","invert-binary-tree","简单"),
          (101,"对称二叉树","symmetric-tree","简单")]),
    25: ("周日 · 错题重做日", "错题重做", []),
    26: ("二叉树 · HTTP", "二叉树",
         [(236,"最近公共祖先","lowest-common-ancestor-of-a-binary-tree","中等"),
          (94,"中序遍历","binary-tree-inorder-traversal","简单")]),
    27: ("二叉树 · 网络", "二叉树",
         [(199,"右视图","binary-tree-right-side-view","中等"),
          (105,"前序中序构建二叉树","construct-binary-tree-from-preorder-and-inorder-traversal","中等")]),
    28: ("回溯入门 · 跨域", "回溯",
         [(112,"路径总和","path-sum","简单"),
          (113,"路径总和 II","path-sum-ii","中等")]),
    29: ("DP 热身 · 安全", "动态规划",
         [(70,"爬楼梯","climbing-stairs","简单"),
          (118,"杨辉三角","pascals-triangle","简单")]),
    30: ("月度总复盘", "复盘", []),
    31: ("滚动规划日", "动态规划",
         [(198,"打家劫舍","house-robber","中等")]),
}

WEEKDAYS = {8:"四",9:"五",10:"六",11:"日",12:"一",13:"二",14:"三",15:"四",
            16:"五",17:"六",18:"日",19:"一",20:"二",21:"三",22:"四",
            23:"五",24:"六",25:"日",26:"一",27:"二",28:"三",29:"四",
            30:"五",31:"六"}


def lc_url(slug: str) -> str:
    return f"https://leetcode.cn/problems/{slug}/"


def build_daily_note(day, label, topic, problems):
    wd = WEEKDAYS[day]
    date_str = f"2026-10-{day:02d}"
    lines = [
        f"# {date_str} · {label}",
        "",
        f"**日期**：2026 年 10 月 {day} 日（星期{wd}）  ",
        f"**专题**：{topic}  ",
        "**文件命名规则**：`problems/<英文slug>.js`（如 `two-sum.js`）",
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
            "## 今日题目（自选 / 错题）",
            "",
            "> 错题重做日 / 自测日。从 `notes/题目索引.md` 或自己的错题本里挑选 3-6 题。",
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
        "# 题目索引 · 2026 年 10 月",
        "",
        "> 每天 AC 后，把代码保存为 `problems/<英文slug>.js`，再 `git add` + `git commit`。",
        "> **英文 slug 怎么找**：从力扣题目 URL 复制最后一段，例如 `https://leetcode.cn/problems/two-sum/` → `two-sum`。",
        "",
        "## 文件命名速查",
        "",
        "| 日期 | 编号 | 题目 | 难度 | 英文 slug | 文件名 |",
        "|------|------|------|------|-----------|--------|",
    ]
    for day in sorted(SCHEDULE.keys()):
        _, _, problems = SCHEDULE[day]
        for n, name, slug, diff in problems:
            lines.append(f"| 10.{day:02d} | {n} | {name} | {diff} | `{slug}` | `{slug}.js` |")

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
        path = NOTES_DIR / f"2026-10-{day:02d}.md"
        path.write_text(build_daily_note(day, label, topic, problems), encoding="utf-8")
        count = len(problems) if problems else "自选"
        print(f"生成：{path.relative_to(ROOT)}（{count} 题）")


if __name__ == "__main__":
    main()
