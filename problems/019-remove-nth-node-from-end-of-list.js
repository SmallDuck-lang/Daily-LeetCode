//删除链表倒数第 N 个结点  2026/10/19
//法一：两次遍历 O(L) O(1)
var removeNthFromEnd = function(head, n) {
    const dummy = new ListNode(0,head);//哑结点就是一个额外新建、不存有效业务值的节点，放在链表真正头节点的前面。
    let cur = dummy;
    let len = 0;
    while(cur.next){
        cur = cur.next;
        len++;
    }
    cur = dummy;
    for(let i = 0; i < len - n; i++){
        cur = cur.next;
    }
    cur.next = cur.next.next;
    return dummy.next;
};

// 法二：双指针 O(L) O(1)
var removeNthFromEnd = function (head, n) {
    const dummy = new ListNode(0, head);
    let fast = dummy;
    let slow = dummy;
    for (let i = 0; i < n; i++) {
        fast = fast.next;
    }
    while(fast.next){
        fast = fast.next;
        slow = slow.next;
    }
    slow.next = slow.next.next;
    return dummy.next;
};