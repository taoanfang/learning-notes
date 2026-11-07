# 二叉搜索树

## Extend

## Time Series
红黑树实现细节


## ADT 抽象数据类型基础

1. **ADT 定义**：仅规定对外操作接口，不限制底层实现；同一 ADT 可多种实现
2. 课程涉及 ADT 与实现：
    - Deque：ArrayDeque、LinkedListDeque
    - Set：ArraySet、TreeSet（BST）、HashSet
    - Map：TreeMap（BST）、HashMap
3. Java 集合层级
    - `Collection` → List / Set；独立顶层接口 `Map`
    - TreeSet / TreeMap 底层基于二叉搜索树（进阶为红黑树）


## 二分查找（二叉树）BST

### 1. BST 由来
引入：由于ArrayList的缺陷（时间复杂度O(n)）,所以我们引入中间节点


### 2. BST 严格定义

1. 基础：有根二叉树，每个节点最多 2 个子节点（左、右）
2. **BST 核心性质（全局必须满足）**
    - 任意节点 X：左子树所有键 ＜ X.key；右子树所有键 ＞ X.key
3. 约束：键具备全序、传递、反对称性，**不允许重复键**
4. 性能与树形态
    - 均衡茂密 BST：树高 ≈ log₂N，操作复杂度 Θ(log N)
    - 链式斜树（全部左 / 右子节点）：退化为链表，复杂度 Θ(N)

### 3. BST 三大基础操作

#### （1）contains 查找（递归）

```
static BST find(BST T, Key sk) {
    if (T == null) return null; // 递归基：空子树，不存在
    if (sk.equals(T.key)) return T;
    else if (sk ≺ T.key) return find(T.left, sk);
    else return find(T.right, sk);
}
```

#### （2）insert 插入（递归）

规则：重复键直接忽略，新节点永远作为叶子节点创建

```
static BST insert(BST T, Key ik) {
    if (T == null) return new BST(ik); // 空位新建节点
    if (ik ≺ T.key) T.left = insert(T.left, ik);
    else if (ik ≻ T.key) T.right = insert(T.right, ik);
    return T;
}
```

- 避坑：禁止**长臂递归**，不要提前判断子节点是否为空，递归到 null 再创建更简洁

#### （3）Hibbard 删除（3 种场景）

删除目标：删除后仍满足 BST 性质

1. **场景 1：无子女（叶子节点）** 直接切断父节点指向该节点的引用，等待 GC 回收
2. **场景 2：仅有 1 个子节点** 父节点指针直接指向唯一子节点，完成替换
3. **场景 3：同时存在左右子节点（Hibbard 核心）**
    - 二选一替换：左子树最大值（前驱） / 右子树最小值（后继）
    - 操作：用前驱 / 后继覆盖待删节点值，再删除原前驱 / 后继（必为场景 1/2）
