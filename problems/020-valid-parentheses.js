//有效的括号 2026/10/21   O(n) O{n}
var isValid = function (s) {
    const map = {
        ')': '(',
        '}': '{',
        ']': '['
    };
    const stack = [];
    for (const char of s) {
        if (map[char]) {
            //右括号
            const top = stack.pop();
            if (top !== map[char]) {
                return false;
            }
        } else {
            //左括号，压栈
            stack.push(char);
        }
    }
    return stack.length === 0;
};