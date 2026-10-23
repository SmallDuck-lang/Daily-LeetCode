// 2026/10/23
// DFS  O(n) O(n)
var maxDepth = function(root) {
    if(!root) return 0;
    const leftDepth = maxDepth(root.left);
    const rightDepth = maxDepth(root.right);
    return Math.max(leftDepth,rightDepth) + 1;
};