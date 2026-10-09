@echo off
chcp 65001 >nul
cd /d E:\daily-leetcode
set PYTHON=C:\Users\冯婉怡\.workbuddy\binaries\python\versions\3.14.3\python.exe
set PYTHONIOENCODING=utf-8
"%PYTHON%" scripts/sync_leetcode_cn.py
pause
