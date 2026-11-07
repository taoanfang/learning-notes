# NumPy 与 Matplotlib

## NumPy = Python 里专门做高速数值计算的库，核心是 ndarray 数组

### 全0/全1

`np.zeros(3) # [0. 0. 0.]`
`np.zeros((2,3)) # 2行3列
`np.ones((2,2)) # 2行2列全1`

### 等差序列

`np.arange(1,10,2) # 1,3,5,7,9`

### 等分

`np.linspace(2,3,5) # [2. , 2.25, 2.5 , 2.75, 3. ]`

### 数组变形 reshape(将一维拉成二维)

`a = np.arange(12) # 0~11
`b = a.reshape(3,4) # 3行4列`


### 四个核心属性
`a.ndim # 维度：1 维、2 维…
`a.shape # 形状：(行数,列数)
`a.size # 总元素个数
`a.dtype # 数据类型 int64/float64`


### 常用统计函数
`arr = np.array([[1,2,3],[4,5,6]])
`np.sum(arr) # 全部求和 21
`np.sum(arr, axis=0) #按列求和 [5,7,9]
`np.sum(arr, axis=1) # 按行求和 [6,15]
`arr.max()
`arr.min()
`arr.mean() # 求平均值

## ==list 切片：改切片不影响原列表,nd array 切片：**改切片会改原数组**==

`arr = np.array([1,2,3,4,5])
`sub = arr[1:4]
`sub[0] = 100
`print(arr) # [ 1 100 3 4 5]`

==若想安全复制，使用**sub = arr[1:4].copy()**==



## Random随机模块
`np.random.seed(10) # 按照种子随机生成
`np.random.rand(5) # 0~1均匀随机
`np.random.randn(3,4) # 正态分布
`np.random.randint(1,10,5) # 随机整数`

### 常用数学函数
`np.sqrt([4,9,16]) # 开方
`np.abs([-1,-2,3]) # 绝对值
`np.square([2,3,4]) # 平方
`np.exp([1,2]) # 指数
`e^x np.log([1,10]) # 自然对数`


## ==向量化 vs 广播（NumPy 灵魂）==



## 一、NumPy 数值计算库

### 1. NumPy 基础概述

1. 全称：Numerical Python，Python 科学计算底层核心库，所有数据分析、AI 运算依赖它。
2. 核心对象：`ndarray` 多维同类型数组。
3. ndarray vs Python list 核心区别

| Python list                     | ndarray          |
| ------------------------------- | ---------------- |
| 可存储不同数据类型                       | 全部元素类型统一         |
| 内存分散存储，运算速度慢                    | 连续内存，底层批量运算，速度极快 |
| 不支持整体批量运算，需循环                   | 原生支持数组整体运算（向量化）  |
| 结论：ndarray 更适合大数据、科学计算、AI 模型运算。 |                  |

### 2. ndarray 4 种创建方式

python

运行

```
import numpy as np
# 1. 列表转数组
arr = np.array([1,2,3])
# 2. 全0数组，参数为形状(行,列)
np.zeros((2,3))
# 3. 全1数组
np.ones((2,2))
# 4. 等差数组
np.arange(start, stop, step)  # 整数等差，左闭右开
np.linspace(起始,终止,num=份数) # 浮点均匀分割，高精度绘图常用
```

4. 数组变形：`reshape(行,列)`，元素总数必须匹配


```
a = np.arange(12)
b = a.reshape(3,4) # 转为3行4列二维数组
```

### 3. ndarray 四大常用属性

1. `arr.ndim`：数组维度（一维 / 二维）
2. `arr.shape`：数组形状，一维`(n,)`，二维`(行数,列数)`
3. `arr.size`：数组全部元素总个数
4. `arr.dtype`：数组元素数据类型（int64/float64）

### 4. 数组运算

1. 对位运算：两个数组相同位置元素直接加减乘除，无需循环

```
a = np.array([1,2,3])
b = np.array([4,5,6])
print(a + b) # [5 7 9]
```

2. 全局统计函数，支持`axis`控制运算维度

- `np.sum(arr)`：全部元素求和
- `np.sum(arr, axis=0)`：按**列**求和
- `np.sum(arr, axis=1)`：按**行**求和
- `arr.max()/arr.min()/arr.mean()`：最大值、最小值、平均值

### 5. 数组索引与切片（高频考点）

1. 基础取值：`b[行下标,列下标]`
2. 切片语法

```
b[0,:]   # 取第0行全部列
b[:,1]   # 取全部行，第1列
b[1:3,:] # 取1、2两行，所有列（左闭右开）
```

3. 切片关键特性：视图（view）

- NumPy 切片默认不复制数据，修改切片会直接改变原数组；
- Python 列表切片是拷贝，修改子切片不影响原列表；
- 如需独立数据，使用`.copy()`深拷贝：`sub = arr[1:4].copy()`

### 6. np.random 随机数组模块（批量生成随机数）

1. `np.random.rand(shape)`：0~1 均匀分布浮点数
2. `np.random.randn(shape)`：标准正态分布（均值 0，方差 1），绘图实验常用
3. `np.random.randint(low, high, num)`：生成指定区间随机整数（左闭右开）
4. `np.random.seed(数字)`：固定随机种子，每次运行随机结果完全一致
5. 对比原生`random`库：原生只能单次生成 1 个数字，需要循环；numpy 可批量生成多维随机数组，效率更高。

### 7. 全局数学函数（向量化运算，无需循环）

对数组全部元素统一计算：

- `np.sqrt()` 开平方
- `np.abs()` 绝对值
- `np.square()` 平方
- `np.exp()` 自然指数
- `np.log()` 自然对数

### 8. 两大核心思想：向量化 + 广播

