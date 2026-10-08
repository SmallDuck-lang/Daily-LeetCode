#!/usr/bin/env python3
"""
拉取 LeetCode 中国站公开统计，更新 README.md 中的统计区域。

使用方法：
    1. 在 config.json 中填入你的 leetcode_cn_username
    2. 运行：python scripts/update_readme.py
    3. 检查 README.md 变更后提交
"""

import json
import re
from pathlib import Path
from urllib import request

ROOT = Path(__file__).resolve().parent.parent
CONFIG_PATH = ROOT / "config.json"
README_PATH = ROOT / "README.md"

GRAPHQL_URL = "https://leetcode.cn/graphql/"
QUERY = """
query userProblemsSolved($userSlug: String!) {
  userProfileUserQuestionProgressV2(userSlug: $userSlug) {
    numAcceptedQuestions {
      difficulty
      count
    }
  }
}
"""


def get_stats(username: str):
    """请求 LeetCode 中国站 GraphQL 接口获取通过题目统计。"""
    payload = {
        "operationName": "userProblemsSolved",
        "variables": {"userSlug": username},
        "query": QUERY,
    }
    data = json.dumps(payload).encode("utf-8")
    req = request.Request(
        GRAPHQL_URL,
        data=data,
        headers={
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Referer": f"https://leetcode.cn/u/{username}/",
        },
        method="POST",
    )
    try:
        with request.urlopen(req, timeout=15) as resp:
            result = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        raise RuntimeError(f"请求 LeetCode 接口失败：{e}") from e

    if result.get("errors"):
        raise RuntimeError(f"GraphQL 错误：{result['errors']}")

    accepted = result["data"]["userProfileUserQuestionProgressV2"]["numAcceptedQuestions"]
    stats = {"ALL": 0, "EASY": 0, "MEDIUM": 0, "HARD": 0}
    for item in accepted:
        difficulty = item["difficulty"]
        count = item["count"]
        stats[difficulty] = count
        stats["ALL"] += count
    return stats


def build_stats_block(username: str, stats: dict) -> str:
    total = stats["ALL"]
    easy = stats["EASY"]
    medium = stats["MEDIUM"]
    hard = stats["HARD"]
    profile_url = f"https://leetcode.cn/u/{username}/"
    return f"""<!-- STATS:START -->
| 总通过 | 简单 | 中等 | 困难 | 主页 |
|--------|------|------|------|------|
| **{total}** | {easy} | {medium} | {hard} | [{username}]({profile_url}) |

> 数据来自 LeetCode 中国站公开接口，由 `scripts/update_readme.py` 自动生成。
> 上次更新时间：见本文件提交记录。
<!-- STATS:END -->"""


def build_fallback_block() -> str:
    return """<!-- STATS:START -->
> 自动统计暂未成功。请检查 `config.json` 中的 `leetcode_cn_username` 是否为你的 LeetCode 中国站用户名，
> 并运行 `python scripts/update_readme.py` 手动更新。
<!-- STATS:END -->"""


def main():
    if not CONFIG_PATH.exists():
        print(f"未找到 {CONFIG_PATH}，请先创建配置文件。")
        return

    with CONFIG_PATH.open("r", encoding="utf-8") as f:
        config = json.load(f)

    username = config.get("leetcode_cn_username", "").strip()
    if not username or username == "你的LeetCode中国站用户名":
        print("请先在 config.json 中填入你的 LeetCode 中国站用户名。")
        return

    try:
        stats = get_stats(username)
        new_block = build_stats_block(username, stats)
        print(f"成功获取统计：{stats}")
    except Exception as e:
        print(f"获取统计失败：{e}")
        new_block = build_fallback_block()

    readme = README_PATH.read_text(encoding="utf-8")
    pattern = re.compile(r"<!-- STATS:START -->.*?<!-- STATS:END -->", re.DOTALL)
    if not pattern.search(readme):
        print("README.md 中未找到 <!-- STATS:START --> 标记，无法插入统计。")
        return

    readme = pattern.sub(new_block, readme)
    README_PATH.write_text(readme, encoding="utf-8")
    print("README.md 已更新。")


if __name__ == "__main__":
    main()
