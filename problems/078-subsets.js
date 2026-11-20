//子集
//回溯
var subsets = function(nums) {
    const res = [];
    const backtrack = (start,path) => {
        //子集:每一条路径都要收集，不是等到最后
        res.push([...path]);
        for(let i = start; i < nums.length; i++){
            //选
            path.push(nums[i]);
            //下一层只能从i+1开始，避免[1,2]和[2,1]这种重复子集
            backtrack(i+1,path);
            //撤销选择
            path.pop();
        }
    }
    backtrack(0,[]);
    return res;
};