1. **向量化 Vectorization**

    不写 for 循环，直接对整个数组批量运算；优势：代码简洁、运算速度快、适配海量 AI 数据。

    示例：`arr * 2` 全体元素统一乘 2，无循环。
2. **广播 Broadcasting**

    两个形状不同的数组运算时，NumPy 自动扩展维度至匹配形状再计算；最常见：数组 + 标量（数字自动扩展成全同值数组）。
3. 区分：向量化是整体运算思想；广播是形状自动适配的配套机制。

### 9. 布尔索引（数据筛选核心）

利用布尔数组过滤符合条件的数据，数据分析、AI 置信度筛选高频用法

```
arr = np.array([1,2,3,4,5])
print(arr > 3) # 输出布尔数组 [False False False True True]
print(arr[arr>3]) # 筛选大于3的元素 [4,5]
```

### 10. 课堂练习 1 考点

需求：创建数组、查看 shape、向量化整体运算、布尔索引筛选；

思考题：NumPy 不推荐 for 循环，因为循环速度远低于底层向量化批量运算。

## 二、Matplotlib 数据可视化绘图库

### 1. Matplotlib 基础介绍

1. 模仿 MATLAB 绘图接口，生成出版级图表；支持导出 PNG/PDF/SVG/JPG 等格式。
2. 作用：可视化数据，快速发现异常、趋势、规律，是数据分析收尾步骤。

### 2. 环境安装与 IPython 交互

1. 安装命令：`pip3 install matplotlib ipython`
2. IPython 交互：输入`%matplotlib`魔法命令，自动配置图形后端，绘图窗口正常显示。

### 3. 绘图层级架构（必背）

`Figure`（画布，最外层）→ `Axes`（子图 / 坐标系，所有图形画在 Axes 上）→ 坐标轴、折线、柱状图、图例、文字等元素。

### 4. 两种绘图模式

1. **隐式模式（简易绘图）**

    直接`plt.plot()`，系统自动创建默认画布 + 单张子图，代码简短，适合简单图表。
2. **显式模式（考试推荐，复杂绘图）**

    手动创建画布与子图，可控性强：`fig, ax = plt.subplots()`

### 5. 画布与子图创建语法

1. 单画布单张子图

```
fig = plt.figure(figsize=(8,5)) # figsize设置画布宽高英寸
ax = fig.add_subplot(111) # 1行1列第1个子图
```

2. 批量创建多子图（最常用）

```
fig, axes = plt.subplots(nrows=2, ncols=3) # 2行3列共6个子图
axes[i,j] # 索引第i行第j列子图
```

3. subplots 常用参数

- `sharex/sharey=True`：所有子图共享坐标轴刻度
- `figsize`：统一设置画布大小

4. 调整子图间距：`plt.subplots_adjust(wspace=0, hspace=0)`，w 横向间距、h 纵向间距

### 6. 五类基础绘图函数（ax 对象调用）

1. `ax.plot()`：折线图，展示连续数据趋势
2. `ax.bar()`：柱状图，对比分类数值
3. `ax.scatter()`：散点图，展示两组数据相关性
4. `ax.hist()`：直方图，统计数值分布，bins = 柱子数量，alpha = 透明度
5. `ax.pie()`：饼图，展示占比，不可叠加绘制

### 7. 线条、标记、颜色样式

1. 简写格式字符串：`'ko--'` 黑色、圆形标记、虚线
2. 完整参数写法：`color='k', linestyle='dashed', marker='o'`
3. 常用缩写对照表

- 颜色：b 蓝、g 绿、r 红、k 黑、w 白
- 线型：`-`实线、`--`虚线、`-.`点划线、`:`点线
- 标记：o 圆圈、^ 上三角、s 正方形、* 星号、. 小点

### 8. 中文乱码解决（必考）
```
import matplotlib
# 设置黑体，支持中文
matplotlib.rcParams['font.family'] = 'SimHei'
# 负号正常显示，不变成方框
matplotlib.rcParams['axes.unicode_minus'] = False
```

### 9. 坐标轴、标题、刻度、图例设置

1. 标题与轴名

    `ax.set_title("图表标题")`

    `ax.set_xlabel("横轴名称")` / `ax.set_ylabel("纵轴名称")`
2. 自定义刻度

    `ax.set_xticks([0,250,500])` 设置刻度位置

    `ax.set_xticklabels(['一','二','三'], rotation=30)` 设置刻度文字、旋转角度
3. 图例 legend

    绘图时传入`label="系列名称"`，最后调用`ax.legend(loc='best')`自动最优位置展示图例

### 10. 图片保存 savefig
```
plt.savefig("test.png", dpi=400, bbox_inches='tight')
```

参数说明：

- fname：文件路径，后缀自动识别 png/pdf/svg；
- dpi：图像分辨率；
- bbox_inches='tight'：裁剪图表四周空白边距。

### 11. Matplotlib 全局配置 rc

统一修改全局样式（字体、画布大小、图例）

```
# 全局设置画布尺寸
plt.rc('figure', figsize=(10,10))
# 批量设置字体
font_cfg = {'family':'monospace','weight':'bold','size':14}
plt.rc('font',**font_cfg)
```

## 三、本章整体总结

1. NumPy 提供高性能多维数组 ndarray，依靠**向量化 + 广播**实现无循环高速数值运算，是 Pandas、AI 模型底层依赖；核心操作包含数组创建、变形、切片、统计、布尔筛选、随机数生成。
2. Matplotlib 是数据分析可视化工具，依托画布 Figure、子图 Axes 架构绘制各类图表，支持自定义线条、文字、图例，可导出高清图片，用于直观展示数据规律。
3. 完整数据分析链路：NumPy 批量数值计算 → Pandas 结构化表格处理 → Matplotlib 可视化出图，三者构成 Python 数据分析完整技术栈。
