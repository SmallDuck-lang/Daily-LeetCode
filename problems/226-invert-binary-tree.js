//翻转二叉树
//递归
var invertTree = function (root) {
    if (!root) return null;
    [root.left, root.right] = [root.right, root.left];//交换左右节点
    invertTree(root.left);
    invertTree(root.right);
    return root;
};
// 迭代
var invertTree = function (root) {
    if (!root) return null;
    const queue = [root];
    while (queue.length) {
        const node = queue.shift();//每次拿出来，直到叶子节点，没有左右节点，跳出循环
        [node.left, node.right] = [node.right, node.left];//交换左右节点
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
    }
    return root;
}