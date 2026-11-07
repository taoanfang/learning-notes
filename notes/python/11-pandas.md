# Pandas 数据分析

<img src="../../docs/assets/images/python/Pasted%20image%2020260605133934.png" alt="Pasted image 20260605133934">



## 数据分析核心思想之一：SAC（split，add，combine）

## 一、AI 与数据分析基础

1. AI 底层依赖完整数据流程：数据收集→清洗→组织→分析→模型训练，大模型、推荐系统、自动驾驶均离不开数据分析，数据分析是计算机专业基础能力。
2. 数据铁律：Garbage In, Garbage Out（垃圾数据出垃圾结果），缺失、异常、错误数据无法被大模型自动修复，数据清洗必不可少。
3. Python 数据分析生态

- NumPy：高性能数组计算
- Pandas：结构化表格处理（本章核心）
- Matplotlib：数据可视化
- Scikit-learn：传统机器学习
- PyTorch/TensorFlow：深度学习

4. 标准数据分析流程：数据获取→数据清洗→数据筛选处理→数据分析→可视化→AI 落地
5. 数据来源：CSV、Excel、JSON、API、数据库；大模型输出多为 JSON 格式

## 二、Pandas 两大核心数据结构

导入固定代码：`import pandas as pd`

1. Series（一维）：索引 + 数值，带标签数组

    创建：`s = pd.Series([10,20],index=["a","b"])`
2. DataFrame（二维表格，对标 Excel / 数据库表）：行索引、列名、数值

    字典创建（最常用）：

explain text

```
data={"姓名":["张三"],"成绩":[88]}
df=pd.DataFrame(data)
```

## 三、数据查看操作

1. `df.shape` 返回 (行数，列数)
2. `df.index` 查看行索引；`df.columns` 查看列名
3. `df.head(n)` 前 n 行；`df.tail(n)` 后 n 行
4. `df.info()` 字段类型、缺失值统计
5. `df.describe()` 数值列统计：均值、最值、标准差、四分位数

## 四、数据清洗（80% 数据分析工作量）

缺失值标识：NaN

1. `df.dropna()` 删除含缺失值整行
2. `df.fillna(x)` 用 x 填充缺失值

    清洗对象：缺失值、异常值、重复数据

## 五、数据选取与切片

1. 基础 []

- 单列：`df["列名"]`
- 多列：`df"列1","列2"`
- 行切片：`df[1:3]` 左闭右开

2. loc：按标签（行名、列名）取值

    `df.loc[行标签,列标签]`
3. iloc：按数字下标取值，只看位置

    `df.iloc[行下标,列下标]`
4. 布尔条件筛选（高频）

    `df[df["分数"]>80]` 筛选满足条件数据

## 六、列操作、排序、基础统计

### 1. 增改列

`df["总分"]=df["数学"]+df["英语"]`

### 2. 删除列

`df.drop("列名",axis=1)` / `del df["列名"]`

### 3. 重命名

`df.rename(columns={"旧名":"新名"})`

### 4. 排序

- `sort_values("字段",ascending=False)` 按数值降序
- `sort_index()` 按行索引排序

### 5. 基础统计

单列：mean 均值、max 最大、min 最小、sum 总和、count 有效数量

全表统计：df.describe ()

## 七、分组聚合（Split-Apply-Combine）

1. groupby 基础分组

    `df.groupby("分组字段")["数值列"].mean()`

    配套：.sum ()/.max ()/.size () 统计每组数量
2. agg 多聚合：同时计算多个指标

    `grouped["数学"].agg(["mean","max","min","count"])`
3. apply 自定义函数

    `df.apply(函数,axis=1)` axis=1 按行处理

## 八、高级表格函数

1. pivot_table 透视表（多维度数值聚合）

    参数：index 行分组、values 统计字段、aggfunc 聚合方式
2. crosstab 交叉表（分类计数统计）

    `pd.crosstab(index=df["班级"],columns=df["性别"],margins=True]`

    margins=True 自动生成汇总行列

## 九、多表合并 concat & merge

1. pd.concat 纯拼接，无匹配

- 纵向上下合并：`pd.concat([df1,df2],ignore_index=True)` 重置索引
- 横向左右合并：`pd.concat([df1,df2],axis=1)`

    适用：两张表结构完全相同

2. pd.merge 关联连表（类似 SQL）

    语法：`pd.merge(表1,表2,on="关联字段",how="连接方式")`

    四种连接：

- inner：内连接，只保留匹配数据（交集）
- left：左连接，保留左表全部数据
- right：右连接，保留右表全部数据
- outer：全连接，两张表所有数据（并集）

## 十、综合案例：MovieLens 电影推荐系统

1. 读取特殊分隔符文件

    `pd.read_csv(path,sep="::",engine="python",names=[列名],encoding="latin1")`
2. 多表合并：多次 merge 拼接用户、评分、电影表
3. 分析步骤

    ① groupby 电影名求平均分 ② count 统计评分人数 ③ 过滤评分≥250 热门电影

    ④ pivot_table 按性别分组统计评分 ⑤ 计算男女评分差值，对比观影偏好

## 十一、核心结论

1. AI 数据助手可自动写代码、绘图、基础统计，但无法替代人做问题定义、数据解读、业务分析。
2. DataFrame 对比列表优势：原生支持筛选、分组、统计、多表合并，专门处理结构化表格数据。
3. 完整数据分析流程：读取→清洗→筛选→聚合→可视化→AI 应用
