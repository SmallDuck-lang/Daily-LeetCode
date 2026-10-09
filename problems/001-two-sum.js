// 2026/10/8
//法一：暴力拆除 //时间：O(n²)   空间：O(1)
var twoSum = function(nums, target) {
    let sum = 0;
    let arr = [];
    for(let i = 0; i < nums.length; i++){
       for(let j = i+1; j < nums.length; j++){
         if(nums[i] + nums[j] === target){
            arr.push(i,j)
            return arr;
         }
       }
    }
};
//法二：哈希 //时间：O(n) 空间：O(n)
var twoSum = function(nums, target) {
    const map = new Map();
    for(let i = 0; i < nums.length; i++){
        const need = target - nums[i];
        if(map.has(need)){
            return [map.get(need),i]
        }
        map.set(nums[i],i)
    }
    return []
};