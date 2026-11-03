//对称二叉树
// 递归
var isSymmetric = function (root) {
    // 辅助函数：判断 p 和 q 是否镜像
    function check(p,q){
        if(p === null && q === null) return true;
        if(p === null || q === null) return false;
        return p.val === q.val && check(p.left,q.right) && check(p.right, q.left);//三个条件要都满足
    }
    return check(root.left, root.right);
};
// 迭代
var isSymmetric = function (root){
    if(!root) return true;
    const queue = [root.left,root.right];
    while(queue.length){
        const p = queue.shift();
        const q = queue.shift();
        if(p === null && q === null) continue;
        if(p === null || q === null) return false;
        if(p.val !== q.val) return false;
        queue.push(p.left,q.right);
        queue.push(p.right,q.left)
    }
    return true;
}