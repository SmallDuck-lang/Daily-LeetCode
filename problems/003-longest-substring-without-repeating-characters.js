//无重复字符的最长子串
//给定一个字符串，请你找出其中不含有重复字符的 最长子串 的长度。
//滑动窗口（双指针）   //时间O(n) 空间O(n)
var lengthOfLongestSubstring = function(s) {
    const map = new Map();
    let left = 0;
    let maxLen = 0;
    for(let right = 0; right < s.length; right++){
        const ch = s[right];
        if(map.has(ch) && map.get(ch) >= left){
            left = map.get(ch) + 1;
        }
        map.set(ch,right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
};