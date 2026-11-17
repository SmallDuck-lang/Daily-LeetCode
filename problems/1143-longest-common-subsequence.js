//最长公共子序列
/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
var longestCommonSubsequence = function (text1, text2) {
    const m = text1.length;
    const n = text2.length;
    // 二维数组dp[i][j]:text1前i个字符、text2前j个字符的最长公共子序列长度
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            // 情况1：当前两个字符 相等
            if (text1[i - 1] === text2[j - 1]) {
                // 公共长度 = 左上角值 + 1
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else { // 情况2：当前两个字符 不相等
                // 取 上边 或 左边 的最大值
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
     //最终答案在表格右下角
    return dp[m][n];
};