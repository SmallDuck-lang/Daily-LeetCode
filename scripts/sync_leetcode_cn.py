#!/usr/bin/env python3
"""
从 leetcode.cn 拉取最近 Accepted 提交，自动写入 problems/ 并推送到 GitHub。

用法：
    1. 登录 leetcode.cn
    2. 浏览器按 F12 -> Application/应用 -> Cookies -> https://leetcode.cn
    3. 复制 LEETCODE_SESSION 和 csrftoken 的值
    4. 在 PowerShell 中执行：
         $env:LEETCODE_COOKIE = "LEETCODE_SESSION=xxx; csrftoken=yyy"
         python scripts/sync_leetcode_cn.py
"""

import json
import os
import re
import subprocess
import sys
import traceback
from pathlib import Path
from urllib import request, error
from datetime import datetime

if sys.version_info < (3, 8):
    sys.exit("需要 Python 3.8 或更高版本，当前版本：" + ".".join(map(str, sys.version_info[:3])))

# Windows GBK 终端兼容：强制输出流为 UTF-8，避免 emoji/中文打印崩溃
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

ROOT = Path(__file__).resolve().parent.parent
PROBLEMS_DIR = ROOT / "problems"
STATE_FILE = PROBLEMS_DIR / ".sync_state.json"
CONFIG_PATH = ROOT / "config.json"

GRAPHQL_URL = "https://leetcode.cn/graphql/"

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
        body = e.read().decode("utf-8")[:800]
        raise RuntimeError(f"HTTP {e.code}: {body}") from e


def get_recent_ac_submissions(username, cookie, csrf, limit=50):
    """获取用户最近 Accepted 提交列表（不含代码）。"""
    query = """
    query recentAcSubmissions($username: String!, $limit: Int!) {
      recentAcSubmissionList(username: $username, limit: $limit) {
        id
        title
        titleSlug
        timestamp
      }
    }
    """
    variables = {"username": username, "limit": limit}
    result = graphql_query(query, variables, "recentAcSubmissions", cookie, csrf)
    return result.get("data", {}).get("recentAcSubmissionList", [])


def get_submission_code(submission_id, cookie, csrf):
    """根据提交 ID 获取代码内容。"""
    query = """
    query submissionDetails($submissionId: Int!) {
      submissionDetails(submissionId: $submissionId) {
        runtime
        memory
        code
        lang {
          name
        }
      }
    }
    """
    variables = {"submissionId": int(submission_id)}
    result = graphql_query(query, variables, "submissionDetails", cookie, csrf)
    details = result.get("data", {}).get("submissionDetails", {})
    return details.get("code", ""), details.get("lang", {}).get("name", "")


def run_git(args, check=True):
    return subprocess.run(["git"] + args, cwd=ROOT, check=check)


def main():
    print(f"Python 版本：{sys.version}", flush=True)

    config = load_config()
    username = config.get("leetcode_cn_username", "").strip()
    if not username or username == "你的LeetCode中国站用户名":
        print("请先在 config.json 中填入你的 leetcode_cn_username", flush=True)
        return

    cookie = os.environ.get("LEETCODE_COOKIE", "").strip()
    print(f"Cookie 长度：{len(cookie)}", flush=True)
    if not cookie:
        print("请先设置环境变量 LEETCODE_COOKIE", flush=True)
        print('示例：$env:LEETCODE_COOKIE = "LEETCODE_SESSION=xxx; csrftoken=yyy"', flush=True)
        print("", flush=True)
        print("获取 Cookie 步骤：", flush=True)
        print("   1. 登录 leetcode.cn", flush=True)
        print("   2. 按 F12 -> Application/应用 -> Cookies -> https://leetcode.cn", flush=True)
        print("   3. 复制 LEETCODE_SESSION 和 csrftoken 的值", flush=True)
        return

    csrf_match = re.search(r"csrftoken=([^;]+)", cookie)
    csrf = csrf_match.group(1) if csrf_match else None

    print("正在从 leetcode.cn 拉取最近 Accepted 提交...", flush=True)
    try:
        submissions = get_recent_ac_submissions(username, cookie, csrf, limit=50)
    except Exception as e:
        print(f"拉取失败：{e}", flush=True)
        print("常见原因：Cookie 过期、未登录、或网络连不上 leetcode.cn", flush=True)
        return

    if not submissions:
        print("没有获取到提交记录，请检查 Cookie 是否有效。", flush=True)
        return

    # 每个题目只保留最新一次 Accepted
    latest_by_slug = {}
    for s in submissions:
        slug = s["titleSlug"]
        ts = s.get("timestamp", 0) or 0
        if slug not in latest_by_slug or ts > latest_by_slug[slug].get("timestamp", 0):
            latest_by_slug[slug] = s

    print(f"获取到 {len(submissions)} 条最近 AC 提交，涉及 {len(latest_by_slug)} 个不同题目。", flush=True)

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

        print(f"  正在获取 {slug} 的代码...", flush=True)
        try:
            code, lang_name = get_submission_code(sub["id"], cookie, csrf)
        except Exception as e:
            print(f"    跳过 {slug}（获取代码失败：{e}）", flush=True)
            continue

        if not code.strip():
            print(f"    跳过 {slug}（没有代码内容）", flush=True)
            continue

        lang = (lang_name or "javascript").lower().replace("+", "plusplus").replace("#", "sharp")
        if lang == "cplusplus":
            ext = "cpp"
        elif lang == "csharp":
            ext = "cs"
        else:
            ext = LANG_EXT.get(lang, lang if lang else "js")

        filename = f"{slug}.{ext}"
        filepath = PROBLEMS_DIR / filename
        filepath.write_text(code, encoding="utf-8")
        state[slug] = sub_id
        new_files.append(filename)
        print(f"  已更新 {filename}", flush=True)

    if not new_files:
        print("没有新的 Accepted 提交需要同步。", flush=True)
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
        print(f"已推送 {len(new_files)} 个题解到 GitHub！", flush=True)
    except subprocess.CalledProcessError as e:
        print(f"git 提交/推送失败：{e}", flush=True)
        print("请检查网络连接（国内访问 GitHub 可能需要代理）。", flush=True)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"脚本异常：{e}", flush=True)
        traceback.print_exc()
        input("\n按 Enter 键退出...")
