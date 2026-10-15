//1.call
Function.prototype.myCall = function(context,...args){
    if(typeof this !== 'function'){//只能是函数调用call
        throw new TypeError('it is not a function');
    }
    if(context === null || context === undefined){
        context = globalThis;
    }else{
        context = Object(context)//保证 this 一定是对象
    }
    const specialPropType = Symbol()//创建一个唯一、不冲突的 key//防止覆盖对象原有属性
    context[specialPropType] = this;
    let res = context[specialPropType](...args);//核心
    delete context[specialPropType];//用完删掉，不污染对象
    return res;
}
//2.apply
Function.prototype.myApply = function (context, args) {
  if (typeof this !== "function") {
    throw new TypeError(
      "Function.prototype.call - what is trying to be bound is not callable"
    );
  }
  //添加对args的处理
  if (args === null || args === undefined) {
    args = [];
  } else if (!Array.isArray(args)) {
    throw new TypeError(" CreateListFromArrayLike called on non-object");
  }

  if (context === null || context === undefined) {
    context = globalThis;
  } else {
    context = Object(context);
  }

  const specialProtoType = Symbol();
  context[specialProtoType] = this;
  let res = context[specialProtoType](...args);
  delete context[specialProtoType];
  return res;
};
//3.bind   要判断是不是new;  里面套用了call
Function.prototype.myBind = function (context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("type error");
  }

  const thisFn = this;
  function bindFn(...args2) {
    //call/apply 执行后返回的不是函数，不能 new；bind 返回新函数，可以被 new 实例化。
    //new 会忽略 bind 预设的 this，指向新建的实例对象，所以 bind 必须判断是不是 new 调用
    const isNew = this instanceof bindFn;

    return isNew
      ? thisFn.call(this, ...args, ...args2)//new boundFn ()：忽略绑定的 context，this 指向新建实例
      : thisFn.call(context, ...args, ...args2);//普通调用 boundFn ()：this 是 context
  }
  if (bindFn.prototype) {
    bindFn.prototype = Object.create(thisFn.prototype);
  }
  return bindFn;
};


//测试用例
function sum(a, b) {
  console.log(this.name);
  return a + b;
}
const obj = { name: "大疆" };
const res = sum.myApply(obj, [10, 20]);
console.log(res);