/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
//滑动窗口的最大值   时间O(n) 空间O(k)
var maxSlidingWindow = function(nums, k) {
    const deque = [];//双端队列，存下标，队列内对应值单调递减
    const res = [];
    for(let i = 0; i < nums.length; i++){
        //1.弹出队尾所有比当前数字小的元素
        while(deque.length && nums[i] >= nums[deque[deque.length - 1]]){
            deque.pop();
        }
        deque.push(i);
        //2.队首元素超出窗口范围，移除队首
        while(deque[0] <= i - k){
            deque.shift();
        }
        //3.窗口长度达到k，开始记录最大值
        if(i >= k - 1){
            res.push(nums[deque[0]]);
        }
    }
    return res;
};