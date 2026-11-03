// 113. 路径总和 II  递归
var pathSum = function (root, targetSum) {
    const res = [];
    const dfs = (node,path,sum) => {
        if(!node) return;
        //当前节点入路径，累加和
        path.push(node.val);
        sum += node.val;
        if(!node.left && !node.right){
            if(sum === targetSum){
                res.push([...path]);
            }
        }else{//不是叶子节点
            dfs(node.left,path,sum);
            dfs(node.right, path, sum);
        }
        // 回溯！弹出当前节点，回到上一层
        path.pop();
    }
    dfs(root,[],0)
    return res;
};
//迭代
var pathSum = function(root, targetSum) {
    if (!root) return [];
    const res = [];
    // 队列元素：[节点, 当前路径数组, 当前累加和]
    const queue = [[root, [root.val], root.val]];
    while(queue.length) {
        const [node, path, sum] = queue.shift();
        if (!node.left && !node.right) {
            if (sum === targetSum) res.push(path);
        }
        if (node.left) {
            queue.push([node.left, [...path, node.left.val], sum + node.left.val]);
        }
        if (node.right) {
            queue.push([node.right, [...path, node.right.val], sum + node.right.val]);
        }
    }
    return res;
};