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
