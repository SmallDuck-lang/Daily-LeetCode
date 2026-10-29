//2026/10/17
//1.手写new    记住new创建的四步
function myNew(fn,...args){
    const obj = Object.create(fn.prototype);
    const result = fn.apply(obj,args);
    return typeof result === 'object' && result !== null ? result : obj;
}

//2.instanceof 判断 左边 是不是 右边构造函数 的实例
function myInstanceof(left,right){
    if(left === null || typeof left !== 'object') return false;//基本类型没有原型链
    let proto = Object.getPrototypeOf(left);
    while(proto){
        if(proto === right.prototype) return true;
        proto = Object.getPrototypeOf(proto);
    }
    return false;
}
