@echo off
chcp 65001 >nul
cd /d E:\daily-leetcode
set PYTHON=C:\Users\冯婉怡\.workbuddy\binaries\python\versions\3.14.3\python.exe
echo ==================================================
echo  LeetCode 中国站题解同步脚本
echo ==================================================
echo.
echo 请先在浏览器中获取 Cookie：
echo   1. 打开 https://leetcode.cn 并登录
echo   2. 按 F12 ^> Application/应用 ^> Cookies ^> https://leetcode.cn
echo   3. 复制 LEETCODE_SESSION 和 csrftoken 的值
echo.
set /p COOKIE="请粘贴 Cookie（格式 LEETCODE_SESSION=xxx; csrftoken=yyy）:"
set LEETCODE_COOKIE=%COOKIE%
"%PYTHON%" scripts/sync_leetcode_cn.py
pause
