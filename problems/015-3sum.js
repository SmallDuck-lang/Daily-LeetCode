// 三数之和  排序+双指针  //时间O (n²) 空间：O (1)
var threeSum = function(nums) {
    const res = [];
    nums.sort((a,b) => a - b);
    const n = nums.length;
    for(let i = 0; i < n; i++){
        if(nums[i] > 0) break;
        //i 的去重：防止外层固定相同数字
        if(i>0 && nums[i] === nums[i-1]) continue;
        let left = i + 1;
        let right = n - 1;
        while(left < right){
            const sum = nums[i] + nums[left] + nums[right];
            if(sum  > 0){
                right--;
            }else if(sum < 0){
                left++;
            }else{
                res.push([nums[i],nums[left],nums[right]]);
                // left 的去重 和 right 的去重
                while(left < right && nums[left] === nums[left+1]) left++;
                while(left < right && nums[right] === nums[right-1]) right--;
                left++; 
                right--;
            }
        }
    }
    return res;
};