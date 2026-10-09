@echo off
chcp 65001 >nul
cd /d E:\daily-leetcode
set PYTHON=C:\Users\冯婉怡\.workbuddy\binaries\python\versions\3.14.3\python.exe

echo ==================================================
echo  LeetCode 中国站题解同步脚本
echo ==================================================
echo.
echo 请先在浏览器中获取 Cookie
echo   第一步：打开 leetcode.cn 并登录
echo   第二步：按 F12 打开开发者工具
echo   第三步：切换到 Application 或 应用 选项卡
echo   第四步：左侧选择 Cookies 下的 leetcode.cn
echo   第五步：复制 LEETCODE_SESSION 和 csrftoken 的值
echo.
set /p COOKIE="请粘贴 Cookie 到这里："
set LEETCODE_COOKIE=%COOKIE%
"%PYTHON%" scripts/sync_leetcode_cn.py
pause
