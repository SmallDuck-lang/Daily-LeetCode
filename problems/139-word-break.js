//2026/11/16 周一   O(n^2) O(n)
// 单词拆分  dp
var wordBreak = function (s, wordDict) {
    //dp[i] 代表字符串s中前i个字符是否可以被字典里的单词拼接成功
    const set = new Set(wordDict)
    const n = s.length;
    const dp = new Array(n + 1).fill(false);
    dp[0] = true;
    for (let i = 1; i <= n; i++) {
        //j代表分割点
        for(let j = 0; j < i; j++){
            if(dp[j] && set.has(s.slice(j,i))){
                dp[i] = true;
                break;
            }
        }
    }
    return dp[n];
};