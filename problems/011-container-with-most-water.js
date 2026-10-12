//O(n) O(1)
var maxArea = function(height) {
    const n = height.length;
    let left = 0;
    let maxMul = 0;
    let right = n - 1;
    while(left < right){
        let lowHeight = Math.min(height[left],height[right]);
        let curMul = lowHeight * (right - left);
        if(height[left] < height[right]){
            left++;
        }else{
            right--;
        }
        maxMul = Math.max(maxMul,curMul);
    }
    return maxMul;
};