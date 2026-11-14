//零钱兑换-DP动态规划 O(n*m) O(n)      从小问题到大问题
var coinChange = function (coins, amount) {
    // dp[i]代表金额i需要的最小硬币数
    const dp = new Array(amount + 1).fill(Infinity);//开辟了全为无穷的数组空间
    dp[0] = 0;
    for (let i = 1; i <= amount; i++) {
        for (const c of coins) {
            if (i - c >= 0) {
                dp[i] = Math.min(dp[i], dp[i - c] + 1);
            }
        }
    }
    return dp[amount] === Infinity ? -1 : dp[amount];
}