//全排列-回溯算法  
//回溯=暴力搜索+剪枝(不合法的分支提前砍掉)  O(n!*n) O(n)
var permute = function(nums) {
    //回溯+used标记数组
    const res = [];
    const used = new Array(nums.length).fill(false);
    const backtrack = (path) => {
        if(path.length === nums.length){
            res.push([...path]);
            return;
        }
        for(let i = 0; i < nums.length; i++){
            //如果这个数字已经选过了，跳过
            if(used[i]) continue;//剪枝
            //标记i这个位置的数，已经被使用
            used[i] = true;
            path.push(nums[i]);
            //递归
            backtrack(path);
            //回溯，撤销选择
            path.pop();
            used[i] = false;
        }
    }
    backtrack([]);
    return res;
};