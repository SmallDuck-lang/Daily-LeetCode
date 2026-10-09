//字母异位词分组 //时间O(n · k log k)  空间O(n · k)
var groupAnagrams = function(strs) {
   const map = new Map();
   for(const s of strs){
    const key = s.split('').sort().join('');
    if(!map.has(key)){
        map.set(key,[]);
    }
    map.get(key).push(s);
   }
   return Array.from(map.values())
};