// 76. 最小覆盖子串 O(n + m)  O(1)
var minWindow = function(s, t) {
    const need = new Map();
    for(let c of t){
        need.set(c,(need.get(c) || 0) + 1);
    }
    let window = new Map();
    let left = 0, valid = 0;//满足「窗口内字符数量 ≥ t 需要的数量」的字符种类数
    let start = 0, minLen = Infinity;
    for(let right = 0; right < s.length; right++){
        const c = s[right];
        if(need.has(c)){
            window.set(c,(window.get(c)||0)+1);
            if(window.get(c) === need.get(c)) valid++;
        }
        //收缩窗口
        while(valid === need.size){
            const len = right - left + 1;
            if(len < minLen){
                minLen = len;
                start = left;
            }
            const d = s[left];
            left++;
            if(need.has(d)){
                if(window.get(d) === need.get(d)) valid--;
                window.set(d,window.get(d) - 1);
            }
        }
    }
    return minLen === Infinity ? "" : s.slice(start,start+minLen);
};