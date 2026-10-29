//杨辉三角  O(n^2)  O(n^2)
var generate = function(numRows) {
    const res = [];
    for(let i = 0; i < numRows; i++){
        const row = new Array(i+1).fill(1);
        // 计算中间元素，跳过首尾
        for(let j = 1; j < i; j++){
            row[j] = res[i-1][j-1] +res[i-1][j];
        }
        res.push(row);
    }
    return res;
};
