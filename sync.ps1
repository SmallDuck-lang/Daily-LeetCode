# LeetCode 中国站题解同步脚本
# 用法：右键此文件 -> 使用 PowerShell 运行

$ErrorActionPreference = "Stop"
$env:PYTHONIOENCODING = "utf-8"
Set-Location -Path "E:\daily-leetcode"

$PythonExe = "C:\Users\冯婉怡\.workbuddy\binaries\python\versions\3.14.3\python.exe"
& $PythonExe scripts/sync_leetcode_cn.py

Read-Host -Prompt "按 Enter 键退出"
