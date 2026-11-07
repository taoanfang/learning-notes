# 字典

## 字典的本质：映射（mapping）key--value  {}
### key必须可哈希，且不可变
==本质原因：字典通过“hash(key)”来查找==

## 哈希表原理（set，dict）——==“计算位置”==
###  key → hash （哈希）函数 → 数组下标（ index ）→直接访问
### 哈希函数：将任意键值投入函数中，计算其位置


## 字典的操作，时空间复杂度
### 字典构造
`D={} # 构造空字典`
`D={'name':'Bob','age':40}`
`E={'cto':{'name':'Bob','age':40}} # 字典中的嵌套`
`print(D)`
`{'name':'Bob', 'age':40}`
`print(E)`
`{'cto':{'name':'BOb', 'age':40}}`
`D = dict(name=‘Bob’, age=40)
#`字典的第二种构造方法，使用关键字参数方式构造字典，将参数名作为键`
`E = dict([('name', 'Bob'), ('age', 40)])`
#`第三种构造方法，用列表套元组创建字典`
`print(D)`
`{'name': 'Bob', 'age': 40}`
`print(E)`
`{'name': 'Bob', 'age': 40}`
#`第四种方法，用 zip 打包两个列表创建`
`keys = ["name", "age"] values = [" 张三 ", 20]`
`d = dict(zip(keys, values))
`d.keys()`：返回所有键的视图对象
`d.values()`：返回所有值的视图对象
`d.items()`：返回所有 (键，值) 元组，最常用于遍历`

#### 安全访问

- `d.get(key, default=None)`：键不存在不报错，返回 None 或自定义默认值
- `d.setdefault(key, default)`：键不存在则新增键和默认值，同时返回对应值

#### 更新与删除

- `d.update(另一个字典)`：批量更新，已有键覆盖，新键自动新增
- `d.pop(key)`：删除键并返回对应值，键不存在报错
- `d.popitem()`：删除最后插入的键值对（LIFO 栈行为）
- `d.clear()`：原地清空所有键值对，无返回值

#### 拷贝

- `d.copy()`：**浅拷贝**，只复制第一层，嵌套的可变对象共用引用
- 深拷贝：`import copy; copy.deepcopy(d)`，递归复制所有层级，新旧对象完全独立
- 浅拷贝其他实现：`dict(d)`、列表 `[:]`、`list(列表)`

### key in dict(判断)，返回值为T/F



## 字典的现代用法
### 字典推导式：语法：{k:v for 变量 in 可迭代对象}
==key若重复，保留最后一赋值==



## 字典，列表，集合对比
