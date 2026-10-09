//2026/10/9
//两数之和 II - 输入有序数组  //时间O(n) 空间O(1)
var twoSum = function(numbers, target) {
    let left = 0;
    let right = numbers.length - 1;
    while(left < right){
        const sum = numbers[left] + numbers[right];
        if(sum === target){
            return [left+1,right+1];
        }else if(sum < target){
            left++;
        }else{
            right--;
        }
    }
    return [];
};
//map做法与001思路一样 //时间O(n) 空间 O(n)
