# 支持向量机

# CS229 · Support Vector Machines（支持向量机）

> **课程**：Stanford CS229 (Autumn 2018) · Andrew Ng
> **本讲主题**：间隔（margin）直觉、函数间隔与几何间隔、最优间隔分类器、Lagrange 对偶与 KKT 条件、SVM 的对偶形式
> **视频**：[Lecture 6 - Support Vector Machines](https://www.youtube.com/watch?v=lDwow4aOrtg)

---

## 一、动机：从"分对"到"分得自信"

  逻辑回归中 $h_\theta(x) = g(\theta^T x)$，因此 $p(y=1\mid x;\theta)$ 随 $\theta^T x$ 增大 而增大。也就是说 $\theta^T x$ 离 0 越远，我们对"标签是 1"就**越有把握**。

考虑决策边界 $\theta^T x = 0$ 与下图中的三个点：

| 点 | 位置 | 含义 |
|---|---|---|
| A | 离边界很远 | 预测 $y=1$ 非常自信 |
| B | 居中 | 中等自信 |
| C | 紧贴边界 | 边界稍微动一点，预测就可能翻转成 $y=0$ |

> 🔑 由此产生一个朴素目标：**找到一条边界，让所有训练样本既分类正确、又都离边界足够远**——这就是 SVM 的"大间隔"思想。

---

## 二、记号：为 SVM 换一套写法

| 旧（回归 / 逻辑回归） | 新（SVM） |
|---|---|
| $y \in \{0,1\}$ | $y \in \{-1,+1\}$ |
| 参数 $\theta$；$h_\theta(x) = g(\theta^T x)$，用 $x_0 \equiv 1$ 吸收截距 | 参数 $w,b$；$h_{w,b}(x) = g(w^T x + b)$，**不再**加 $x_0$ |
| 输出概率 $p(y=1)$ | 直接输出 $\pm 1$：$g(z) = 1$（当 $z \ge 0$），否则 $-1$ |

- $b$ 显式充当原来的 $\theta_0$（截距），$w$ 相当于 $[\theta_1,\dots,\theta_d]^T$
- 分类器**直接输出 $\pm 1$**（类似感知机），不经过"估计 $p(y=1)$"这一步

---

## 三、函数间隔与几何间隔

### 1. 函数间隔（functional margin）

单个样本的**函数间隔**定义为

$$
\hat\gamma^{(i)} = y^{(i)}\left(w^T x^{(i)} + b\right)
$$

- $y^{(i)} = 1$ 时，希望 $w^Tx^{(i)}+b$ 是一个**大的正数**
- $y^{(i)} = -1$ 时，希望 $w^Tx^{(i)}+b$ 是一个**大的负数**
- 因此 $\hat\gamma^{(i)} > 0$ ⇔ **分类正确**（可自行验算）

对训练集整体定义

$$
\hat\gamma = \min_{i=1,\dots,n}\hat\gamma^{(i)}
$$

**关键缺陷**：$g$ 只依赖 $w^Tx+b$ 的**符号**，所以把 $(w,b)$ 换成 $(2w,2b)$ 决策边界完全不变，但函数间隔被放大 2 倍（想放大多少都行）→ **函数间隔不能直接当作"置信度"**。

⇒ 需要归一化，例如强制 $\|w\|_2 = 1$：等价于考察 $\left(w/\|w\|_2,\ b/\|w\|_2\right)$ 的函数间隔。

### 2. 几何间隔（geometric margin）

几何间隔是样本到决策边界的**真实欧氏距离** $\gamma^{(i)}$。

推导（图中 A 点是 $x^{(i)}$，B 是它在决策边界上的投影）：$w$ 与超平面**正交**，所以 $w/\|w\|$ 是单位法向量，且

$$
B = x^{(i)} - \gamma^{(i)}\cdot\frac{w}{\|w\|}
$$

B 落在决策边界上，满足 $w^TB+b=0$，代入得

$$
w^T\left(x^{(i)} - \gamma^{(i)}\frac{w}{\|w\|}\right) + b = 0
\qquad\Longrightarrow\qquad
\gamma^{(i)} = \frac{w^Tx^{(i)}+b}{\|w\|}
$$

上面的推导假设 $y^{(i)}=1$ 且落在正侧；写成分隔形式（对任意标签都成立）：

$$
\boxed{\;\gamma^{(i)} = y^{(i)}\left(\left(\frac{w}{\|w\|}\right)^T x^{(i)} + \frac{b}{\|w\|}\right)\;}
$$

对训练集整体：$\gamma = \min_{i=1,\dots,n}\gamma^{(i)}$。

**两个关键性质**：

- **对缩放不变**：$(w,b)\to(2w,2b)$ 时 $\gamma^{(i)}$ 不变 → 所以可以**任意施加缩放约束**（$\|w\|=1$、$\|w\|=5$、$|w_1|+|w_2|+b=2$ 都行，重新缩放即可满足）
- 当 $\|w\|=1$ 时，**函数间隔 = 几何间隔**（两个概念之间的桥梁）

---

## 四、最优间隔分类器（Optimal Margin Classifier）

**先假设训练集线性可分**（存在某个超平面把正负样本完全分开）。目标是最大化几何间隔。

### 1. 最直接的写法不好解

$$
\max_{\gamma,w,b}\ \gamma
\qquad\text{s.t.}\qquad
y^{(i)}\left(w^Tx^{(i)}+b\right)\ge\gamma,\ \ i=1..n,
\qquad \|w\| = 1
$$

约束 $\|w\|=1$ 是**非凸**的，不能直接交给标准优化软件。

### 2. 换成函数间隔当目标，仍然不好解

利用 $\gamma = \hat\gamma/\|w\|$，可以去掉 $\|w\|=1$：

$$
\max_{\hat\gamma,w,b}\ \frac{\hat\gamma}{\|w\|}
\qquad\text{s.t.}\qquad
y^{(i)}\left(w^Tx^{(i)}+b\right)\ge\hat\gamma,\ \ i=1..n
$$

但目标 $\hat\gamma/\|w\|$ 依然是**非凸**的。

### 3. 关键一步：用缩放自由度把 $\hat\gamma$ 定成 1

因为 $(w,b)$ 可以自由缩放而几何间隔不变，我们可以**任意指定函数间隔的大小**。取

$$
\hat\gamma = 1
$$

于是"最大化 $1/\|w\|$"等价于"**最小化 $\|w\|^2$**"：

$$
\boxed{\;\min_{w,b}\ \frac{1}{2}\|w\|^2
\qquad\text{s.t.}\qquad
y^{(i)}\left(w^Tx^{(i)}+b\right)\ge 1,\ \ i=1,\dots,n\;}
$$

- 现在是**凸二次目标 + 线性约束** → 就是标准 **QP（二次规划）**问题，用现成 QP 求解器即可
- 这就是**最优间隔分类器**，也是 SVM 的出发点

> 🔑 三个等价改写要记牢：`max γ, ‖w‖=1` → `max γ̂/‖w‖` → `min ½‖w‖², s.t. γ̂=1`。

---

## 五、Lagrange 对偶（通往 SVM 对偶形式的桥）

### 1. 回顾：只有等式约束（Lagrange 乘子法）

$$
\min_w f(w)\qquad\text{s.t.}\qquad h_i(w)=0,\ i=1..l
$$

定义 Lagrangian $\mathcal{L}(w,\beta) = f(w) + \sum_{i=1}^{l}\beta_i h_i(w)$，然后令 $\nabla_w\mathcal{L}=0$、$\frac{\partial\mathcal{L}}{\partial\beta_i}=0$，解出 $w,\beta$。

### 2. 推广：含不等式约束（广义 Lagrangian）

**原问题（primal）**：

$$
\min_w f(w)\qquad\text{s.t.}\qquad
g_i(w)\le 0\ (i=1..k),\qquad h_i(w)=0\ (i=1..l)
$$

**广义拉格朗日函数**：

$$
\mathcal{L}(w,\alpha,\beta) = f(w) + \sum_{i=1}^{k}\alpha_i g_i(w) + \sum_{i=1}^{l}\beta_i h_i(w),
\qquad \alpha_i \ge 0
$$

（$\alpha_i$ 配不等式约束，$\beta_i$ 配等式约束。）

定义（下标 P 表示 primal）：

$$
\theta_P(w) = \max_{\alpha,\beta:\,\alpha_i\ge 0}\ \mathcal{L}(w,\alpha,\beta)
$$

- 若 $w$ **违反**约束（某个 $g_i(w)>0$，或某个 $h_i(w)\ne 0$）：可取 $\alpha_i\to\infty$（或选 $\beta_i$ 的符号）使 $\theta_P(w) = +\infty$
- 若 $w$ **满足**约束：$\theta_P(w) = f(w)$

因此原问题等价于

$$
\min_w \theta_P(w) = \min_w \max_{\alpha,\beta:\,\alpha_i\ge 0}\ \mathcal{L}(w,\alpha,\beta)
$$

其最优值记作 $p^*$。

### 3. 对偶问题

$$
\theta_D(\alpha,\beta) = \min_w \mathcal{L}(w,\alpha,\beta)
$$

$$
d^* = \max_{\alpha,\beta:\,\alpha_i\ge 0}\ \theta_D(\alpha,\beta)
= \max_{\alpha,\beta:\,\alpha_i\ge 0}\ \min_w \mathcal{L}(w,\alpha,\beta)
$$

对偶问题就是把原问题的 **max / min 交换顺序**。

**弱对偶（恒成立）**：

$$
d^* = \max_{\alpha\ge 0,\beta}\min_w\mathcal{L}\ \le\ \min_w\max_{\alpha\ge 0,\beta}\mathcal{L} = p^*
$$

（"函数的 max-min 一定 ≤ min-max"，可自行论证。）

### 4. 什么时候 $d^*=p^*$（强对偶）

若满足：

- $f$ 与所有 $g_i$ **凸**（$h_i$ 是**仿射**的，即 $h_i(w)=a_i^Tw+b_i$）
  - $f(w)=w^Tw$ 这类二次函数是凸的；线性/仿射函数也是凸的
- 存在某个 $w$ 使所有 $g_i(w)<0$（约束**严格可行**）

则存在 $w^*,\alpha^*,\beta^*$：$w^*$ 是原问题最优解，$\alpha^*,\beta^*$ 是对偶问题最优解，且

$$
p^* = d^* = \mathcal{L}(w^*,\alpha^*,\beta^*)
$$

并且 $w^*,\alpha^*,\beta^*$ 满足下面的 **KKT 条件**。

### 5. KKT 条件（五条）

$$
\frac{\partial}{\partial w_i}\mathcal{L}(w^*,\alpha^*,\beta^*) = 0,\qquad i=1,\dots,d
$$

$$
\frac{\partial}{\partial \beta_i}\mathcal{L}(w^*,\alpha^*,\beta^*) = 0,\qquad i=1,\dots,l
$$

$$
\alpha_i^*\,g_i(w^*) = 0,\qquad i=1,\dots,k
\qquad\text{（互补松弛，dual complementarity）}
$$

$$
g_i(w^*)\le 0,\qquad \alpha_i^*\ge 0,\qquad i=1,\dots,k
$$

并且：**若某组 $w^*,\alpha^*,\beta^*$ 满足 KKT 条件，则它同时是原问题和对偶问题的最优解。**

> 🔑 互补松弛 $\alpha_i^*g_i(w^*)=0$ 的含义：**$\alpha_i^*>0 \Rightarrow g_i(w^*)=0$**，即该约束取等号（是"起作用"的约束）。这一条直接决定了 SVM 只有很少的**支持向量**，也是 SMO 算法收敛判据的来源。

---

## 六、把对偶用在最优间隔分类器上 → SVM

### 1. 把约束写成标准形式

$$
g_i(w) = -y^{(i)}\left(w^Tx^{(i)}+b\right) + 1 \le 0
$$

**每个训练样本对应一个约束**。（没有等式约束，所以只有 $\alpha_i$，没有 $\beta_i$。）

拉格朗日函数：

$$
\mathcal{L}(w,b,\alpha) = \frac{1}{2}\|w\|^2 - \sum_{i=1}^{n}\alpha_i\left[y^{(i)}\left(w^Tx^{(i)}+b\right) - 1\right]
$$

### 2. 先对 $w,b$ 求极小

$$
\nabla_w\mathcal{L}(w,b,\alpha) = w - \sum_{i=1}^{n}\alpha_i y^{(i)}x^{(i)} = 0
\qquad\Longrightarrow\qquad
\boxed{\;w = \sum_{i=1}^{n}\alpha_i y^{(i)}x^{(i)}\;}\tag{★}
$$

$$
\frac{\partial}{\partial b}\mathcal{L}(w,b,\alpha) = \sum_{i=1}^{n}\alpha_i y^{(i)} = 0 \tag{★★}
$$

### 3. 代回，得到对偶问题

把 (★)(★★) 代回 $\mathcal{L}$ 并化简，得到：

$$
\boxed{\;\max_{\alpha}\ W(\alpha) = \sum_{i=1}^{n}\alpha_i
- \frac{1}{2}\sum_{i,j=1}^{n}y^{(i)}y^{(j)}\alpha_i\alpha_j\left\langle x^{(i)},x^{(j)}\right\rangle\;}
$$

$$
\text{s.t.}\qquad \alpha_i\ge 0\ \ (i=1,\dots,n),
\qquad \sum_{i=1}^{n}\alpha_i y^{(i)} = 0
$$

- 优化变量变成 $n$ 个 $\alpha_i$；该问题满足强对偶条件（KKT 成立），因此**解对偶等价于解原问题**
- 求出 $\alpha^*$ 后，用 (★) 还原 $w^*$；截距 $b^*$ 由下式给出：

$$
b^* = -\,\frac{\max_{i:y^{(i)}=-1}w^{*T}x^{(i)} + \min_{i:y^{(i)}=1}w^{*T}x^{(i)}}{2}
$$

### 4. 支持向量（Support Vectors）

由互补松弛条件：**$\alpha_i>0$ 只能出现在函数间隔恰好等于 1 的样本上**（此时约束取等号，$g_i(w^*)=0$）。

这些点正是**离决策边界最近的点**，称为**支持向量**：

- 只有支持向量对 $w$ 有贡献，其余样本 $\alpha_i=0$
- 支持向量个数通常**远小于**训练集规模 $n$

> 图示：最大间隔超平面用实线表示，两侧虚线（间隔边界）正好穿过支持向量；例子里只有 3 个点（2 个正例、1 个负例）是支持向量。

### 5. 预测：算法只用内积！

用 (★) 展开预测值：

$$
w^Tx+b = \left(\sum_{i=1}^{n}\alpha_i y^{(i)}x^{(i)}\right)^Tx + b
= \sum_{i=1}^{n}\alpha_i y^{(i)}\left\langle x^{(i)},x\right\rangle + b
$$

预测规则：$w^Tx+b>0$ ⇒ 预测 $y=1$，否则 $y=-1$。

- 因为 $\alpha_i$ 只对支持向量非零，实际只需计算新样本 $x$ 与**支持向量**的内积
- **训练（对偶问题）与预测都只用内积 $\langle x^{(i)},x^{(j)}\rangle$ 表达** → 这正是下一讲 **kernel trick** 的钥匙：把内积换成核函数 $K(x,z)$，就能在极高维（甚至无穷维）特征空间中高效工作，而完全不必显式写出 $\phi(x)$

> 🔑 本讲最该带走的两条结论：
> 1. 原问题与对偶问题等价（(★)(★★) 把 $w,b$ 与 $\alpha$ 联系起来）
> 2. 整个算法可以只用内积表达 → 直接支撑核方法

---

## 七、本讲的边界与后续

本讲（2018 秋 Lecture 6）建立在**数据线性可分**的假设上，讲到"最优间隔分类器 + Lagrange 对偶 + 对偶形式 + 只用内积的结构"为止。接下来：

| 主题 | 解决什么 |
|---|---|
| **Kernels（核技巧）** | 高维/无穷维特征空间中的隐式计算；合法核的判定（核矩阵对称半正定，Mercer 定理）；高斯核、多项式核、子串核 |
| **软间隔 / $\ell_1$ 正则化** | 数据不可分或有离群点：$\min_{w,b}\frac12\|w\|^2 + C\sum_i\xi_i$，s.t. $y^{(i)}(w^Tx^{(i)}+b)\ge 1-\xi_i$，$\xi_i\ge 0$；对偶中只把 $\alpha_i\ge 0$ 改成 $0\le\alpha_i\le C$ |
| **SMO 算法** | 高效求解对偶：等式约束 $\sum_i\alpha_i y^{(i)}=0$ 使单个 $\alpha_i$ 无法单独变动，所以每次**同时更新两个** $\alpha_i,\alpha_j$（坐标上升 + KKT 收敛判据，$tol\approx0.01\sim0.001$）|

---

## 易混点速查

- **函数间隔 vs 几何间隔**：函数间隔可以靠缩放任意放大，只有几何间隔（真实距离）能当"置信度"
- **为什么敢令 $\hat\gamma=1$**：几何间隔对 $(w,b)$ 缩放不变，缩放自由度正好用来固定函数间隔
- **不等号方向**：约束写成 $g_i(w)\le 0$ 时 $g_i(w) = -y^{(i)}(w^Tx^{(i)}+b)+1$，别漏负号
- **max-min 顺序**：恒有 $d^*\le p^*$；强对偶需要"凸 + 严格可行"
- **支持向量的判定**：在 $\hat\gamma=1$ 的约定下，函数间隔恰为 1 的样本（$g_i(w^*)=0$）才是支持向量

---

## 小结

```
起点：逻辑回归里 θᵀx 越大越自信  ──▶  "希望所有样本都远离决策边界"（大间隔）
        │
        ├─ 记号：y ∈ {−1,+1}，参数 (w,b)，直接输出 ±1
        │
        ├─ 函数间隔 γ̂ = y(wᵀx+b)          —— 缩放可变，不能当置信度
        ├─ 几何间隔 γ  = y((w/‖w‖)ᵀx + b/‖w‖) —— 缩放不变，是真实距离
        │
        ├─ 最优间隔分类器：max γ, ‖w‖=1  →  max γ̂/‖w‖  →  min ½‖w‖², s.t. y(wᵀx+b) ≥ 1（凸 QP）
        │
        ├─ Lagrange 对偶：原问题 min-max 得 p*，对偶 max-min 得 d*，恒有 d* ≤ p*
        │      凸 + 严格可行 ⇒ d* = p*，且满足 KKT 五条
        │      互补松弛 αᵢgᵢ(w*) = 0 ⇒ αᵢ > 0 只出现在支持向量上
        │
        └─ 对偶形式：max Σαᵢ − ½Σ y⁽ⁱ⁾y⁽ʲ⁾αᵢαⱼ⟨x⁽ⁱ⁾,x⁽ʲ⁾⟩  s.t. αᵢ ≥ 0, Σαᵢy⁽ⁱ⁾ = 0
               w = Σαᵢy⁽ⁱ⁾x⁽ⁱ⁾；预测只需与支持向量做内积 ⇒ 为核方法铺路
```

**本讲关键词**：大间隔、$y\in\{-1,+1\}$、函数间隔、几何间隔、缩放不变性、最优间隔分类器、QP、Lagrange 对偶、弱/强对偶、KKT 条件、互补松弛、支持向量、对偶形式、只用内积表达。

**下讲预告**：核方法（Kernels）——特征映射 $\phi$、核技巧、Mercer 定理与合法核的判定、高斯核与字符串核；以及软间隔正则化与 SMO 算法。

**备注**：本笔记依据 CS229 官方讲义 *Kernel Methods / Support Vector Machines*（cs229-notes3）中的 SVM 部分整理，与 Lecture 6 视频范围一致（视频因 YouTube 反爬校验无法抓取字幕）。
