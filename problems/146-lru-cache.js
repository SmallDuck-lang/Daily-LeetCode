//LRU 的核心思想是如果数据最近被访问过，那么将来被访问的几率也更高，
// 所以我们将命中缓存的组件 key 重新插入到 this.keys 的尾部，这样一来，this.keys 中越往头部的数据即将来被访问几率越低，
// 所以当缓存数量达到最大值时，我们就删除将来被访问几率最低的数据，即 this.keys 中第一个缓存的组件。
class LRUCache {
    constructor(capacity){
        this.capacity = capacity;
        this.map = new Map();
        //哨兵节点
        this.head = {key: 0, value: 0, prev: null, next: null};
        this.tail = {key: 0, value: 0, prev: null, next: null};
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }
    get(key){
        if(!this.map.has(key)) return -1;
        const node = this.map.get(key);
        this.moveToTail(node);// 访问后挪到tail前面（最新位置）
        return node.value;
    }
    put(key,value){
        if(this.map(key)){
            const node = this.map.get(key);
            node.value = value;
            this.moveToTail(node);
        }else{
            const newNode = {key,value,prev: null,next: null};
            this.map.set(key,newNode)
            this.addTotail(newNode);
            if(this.map.size > this.capacity){
                const delNode = this.removeHeadNext();
                this.map.delete(delNode.key);
            }
        }
    }
    moveToTail(node){
        this.removeNode(node);
        this.addToTail(node);
    }
    removeNode(node){
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }
    addToTail(){
        node.prev = this.tail.prev;
        node.next = this.tail;
        this.tail.prev.next = node;
        this.tail.prev = node;
    }
    removeHeadNext(){
        const res = this.head.next;
        this.removeNode(res);
        return res;
    }
}