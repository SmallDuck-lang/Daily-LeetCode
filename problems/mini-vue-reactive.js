//vue3的响应式实现
//数据结构:WeakMap<target, Map<key, Set<effect>>> WeakMap存储目标对象，Map储存目标对象对应的属性，Set存储属性对应的依赖
//Reflect是ES6新增的js内置对象，可以更标准统一安全的操作普通对象
let activeEffect = null //记录正在运行的effect对象
const targetMap = new WeakMap();
function ref(initValue) {
    return reactive({
        value: initValue
    });
}
function reactive(target) {
    return new Proxy(target, {
        get(target, key, receiver) {//receiver是代理后的响应式对象，是 JS 引擎强制传给 get 捕获器的第三个参数！
            track(target, key);
            return Reflect.get(target, key, receiver)//从目标对象里获取指定属性的值,让 getter 里的 this 指向代理对象receiver
        },
        set(target, key, value, receiver) {
            Reflect.set(target, key, value, receiver)// 1. 先改值
            trigger(target, key);// 2. 再通知
            return true;
        }
    })
}
function track(target, key) {
    if (!activeEffect) return;//如果没有正在追踪的effect对象，那就直接返回
    let depsMap = targetMap.get(target);//获取目标对象对应的依赖关系Map
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);//获取属性对应的依赖集合
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    dep.add(activeEffect);//将当前的effect对象添加到依赖集合中
}
function trigger(target, key) {
    let depMap = targetMap.get(target);
    if (depMap) {
        let dep = depMap.get(key);
        if (dep) {
            dep.forEach(effect => {
                effect();// 执行依赖的effect函数
            })
        }
    }
}
function effect(fn) {
    activeEffect = fn;//将当前的effect函数赋值给activeEffect
    fn();//执行fn函数
    activeEffect = null;//执行完毕后将activeEffect置为null
}
