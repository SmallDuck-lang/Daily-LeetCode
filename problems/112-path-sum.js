//2026/10/29
//路径和 O(n) O(h)
var hasPathSum = function(root, targetSum) {
    if(!root) return false;
    if(!root.left && !root.right){
        return root.val === targetSum;
    }
    //递归
    const remain = targetSum-root.val;
    return hasPathSum(root.left,remain) || hasPathSum(root.right,remain);
};
