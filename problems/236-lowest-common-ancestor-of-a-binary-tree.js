//最近公共祖先 
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function (root, p, q) {
    if (root === null || root.val === p.val || root.val === q.val) {
        return root;
    }
    //问左子树：你里面有没有p或者q？
    const left = lowestCommonAncestor(root.left, p, q)
    //问右子树：你里面有没有p或者q？
    const right = lowestCommonAncestor(root.right, p, q)
    if (left && right) return root;//左边有、右边也有 → 当前 root 就是答案
    return left ? left : right;//只有一边有 → 返回有值的那一边
};