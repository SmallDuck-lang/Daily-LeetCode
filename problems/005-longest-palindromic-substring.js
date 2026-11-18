//最长回文子串    中心扩展法  用dp难
var longestPalindrome = function (s) {
    let res = '';
    for (let i = 0; i < s.length; i++) {
        helper(i, i);//奇数中心点只有一个i
        helper(i, i + 1)//偶数中心点在两数中间

    }
    function helper(m, n) {
        while (m >= 0 && n < s.length && s[m] === s[n]) {
            m--;
            n++;
        }
        if (n - m - 1 > res.length) {
            res = s.slice(m + 1, n);
        }
    }
    return res;
};
//最长回文子串（连续）：中心扩展优先，DP 备选
//最长回文子序列（可以不连续）：只能 DP，中心扩展用不了
