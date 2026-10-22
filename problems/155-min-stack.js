//最小栈  2026/10/21    O(1) O(n)
var MinStack = function () {
    this.stack = [];
    this.minStack = [];
};

/** 
 * @param {number} value
 * @return {void}
 */
MinStack.prototype.push = function (value) {
    this.stack.push(value);
    // 最小值栈：压入当前最小值
    if (this.minStack.length === 0) {
        this.minStack.push(value);
    } else {
        this.minStack.push(Math.min(value, this.minStack[this.minStack.length - 1]));
    }
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function () {
    this.stack.pop();
    this.minStack.pop();
};

/**
 * @return {number}
 */
MinStack.prototype.top = function () {
    return this.stack[this.stack.length - 1];
};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function () {
    return this.minStack[this.minStack.length - 1];
};

/** 
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(value)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.getMin()
 */