//最大乘积子数组
var maxProduct = function(nums) {
    //dp[i]代表以i结尾的连续子数组最大乘积
    let maxDp = nums[0];// 以 当前位置 结尾的最大乘积
    let minDp = nums[0];// 以 当前位置 结尾的最小乘积//因为乘法有负数，可能遇到最大值
    let res = nums[0];// 全局答案：所有子数组里最大的乘积
    for(let i = 1; i < nums.length; i++){
        let tempMax = maxDp;//必须先存旧值，否则会被覆盖
        maxDp = Math.max(nums[i],tempMax*nums[i],minDp*nums[i]);
        minDp = Math.min(nums[i], tempMax * nums[i], minDp * nums[i]); 
        res = Math.max(res, maxDp);
    }
    return res;
};