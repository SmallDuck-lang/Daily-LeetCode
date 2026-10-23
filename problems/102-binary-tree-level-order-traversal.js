// 2026/10/23 周五   O(n) O(n)
// 二叉树层序遍历（广度优先搜索BFS） 队列
var levelOrder = function (root) {
    const res = [];
    if(!root) return res;

    const queue = [root];
    while(queue.length > 0 ){
        const n = queue.length;
        // 存放当前层的值
        const currentLeval = [];
        for(let i = 0; i < n; i++){
            const node = queue.shift();
            currentLeval.push(node.val);
            //左孩子入队
            if(node.left) queue.push(node.left);
            if(node.right) queue.push(node.right);
        }
        res.push(currentLeval);
    }
    return res;
};