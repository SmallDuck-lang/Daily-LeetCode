//环形节点II O(n) O(1)
var detectCycle = function(head) {
    let slow = head;
    let fast = head;
    while(fast && fast.next){
        slow = slow.next;
        fast = fast.next.next
        if(slow === fast){
            let p = head;
            // 一个新的指针p指向头节点,slow留在相遇点
            while(p !== slow){
                p = p.next;
                slow = slow.next;
            }
            return p;
        }
    }
    return null;
};