#!/usr/bin/env python3
"""
从 leetcode.cn 拉取最近 Accepted 提交，自动写入 problems/ 并推送到 GitHub。

用法：
    1. 登录 leetcode.cn
    2. 浏览器按 F12 -> Application/存储 -> Cookie -> https://leetcode.cn
    3. 复制 LEETCODE_SESSION 和 csrftoken 的值
    4. 在 PowerShell 中执行：
         $env:LEETCODE_COOKIE = "LEETCODE_SESSION=xxx; csrftoken=yyy"
         python scripts/sync_leetcode_cn.py
"""

import json
import os
import re
import subprocess
from pathlib import Path
from urllib import request, error
from datetime import datetime

ROOT = Path(__file__).resolve().parent.parent
PROBLEMS_DIR = ROOT / "problems"
STATE_FILE = PROBLEMS_DIR / ".sync_state.json"
CONFIG_PATH = ROOT / "config.json"

GRAPHQL_URL = "https://leetcode.cn/graphql/noj-go/"

# 语言 -> 文件后缀
LANG_EXT = {
    "javascript": "js",
    "typescript": "ts",
    "python": "py",
    "python3": "py",
    "c++": "cpp",
    "cpp": "cpp",
    "java": "java",
    "go": "go",
    "rust": "rs",
    "c": "c",
    "csharp": "cs",
}


def load_config():
    if not CONFIG_PATH.exists():
        return {}
    with CONFIG_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)


def graphql_query(query, variables, operation_name, cookie, csrf=None):
    payload = {
        "query": query,
        "variables": variables,
        "operationName": operation_name,
    }
    data = json.dumps(payload).encode("utf-8")
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": "https://leetcode.cn/",
        "Origin": "https://leetcode.cn",
        "Cookie": cookie,
    }
    if csrf:
        headers["x-csrftoken"] = csrf

    req = request.Request(GRAPHQL_URL, data=data, headers=headers, method="POST")
    try:
        with request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except error.HTTPError as e:
        body = e.read().decode("utf-8")[:500]
        raise RuntimeError(f"HTTP {e.code}: {body}") from e


def get_submissions(cookie, csrf, limit=100):
    query = """
    query submissionList($offset: Int!, $limit: Int!, $lastKey: String) {
      submissionList(offset: $offset, limit: $limit, lastKey: $lastKey) {
        lastKey
        hasNext
        submissions {
          id
          titleSlug
          title
          statusDisplay
          lang
          timestamp
          code
        }
      }
    }
    """
    variables = {"offset": 0, "limit": limit, "lastKey": None}
    result = graphql_query(query, variables, "submissionList", cookie, csrf)
    return result["data"]["submissionList"]


def run_git(args, check=True):
    return subprocess.run(["git"] + args, cwd=ROOT, check=check)


def main():
    cookie = os.environ.get("LEETCODE_COOKIE", "").strip()
    if not cookie:
        print("❌ 请先设置环境变量 LEETCODE_COOKIE")
        print('   示例：$env:LEETCODE_COOKIE = "LEETCODE_SESSION=xxx; csrftoken=yyy"')
        print()
        print("获取 Cookie 步骤：")
        print("   1. 登录 leetcode.cn")
        print("   2. 按 F12 -> Application/应用 -> Cookies -> https://leetcode.cn")
        print("   3. 复制 LEETCODE_SESSION 和 csrftoken 的值")
        return

    csrf_match = re.search(r"csrftoken=([^;]+)", cookie)
    csrf = csrf_match.group(1) if csrf_match else None

    print("🔄 正在从 leetcode.cn 拉取提交记录...")
    try:
        data = get_submissions(cookie, csrf, limit=100)
    except Exception as e:
        print(f"❌ 拉取失败：{e}")
        print("   常见原因：Cookie 过期、未登录、或网络连不上 leetcode.cn")
        return

    submissions = data.get("submissions", [])
    if not submissions:
        print("⚠️ 没有获取到提交记录，请检查 Cookie 是否有效。")
        return

    accepted = [s for s in submissions if s.get("statusDisplay") == "Accepted"]
    print(f"📊 获取到 {len(submissions)} 条提交，其中 Accepted {len(accepted)} 条。")

    # 每个题目只保留最新一次 Accepted
    latest_by_slug = {}
    for s in accepted:
        slug = s["titleSlug"]
        ts = s.get("timestamp", 0) or 0
        if slug not in latest_by_slug or ts > latest_by_slug[slug].get("timestamp", 0):
            latest_by_slug[slug] = s

    # 读取已同步状态
    state = {}
    if STATE_FILE.exists():
        try:
            with STATE_FILE.open("r", encoding="utf-8") as f:
                state = json.load(f)
        except json.JSONDecodeError:
            state = {}

    new_files = []
    for slug, sub in latest_by_slug.items():
        sub_id = str(sub["id"])
        if state.get(slug) == sub_id:
            continue  # 已经同步过

        lang = (sub.get("lang") or "javascript").lower()
        ext = LANG_EXT.get(lang, lang)
        filename = f"{slug}.{ext}"
        filepath = PROBLEMS_DIR / filename

        code = sub.get("code", "")
        if not code.strip():
            print(f"⚠️ {slug} 没有代码内容，跳过")
            continue

        filepath.write_text(code, encoding="utf-8")
        state[slug] = sub_id
        new_files.append(filename)
        print(f"  ✅ {filename}")

    if not new_files:
        print("👍 没有新的 Accepted 提交需要同步。")
        return

    # 保存同步状态
    STATE_FILE.write_text(json.dumps(state, indent=2, ensure_ascii=False), encoding="utf-8")

    # 提交并推送
    date_str = datetime.now().strftime("%Y-%m-%d")
    msg = f"feat: sync {len(new_files)} leetcode solution(s) on {date_str}"
    try:
        run_git(["add", "."])
        run_git(["commit", "-m", msg])
        run_git(["push"])
        print(f"🚀 已推送 {len(new_files)} 个题解到 GitHub！")
    except subprocess.CalledProcessError as e:
        print(f"❌ git 提交/推送失败：{e}")
        print("   请检查网络连接（国内访问 GitHub 可能需要代理）。")


if __name__ == "__main__":
    main()
