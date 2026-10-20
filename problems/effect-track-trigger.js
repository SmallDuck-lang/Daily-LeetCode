//Vue3响应式原理简单版
let targetMap = new WeakMap();//存储每个对象的依赖关系
let activeEffect = null;//记录当前正在运行的effect
function ref(initValue) {
    return reactive({
        value: initValue
    });
}
function reactive(target) {
    const handler = {
        get(target, key, receiver) {
            track(receiver, key);
            return Reflect.get(target, key, receiver)
        },
        set(target, key, value, receiver) {
            Reflect.set(target, key, value, receiver) // 1. 先改值
            trigger(receiver, key)                   // 2. 再通知
            return true
        }
    }
    return new Proxy(target, handler);//target要代理的对象;hander捕获器
}
//数据结构:WeakMap<target, Map<key, Set<effect>>>
function track(target, key) {
    if (!activeEffect) return;//如果没有正在运行的effect对象，那就不追踪
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, depsMap = new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
        depsMap.set(key, dep = new Set());
    }
    dep.add(activeEffect);
}
function trigger(target, key) {
    let depsMap = targetMap.get(target);
    if (depsMap) {
        const dep = depsMap.get(key);
        if (dep) {
            dep.forEach(effect => effect());
        }
    }
}
function effect(fn) {
    activeEffect = fn;
    activeEffect();
    activeEffect = null;
}
function computed(fn) {
    const result = ref();
    effect(() => {
        result.value = fn()
    })
    return result;
}

//例子
let A0 = ref(1);
let A1 = ref(2);
effect(() => {
    A2 = A0.value + A1.value;
})
console.log(A2);//3
A0.value = 2;
console.log(A2)//4