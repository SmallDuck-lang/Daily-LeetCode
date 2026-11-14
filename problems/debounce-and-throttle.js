//1.非立即执行版
//debounce
function debounce(fn, delay) {
    let timeId = null;
    return function (...args) {
        if (timeId) clearTimeout(timeId);//如果有定时器，则清除定时器(和节流主要区别)
        timeId = setTimeout(() => {
            fn.apply(this, args);
        }, delay)
    }
}
//throttle
function throttle(fn, delay) {
    let timeId = null;
    return function (...args) {
        if (timeId) return;//如果有定时器，则不执行
        timeId = setTimeout(() => {
            fn.apply(this,args)
            timeId = null;//执行完毕，清空定时器
        }, delay);
    }
}
//2.立即执行版
function debounceImmediate(fn,delay){
    let timeId = null;
    return function(...args){
        if(timeId) clearTimeout(timeId);
        //立即执行
        if(!timeId){
            fn.apply(this,args)
        }
        timeId  = setTimeout(() => {
            timeId = null;
        }, delay);
    }
}
function throttleImmediate(fn,delay){//只有立即节流用的时间戳，其余三个都是定时器锁
    let lastTime = 0;
    return function(...args){
        const now = Date.now();
        if(now - lastTime >= delay){//第一次lastTime为0，所以会立即触发一次
            fn.apply(this,args);
            lastTime = now;
        }
    }

}