// 反转列表 O(n) O(1)
var reverseList = function(head) {
    let prev = null;
    let curr = head;
    while(curr){
        const nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
};