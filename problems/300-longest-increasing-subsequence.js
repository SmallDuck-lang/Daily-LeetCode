// 最长递增子序列 -DP动态规划 O(n^2) O(n)
var lengthOfLIS = function (nums) {
    //dp[i]:以nums[i]结尾的最长递增子序列长度
    const dp = new Array(nums.length).fill(1);
    let max = 1;
    for(let i = 0; i < nums.length; i++){
        for(let j = 0; j < i; j++){
            if(nums[i] > nums[j]){
                dp[i] = Math.max(dp[i],dp[j]+1);
            }
        }
        max = Math.max(max,dp[i]);
    }
    return max;
}