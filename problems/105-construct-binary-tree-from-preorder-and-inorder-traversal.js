//前序中序构建二叉树
/**
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function (preorder, inorder) {
    if (!preorder.length || !inorder.length) return null;
    const rootVal = preorder[0];
    const root = new TreeNode(rootVal);
    //找到根在中序的下标
    const idx = inorder.indexOf(rootVal);
    root.left = buildTree(preorder.slice(1,idx+1),inorder.slice(0,idx));
    root.right = buildTree(preorder.slice(idx+1),inorder.slice(idx+1));
    return root;
};