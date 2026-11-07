# 多态、Comparable 与 Comparator

## 多态性与函数传递之间的关系
### 亚型多态性
| 多态类型                     | 特点                       | 例子                                              |
| :----------------------- | :----------------------- | :---------------------------------------------- |
| **亚型多态（Subtype）**        | 靠继承 / 接口 + 方法重写实现，运行时多态  | `Animal a = new Cat(); a.makeSound();`          |
| 重载多态（Ad-hoc/Overloading） | 同一个类里，方法名相同，参数列表不同，编译时多态 | `add(int a, int b)` / `add(double a, double b)` |
| 参数化多态（Parametric）        | 泛型，和类型无关的通用代码            | `List<T>` 不管 T 是什么类型都能用                         |
Comparable接口只有一个方法：**int compareTo(T o);**（==overRide就行==）

Comparator相当于请了个裁判，你告诉裁判应该怎么比；


|特性|`Comparable`|`Comparator`|
|:--|:--|:--|
|**包**|`java.lang`|`java.util`|
|**修改原类？**|✅ 必须修改类，实现接口并重写方法|❌ 不需要修改原类|
|**比较逻辑位置**|写在类的内部|写在类的外部（单独的类 / Lambda）|
|**比较方法**|`int compareTo(T o)`|`int compare(T o1, T o2)`|
|**规则数量**|只能有**一套默认规则**|可以定义**多套不同规则**|
|**使用方式**|`Collections.sort(list)`|`Collections.sort(list, comparator)`|
|**比喻**|自己自带的 “身份证号”，默认按这个排序|第三方的 “排序表”，想按什么排就按什么排|

### 作为工具使用的内部类都应加上”==static==“
`public static class NameComparator implements Comparator<Dog>{
`@Override`
`public int compare(Dog o1, Dog o2) { `
`return o1.name.compareTo(o2.name); } }`

**==核心逻辑：java与python，之间的区别，：
//python通过传递函数来实现多态
//java通过传递对象（对象中写入函数）来实现多态==**
