# LeetCode 中国站题解同步脚本
# 用法：右键此文件 -> 使用 PowerShell 运行
#       或直接运行：.\sync.ps1

$ErrorActionPreference = "Stop"
Set-Location -Path "E:\daily-leetcode"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  LeetCode 中国站题解同步脚本" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "请先在浏览器中获取 Cookie：" -ForegroundColor Yellow
Write-Host "  1. 打开 https://leetcode.cn 并登录"
Write-Host "  2. 按 F12 > Application/应用 > Cookies > https://leetcode.cn"
Write-Host "  3. 复制 LEETCODE_SESSION 和 csrftoken 的值"
Write-Host ""

$cookie = Read-Host -Prompt "请粘贴 Cookie（格式 LEETCODE_SESSION=xxx; csrftoken=yyy）"
$env:LEETCODE_COOKIE = $cookie

python scripts/sync_leetcode_cn.py

Write-Host ""
Read-Host -Prompt "按 Enter 键退出"
