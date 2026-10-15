// 移动零
// 法一：覆盖补零 O(n) O(1)
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
// 法二：双指针交换法 O(n) O(1)
// fast 遍历，遇到非 0，直接交换slow和fast位置的值。
var moveZeroes = function(nums) {
    let n = nums.length;
    let temp = 0;
    //第一轮：把非0全部拷贝到数组前面
    for(let i = 0; i < n; i++){
        if(nums[i] !== 0){
            nums[temp] = nums[i];
            temp++;
        }
    }
    //第二轮：temp后面全部赋值0
    for(let i = temp; i < n; i++){
        nums[i] = 0;
    }
    return nums;
};