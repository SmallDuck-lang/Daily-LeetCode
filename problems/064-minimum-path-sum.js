//2026/11/16 周一   O(m*n) O(m*n)
// 最小路径和
var minPathSum = function (grid) {
    const m = grid.length;
    const n = grid[0].length;
    //dp[i][j] 代表走到 grid[i][j] 的最小路径和
    const dp = Array.from({ length: m }, () => Array(n).fill(0));
    dp[0][0] = grid[0][0];
    //填充第一行
    for (let j = 1; j < n; j++) {
        dp[0][j] = dp[0][j - 1] + grid[0][j];
    }
    //填充第一列
    for (let i = 1; i < m; i++) {
        dp[i][0] = dp[i - 1][0] + grid[i][0];
    }
    //遍历剩下的格子
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = grid[i][j] + Math.min(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[m - 1][n - 1];
};