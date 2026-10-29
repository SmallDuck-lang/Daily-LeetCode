//2026/10/29 爬楼梯 
// dp(n)=dp(n−1)+dp(n−2)    O(n)  O(1)
var climbStairs = function (n) {
    if (n === 1) return 1;
    if (n === 2) return 2;
    let a = 1, b = 2;
    for (let i = 3; i <= n; i++) {
        let c = a + b;
        a = b;
        b = c;
    }
    return b;
}