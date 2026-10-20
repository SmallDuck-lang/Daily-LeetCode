//相交链表
//法一：哈希表 O(m+n)  O(m)/O(n)
var getIntersectionNode = function (headA, headB) {
    const set = new Set();
    let curA = headA;
    while(curA !== null){
        set.add(curA);// 存节点，不是存值！
        curA = curA.next;
    }
    let curB = headB;
    while(curB !== null){
        if(set.has(curB)){
            return curB;// 找到了，直接返回这个相交节点
        }
        curB = curB.next;
    }
    return null;
};
//法二： 双指针 O(m+n) O(1)
var getIntersectionNode = function (headA, headB) {
    let curA = headA;
    let curB = headB;
    while(curA !== curB){
        curA = curA ? curA.next : headB;
        curB = curB ? curB.next : headA;
    }
    return curA;
};