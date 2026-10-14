/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function(nums, k) {
   let map = new Map();
   map.set(0,1);// 初始化前缀和0出现1次
   let preSum = 0;
   let count = 0;
   for(let num of nums){
    preSum += num;
    if(map.has(preSum - k)){
        count += map.get(preSum - k);
    }
    map.set(preSum,(map.get(preSum) || 0)+1);
   }
   return count;
};