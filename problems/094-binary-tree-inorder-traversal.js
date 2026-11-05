//中序遍历
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function(root) {
    if(!root) return [];
    const left = inorderTraversal(root.left);
    const right = inorderTraversal(root.right);
    return [...left, root.val, ...right];//直接合起来就行
};