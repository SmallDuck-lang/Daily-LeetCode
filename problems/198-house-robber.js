//打家劫舍
var rob = function(nums) {
    //sum1：到i-2家偷到的最大值，sum2：到i-1家偷到的最大值
    let sum1 = 0;
    let sum2 = 0;
    for(let i = 0; i < nums.length; i++){
        //要么偷这家（sum1 + nums[i]），要么不偷（sum2）
        const cur = Math.max(sum2,sum1+nums[i]);
        sum1 = sum2;
        sum2 = cur;
    }
    return sum2;
};