### 一、项目介绍
使用原生js实现了Vue的部分功能。  
前期通过ES6模板搭建并测试,后期将js模块整合为index.js文件对外输出。

后台搭建使用了Node.js,使用了babel转码器使其支持ES6模块化语法。

### 二、运行配置
1. cmd 跳转至当前文件夹；

2. 执行 `cnpm install` 下载缺失的相关依赖；

3. 执行 `npm run dev` 运行项目；

4. 在 <http://localhost:5050/> 查看项目。

### 三、运行流程
1. 进入首页 index.html；

2. 执行 _Vue/index.js，并对外输出\_Vue类；

3. 执行 index.js，通过 `new _Vue()` 创建构造函数；

4. 执行_Vue类的构造函数方法，对传入的对象绑定的元素（el）进行渲染，同时监听构造函数的 data 对象属性变化，属性发生变化时触发渲染。

### 四、实现功能
1. `diff` 算法渲染  
计算源html转化为VD对象后与当前html转化为VD对象的差别进行渲染。

2. `new _Vue()`  
实现了Vue的el，data属性和methods属性，在methods对象属性的方法中，可以使用this来获取当前_Vue实例上所绑定的 data对象属性值 和 methods对象属性值 。

3. `v-bind:` / `:` 属性前缀  
若属性包含 v-bind/: 前缀，将从_Vue实例的data/methods对象属性和模板临时变量（如v-for循环传承的临时变量）获取相应值，并对属性值进行计算替换。

4. `v-on:` / `@` 属性前缀  
若属性包含 v-on/@ 前缀，将从_Vue实例的 data/methods 对象属性和模板临时变量获取相应值，并为其绑定事件监听器 (如click事件)，在事件触发时计算该值并执行语句。

5. `v-for` 属性  
可以使用数字/_Vue实例的 data/methods 对象属性/模板临时变量表示第二个参数，并使用第一个参数存储模板临时变量，该变量仅在当前节点及其子节点写有效。

6. `key` 属性  
带有key的元素节点，将优先和带同样 key 的旧节点进行比较。
