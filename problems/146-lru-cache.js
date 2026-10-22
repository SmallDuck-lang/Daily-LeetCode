//LRU 的核心思想是如果数据最近被访问过，那么将来被访问的几率也更高，
// 所以我们将命中缓存的组件 key 重新插入到 this.keys 的尾部，这样一来，this.keys 中越往头部的数据即将来被访问几率越低，
// 所以当缓存数量达到最大值时，我们就删除将来被访问几率最低的数据，即 this.keys 中第一个缓存的组件。
/**
 * @param {number} capacity
 */
// LRU缓存  O (1)  O(capacity)
var LRUCache = function(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    // 哨兵节点(双指针)
    this.head = { key: 0, value: 0, prev: null, next: null };
    this.tail = { key: 0, value: 0, prev: null, next: null };
    this.head.next = this.tail;
    this.tail.prev = this.head;
};

/**
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this.moveToTail(node); // 访问后挪到tail前面（最新位置）
    return node.value;
};

/**
 * @param {number} key
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
    if (this.map.has(key)) {
        const node = this.map.get(key);
        node.value = value;
        this.moveToTail(node);
    } else {
        const newNode = { key, value, prev: null, next: null };
        this.map.set(key, newNode);
        this.addToTail(newNode);
        if (this.map.size > this.capacity) {
            // 淘汰head后面那个，也就是最久没使用的
            const delNode = this.removeHeadNext();
            this.map.delete(delNode.key);
        }
    }
};

// 把节点挪到tail前面 = 先摘除，再插到tail前
LRUCache.prototype.moveToTail = function(node) {
    this.removeNode(node);
    this.addToTail(node);
};

// 摘除节点
LRUCache.prototype.removeNode = function(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
};

// 插入到 tail 的前面
LRUCache.prototype.addToTail = function(node) {
    node.prev = this.tail.prev;
    node.next = this.tail;
    this.tail.prev.next = node;
    this.tail.prev = node;
};

//删除head后面第一个节点（LRU淘汰点）
LRUCache.prototype.removeHeadNext = function() {
    const res = this.head.next;
    this.removeNode(res);
    return res;
};

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */