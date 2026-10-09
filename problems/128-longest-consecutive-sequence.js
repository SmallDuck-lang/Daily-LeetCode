//2026/10/9
//最长连续序列
var longestConsecutive = function(nums) {
    const set = new Set(nums);
    let maxLen = 0;
    for(const num of set){
        if(!set.has(num-1)){
            let currentNum = num;
            let currentLen = 1;
            while(set.has(currentNum+1)){
                currentNum++;
                currentLen++;
            }
            maxLen = Math.max(maxLen,currentLen)
        }
    }
    return maxLen;
};