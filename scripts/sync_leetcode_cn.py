#!/usr/bin/env python3
"""
从 leetcode.cn 拉取最近 Accepted 提交，自动写入 problems/ 并推送到 GitHub。

用法：
    双击 sync.bat 运行，按提示粘贴 Cookie 即可。
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

# Windows GBK 终端兼容：强制输出流为 UTF-8
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Windows 下 input 读取中文需要 UTF-8 编码
if sys.platform == "win32":
    try:
        sys.stdin.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

ROOT = Path(__file__).resolve().parent.parent
PROBLEMS_DIR = ROOT / "problems"
STATE_FILE = PROBLEMS_DIR / ".sync_state.json"

# leetcode.cn REST API：/api/submissions/ 返回提交记录列表
SUBMISSIONS_API = "https://leetcode.cn/api/submissions/?offset={offset}&limit={limit}"

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


def build_request(url, cookie, csrf=None):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Referer": "https://leetcode.cn/submissions/",
        "X-Requested-With": "XMLHttpRequest",
        "Cookie": cookie,
    }
    if csrf:
        headers["x-csrftoken"] = csrf
    return request.Request(url, headers=headers, method="GET")


def fetch_json(url, cookie, csrf=None):
    req = build_request(url, cookie, csrf)
    try:
        with request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except error.HTTPError as e:
        body = e.read().decode("utf-8")[:1000]
        raise RuntimeError(f"HTTP {e.code}: {body}") from e


def get_all_submissions(cookie, csrf, limit=100):
    """分页拉取最近提交记录。"""
    submissions = []
    offset = 0
    while len(submissions) < limit:
        batch_limit = min(20, limit - len(submissions))
        url = SUBMISSIONS_API.format(offset=offset, limit=batch_limit)
        data = fetch_json(url, cookie, csrf)
        if not isinstance(data, dict):
            raise RuntimeError(f"返回格式异常：{data}")

        # leetcode.cn 可能返回 {'submissions_dump': [...]}
        batch = data.get("submissions_dump") or data.get("submissions") or []
        if not batch:
            break

        submissions.extend(batch)
        if len(batch) < batch_limit:
            break
        offset += batch_limit
    return submissions


def run_git(args, check=True):
    return subprocess.run(["git"] + args, cwd=ROOT, check=check)


def prompt_cookie():
    print("==================================================", flush=True)
    print("  LeetCode 中国站题解同步脚本", flush=True)
    print("==================================================", flush=True)
    print("", flush=True)
    print("请先在浏览器中获取 Cookie：", flush=True)
    print("  第一步：打开 leetcode.cn 并登录", flush=True)
    print("  第二步：按 F12 打开开发者工具", flush=True)
    print("  第三步：切换到 Application 或 应用 选项卡", flush=True)
    print("  第四步：左侧选择 Cookies 下的 leetcode.cn", flush=True)
    print("  第五步：复制 LEETCODE_SESSION 和 csrftoken 的值", flush=True)
    print("", flush=True)
    print("格式：LEETCODE_SESSION=xxx; csrftoken=yyy", flush=True)
    cookie = input("请粘贴 Cookie：").strip()
    return cookie


def main():
    print(f"Python 版本：{sys.version}", flush=True)

    cookie = os.environ.get("LEETCODE_COOKIE", "").strip()
    if not cookie:
        cookie = prompt_cookie()

    print(f"Cookie 长度：{len(cookie)}", flush=True)
    if not cookie:
        print("Cookie 为空，已退出。", flush=True)
        return

    csrf_match = re.search(r"csrftoken=([^;]+)", cookie)
    csrf = csrf_match.group(1) if csrf_match else None

    print("正在从 leetcode.cn 拉取最近提交记录...", flush=True)
    try:
        submissions = get_all_submissions(cookie, csrf, limit=100)
    except Exception as e:
        print(f"拉取失败：{e}", flush=True)
        print("", flush=True)
        print("常见原因：", flush=True)
        print("  1. Cookie 过期或复制不完整（需要包含 LEETCODE_SESSION 和 csrftoken）", flush=True)
        print("  2. 未登录 leetcode.cn", flush=True)
        print("  3. 网络连不上 leetcode.cn", flush=True)
        return

    if not submissions:
        print("没有获取到提交记录，请检查 Cookie 是否有效。", flush=True)
        return

    # 只保留 Accepted，且每个题目保留最新一次
    accepted = [s for s in submissions if s.get("status_display") == "Accepted"]
    latest_by_slug = {}
    for s in accepted:
        slug = s.get("title_slug") or s.get("titleSlug")
        if not slug:
            continue
        ts = s.get("timestamp", 0) or 0
        if slug not in latest_by_slug or ts > latest_by_slug[slug].get("timestamp", 0):
            latest_by_slug[slug] = s

    print(f"获取到 {len(submissions)} 条提交，其中 Accepted {len(accepted)} 条，涉及 {len(latest_by_slug)} 个不同题目。", flush=True)

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
        sub_id = str(sub.get("id"))
        if not sub_id or sub_id == "None":
            continue
        if state.get(slug) == sub_id:
            continue  # 已经同步过

        code = sub.get("code", "")
        if not code.strip():
            print(f"  跳过 {slug}（没有代码内容）", flush=True)
            continue

        lang = (sub.get("lang") or "javascript").lower().replace("+", "plusplus").replace("#", "sharp")
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
