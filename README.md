# 🚀 Daily LeetCode · 秋招冲刺

[![LeetCode](https://img.shields.io/badge/LeetCode-中国站-ffa116?logo=leetcode&logoColor=white)](https://leetcode.cn/)
[![Repo](https://img.shields.io/badge/GitHub-Daily--LeetCode-181717?logo=github)](https://github.com/SmallDuck-lang/Daily-LeetCode)

> 目标：**2026 秋招期间系统刷完 LeetCode Hot 100 高频题**，每天记录代码 + 错题笔记。

---

## 📊 刷题统计

<!-- STATS:START -->
> 请先在 `config.json` 填入你的 LeetCode 中国站用户名，然后运行：
> ```bash
> python scripts/update_readme.py
> ```
> 或配置 GitHub Actions 实现每日自动更新。
<!-- STATS:END -->

---

## 🗂️ 目录结构

```text
Daily-LeetCode
├── .github/workflows/        # 可选：自动统计 GitHub Actions
├── notes/                    # 每日错题笔记（手写沉淀）
│   ├── 2026-10/
│   │   └── 2026-10-08.md
│   └── TEMPLATE.md
├── problems/                 # LeetHub 自动同步 / 手动存放题解代码
├── scripts/
│   └── update_readme.py      # 自动拉取 LeetCode 统计并更新 README
├── config.json               # 你的 LeetCode 用户名等配置
└── README.md                 # 本文件
```

---

## 🎯 10 月专题规划（对应秋招计划）

| 阶段 | 日期 | 专题 | 算法重点 |
|------|------|------|---------|
| 阶段 1 | 10.08–10.15 | 简历抢救 + 哈希/双指针/滑动窗口 | 两数之和、三数之和、滑动窗口、异位词分组 |
| 阶段 2 | 10.16–10.22 | 链表 + Vue 原理 | 反转链表、环形链表、LRU 缓存 |
| 阶段 3 | 10.23–10.29 | 二叉树 + 浏览器/网络 | 层序遍历、LCA、路径总和 |
| 阶段 4 | 10.30–10.31 | 月度总复盘 + 11 月滚动规划 | DP 入门、错题重做 |

> 详细每日任务见 `E:\秋招计划.html`（之前生成的交互式日历页面）。

---

## 🛠️ 使用方式

### 方案 A：自动同步（推荐）

1. **在 Edge 中安装 Chrome 扩展**：
   - 打开 `edge://extensions/`
   - 左下角打开 **开发人员模式** 和 **允许来自其他应用商店的扩展**
   - 访问 Chrome 应用商店，搜索 **LeetHub**（或 **LeetHub v2**）
   - 点击“添加”并授权访问 `github.com`
2. 在 LeetHub 设置中选择仓库 `SmallDuck-lang/Daily-LeetCode`
3. 在 leetcode.cn 做题并提交通过后，代码会自动 push 到本仓库

> 如果 Chrome 应用商店打不开，可以先使用方案 B，之后有空再折腾 CRX 文件安装。

### 方案 B：手动 commit（最稳）

每 AC 一题后：

```bash
# 示例：206. 反转链表
echo "你的代码" > problems/0206-reverse-linked-list.js
git add .
git commit -m "feat: 206. 反转链表 (链表)"
git push
```

---

## 📝 每日错题笔记规范

每天刷完题后花 10 分钟，按模板写 `notes/2026-10/2026-10-08.md`：

- **题目链接**
- **思路**：你是怎么想到解法的
- **卡点**：哪里卡住了、为什么
- **一句话总结**：方便下次快速回忆

模板参考：`notes/TEMPLATE.md`

---

## 🔧 自动更新 README 统计

1. 修改 `config.json`：
   ```json
   {
     "leetcode_cn_username": "你的 LeetCode 中国站用户名"
   }
   ```
2. 运行脚本：
   ```bash
   python scripts/update_readme.py
   ```
3. 若启用了 `.github/workflows/update-stats.yml`，GitHub 每天会自动跑一次。

---

## 💡 提交信息规范

```text
feat: 206. 反转链表 (链表)
fix: 001. 两数之和 优化为一次遍历
notes: 2026-10-08 错题笔记
docs: 更新 README 进度
```

---

## 🏆 给自己定个小目标

- [x] 搭建仓库骨架
- [ ] 10 月完成 50+ 题
- [ ] Hot 100 高频 60 题全部 AC
- [ ] 拿到满意的秋招 offer

**加油！**
