//数组扁平化：把多层嵌套数组变成一层 eg:[1, [2, [3, 4], 5]] → [1,2,3,4,5]
//法一：递归
function flatten(arr){
    let result = [];
    for(let item of arr){
        if(Array.isArray(item)){
            result = result.concat(flatten(item));//是数组递归调用继续展开
        }else{
            result.push(item);//不是数组直接push
        }
    }
    return result;
}
//法二：reduce遍历累加方法
function flatten(arr){
    //arr.reduce(..., [])从空数组开始拼接
    return arr.reduce((pre,cur) => {
        return pre.concat(Array.isArray(cur) ? flatten(cur) : cur)
    },[])
}