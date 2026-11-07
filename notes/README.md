# 课程笔记目录

本目录由 Obsidian 源笔记整理而成，图片与公式在 GitHub 和 Pages 站点中均可阅读。

## CS61B · Java 与数据结构

从 Java 面向对象、泛型与集合出发，进入复杂度分析、链表、树结构与算法设计。现有笔记来自 Java、数据结构与算法目录，按 CS61B 学习路径重新编排。

### Java 语言基础

1. [Java 面向对象与封装](cs61b/01-java-oop-encapsulation.md) — 类、对象、构造方法、访问控制、this 与 static。
2. [继承、抽象类与接口](cs61b/02-inheritance-interfaces.md) — 继承关系、方法重写、super、final、抽象类和接口的职责边界。
3. [多态与内部类](cs61b/03-polymorphism-inner-classes.md) — 静态与动态多态、向上向下转型、Object 类和四种内部类。
4. [Java 泛型](cs61b/04-generics.md) — 泛型类、泛型接口和类型参数的基本用法。
5. [Java API：字符串、包装类与正则](cs61b/05-java-api.md) — String、StringBuffer、包装类以及正则表达式校验。
6. [集合与迭代器](cs61b/06-collections-iterators.md) — List、Set、增强 for 循环与 Iterator 之间的关系。
7. [异常处理](cs61b/07-exceptions.md) — 异常体系、捕获与声明，以及课堂中的关键图示。
8. [文件与 IO 流](cs61b/08-io-streams.md) — File、字节流、字符流与转换流。
9. [多线程](cs61b/09-multithreading.md) — 线程生命周期、创建方式、同步、锁与并发安全。
10. [网络编程](cs61b/10-network-programming.md) — TCP/IP、Socket、UDP 与多线程网络通信。

### 数据结构基础

11. [ADT 与算法基础](cs61b/11-adt-and-algorithms.md) — 抽象数据类型、算法五要素以及如何从复杂度开始阅读算法。
12. [线性表](cs61b/12-linear-lists.md) — 线性表的类型定义、顺序实现与链式表达。
13. [栈与队列](cs61b/13-stacks-and-queues.md) — 栈和队列的抽象结构与使用场景。
14. [链表与递归数据结构](cs61b/14-linked-lists-recursion.md) — SLL、递归结构、哨兵节点和空指针处理。
15. [双向链表与动态数组](cs61b/15-doubly-linked-lists.md) — 从单链表到双向链表，以及数组扩容的摊销思路。
16. [泛型集合入门](cs61b/16-generic-collections.md) — 用 List 和泛型组织一组同类型数据。
17. [多态、Comparable 与 Comparator](cs61b/17-comparable-comparator.md) — 亚型多态、参数化多态以及两套比较器接口。
18. [增长阶与并查集](cs61b/18-asymptotics-union-find.md) — Big-O、Big-Theta、Quick Find、Quick Union、按秩合并与路径压缩。

### 复杂度与树结构

19. [二叉搜索树](cs61b/19-binary-search-trees.md) — BST 定义、查找路径、插入删除与复杂度。
20. [B 树](cs61b/20-b-trees.md) — 从 BST 退化问题进入平衡树与 B 树结构。

## Python · 程序设计基础

从序列、字符串、字典和控制流开始，逐步进入函数、对象模型、文件、NumPy、Matplotlib、Pandas 与数据格式处理。

### 语言基础与程序流程

1. [序列与集合](python/01-sequences-and-collections.md) — 列表、元组、集合和序列操作。
2. [字符串](python/02-strings.md) — 字符串不可变性、索引、切片和常用方法。
3. [字典](python/03-dictionaries.md) — 键值映射、查找、更新和字典的典型使用方式。
4. [条件、循环与代码组织](python/04-control-flow.md) — 赋值、布尔判断、if、while、for、命名空间与常用内置工具。
5. [函数](python/05-functions.md) — def、参数传递、作用域与可变默认参数陷阱。

### 对象模型与数据处理

6. [封装](python/06-encapsulation.md) — 类、__init__、实例属性以及把状态和行为放在一起。
7. [异常处理](python/07-exceptions.md) — 异常与普通条件判断的区别，以及 try/except 的控制流。
8. [文件与流](python/08-files-and-streams.md) — 文件打开模式、读写与上下文管理。
9. [特殊方法、属性与迭代器](python/09-dunder-properties-iterators.md) — 容器协议、property、可迭代对象、迭代器与生成器。

### 数据分析工具箱

10. [NumPy 与 Matplotlib](python/10-numpy-matplotlib.md) — ndarray、向量化、广播、布尔索引与常用绘图 API。
11. [Pandas 数据分析](python/11-pandas.md) — Series、DataFrame、清洗、筛选、分组聚合和表格连接。
12. [正则表达式、JSON 与 CSV](python/12-regex-json-csv.md) — 文本模式匹配、结构化数据读写和常见数据交换格式。

## CS229 · Machine Learning

以 Stanford CS229 2018 课程为主线的机器学习笔记，覆盖监督学习、广义线性模型、生成学习、支持向量机、核方法与 Softmax 回归。

### 监督学习基础

1. [线性回归与梯度下降](cs229/01-linear-regression.md) — 监督学习基本框架、线性回归、批量与随机梯度下降、正规方程。
2. [局部加权与逻辑回归](cs229/02-weighted-logistic-regression.md) — LWR、线性回归的概率解释、逻辑回归与牛顿法。
3. [感知机与广义线性模型](cs229/03-perceptron-glm.md) — 感知机、指数族、GLM 的构造与 Softmax 概览。
4. [Softmax 回归](cs229/04-softmax-regression.md) — 从 GLM 推导多分类模型，讨论损失、梯度和数值实现。
5. [GDA 与朴素贝叶斯](cs229/05-gda-naive-bayes.md) — 生成学习、多元高斯、高斯判别分析、朴素贝叶斯与 Laplace 平滑。

### 间隔、对偶与核方法

6. [支持向量机](cs229/06-support-vector-machines.md) — 函数间隔、几何间隔、最优间隔分类器、拉格朗日对偶与 KKT。
7. [核方法与 SVM 对偶](cs229/07-kernels.md) — 核技巧、常见核函数、Mercer 定理与软间隔 SVM。
