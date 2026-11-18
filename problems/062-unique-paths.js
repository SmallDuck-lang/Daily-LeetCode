//不同路径 O(m*n) O(m*n)  二维dp  2026/11/18
var uniquePaths = function(m, n) {
    //起点dp[0][0] = 1和第一列dp[i][0] = 1、第一行dp[0][j] = 1都初始化为1了
    const dp = Array.from({length:m},()=>new Array(n).fill(1));
    for(let i = 1; i < m; i++){
        for(let j = 1; j < n; j++){
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }
    return dp[m-1][n-1]
};