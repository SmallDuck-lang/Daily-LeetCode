// 移动零 O(n) O(1)
var moveZeroes = function(nums) {
    let n = nums.length;
    let temp = 0;
    for(let i = 0; i < n; i++){
        if(nums[i] !== 0){
            nums[temp] = nums[i];
            temp++;
        }
    }
    for(let i = temp; i < n; i++){
        nums[i] = 0;
    }
    return nums;
};