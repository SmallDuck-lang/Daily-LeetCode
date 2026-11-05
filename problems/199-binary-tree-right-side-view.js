//右视图
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var rightSideView = function(root) {
    if(!root) return [];
    const left = rightSideView(root.left);
    const right = rightSideView(root.right);
    return [root.val,...right,...left.slice(right.length)];
};