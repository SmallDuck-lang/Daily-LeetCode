function deepClone(target, cache = new WeakMap()) {
  if (cache.has(target)) {
    return cache.get(target);
  }

  if (target instanceof Object) {//判断target是不是引用类型
    let dist;

    // 是：数组 / 函数 / 正则 / 日期 / Map / Set 就要一步一步复制，先造空壳
    if (Array.isArray(target)) {
      dist = [];
    } else if (target instanceof Function) {
      dist = function () {
        return target.call(this, ...arguments);
      };
    } else if (target instanceof RegExp) {
      dist = new RegExp(target.source, target.flags);
    } else if (target instanceof Date) {
      dist = new Date(target);
    } else if (target instanceof Map) {
      dist = new Map();
      // 先缓存，防止循环引用
      cache.set(target, dist);
      // 递归克隆每一项
      target.forEach((value, key) => {
        dist.set(key, deepClone(value, cache));
      });
      return dist;
    } else if (target instanceof Set) {
      dist = new Set();
      cache.set(target, dist);
      target.forEach(value => {
        dist.add(deepClone(value, cache));
      });
      return dist;
    } else {// 普通对象
      dist = {};
    }
    // 存入缓存，解决循环引用
    cache.set(target, dist);

    // 遍历克隆自身属性；把里面的属性都填进去！！！（关键）
    for (let key in target) {
      if (Object.hasOwn(target, key)) {
        dist[key] = deepClone(target[key], cache);
      }
    }

    // 保留原型链
    Object.setPrototypeOf(dist, Object.getPrototypeOf(target));

    return dist;
  } else {//不是（数字、字符串等）： 直接返回
    return target;
  }
}