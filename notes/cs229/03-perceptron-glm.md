# 感知机与广义线性模型

# CS229 · Perceptron & Generalized Linear Model

> **课程**：Stanford CS229 (Autumn 2018) · Andrew Ng
> **本讲主题**：感知机（Perceptron）、指数分布族（Exponential Family）、广义线性模型（GLM）、Softmax 回归
> **视频**：[Lecture 4 - Perceptron & Generalized Linear Model](https://www.youtube.com/watch?v=iZTeva0WSTQ)

---

## 一、感知机 Perceptron（开场热身）

60 年代提出的**二分类算法**，历史上第一个"神经网络"模型，今天实际很少用，但概念简单、有历史意义。

### 1. 与逻辑回归的对比

| | 逻辑回归 | 感知机 |
|---|---|---|
| 激活函数 | sigmoid（平滑，输出 0~1） | **硬阶跃函数** |
| 输出 | 概率 $p(y=1)$ | 只能是 0 或 1 |

$$
g(z) = \begin{cases} 1 & z \ge 0 \\ 0 & z < 0 \end{cases}
\qquad h_\theta(x) = g(\theta^T x)
$$

### 2. 学习规则

$$
\theta_j := \theta_j + \alpha \left( y^{(i)} - h_\theta(x^{(i)}) \right) x_j^{(i)}
$$

- 分类正确 → $y^{(i)} - h_\theta(x^{(i)}) = 0$，参数不动
- 实际 1 预测 0 → 参数朝 $x$ 方向加
- 实际 0 预测 1 → 参数朝 $x$ 反方向减
- 直观理解：每步把决策边界朝"被错分样本"的方向掰

### 3. 为什么实际不用

- **没有概率解释**（输出硬 0/1，不是概率）
- 解不稳定：数据稍微变一点，决策边界可能大变
- 解决不了 **XOR 问题**（线性不可分）→ 后来才有多层感知机（MLP）

---

## 二、指数分布族 Exponential Family（本讲理论核心）

### 1. 定义

一个概率分布若能写成如下形式，就属于指数分布族：

$$
p(y; \eta) = b(y) \exp\left( \eta^T T(y) - a(\eta) \right)
$$

| 符号 | 名称 | 含义 |
|------|------|------|
| $\eta$ | 自然参数（natural parameter） | 决定分布形状 |
| $T(y)$ | 充分统计量（sufficient statistic） | 估计分布所需的全部信息，通常 $T(y)=y$ |
| $a(\eta)$ | 对数配分函数（log-partition） | 归一化项，保证积分为 1 |
| $b(y)$ | 基准测度（base measure） | 辅助归一化项 |

### 2. 两个关键例子

**① Bernoulli → 指数族**（二分类）

$$
p(y;\phi) = \phi^y (1-\phi)^{1-y} = \exp\Big[ \underbrace{\log\frac{\phi}{1-\phi}}_{=\eta} \cdot y + \underbrace{\log(1-\phi)}_{-a(\eta)} \Big]
$$

对应：$b(y)=1,\ T(y)=y,\ \eta=\log\frac{\phi}{1-\phi}$

**反解出 $\phi$：**

$$
\phi = \frac{1}{1+e^{-\eta}} = \text{sigmoid}(\eta)
$$

> 🔑 **sigmoid 不是天上掉下来的**——它是 Bernoulli 分布写成指数族形式后自然出现的！

**② Gaussian → 指数族**（回归，假设 $\sigma^2=1$）

$$
p(y;\mu) = \frac{1}{\sqrt{2\pi}} e^{-y^2/2} \cdot \exp\left( \mu y - \frac{\mu^2}{2} \right)
$$

对应：$\eta = \mu,\ T(y)=y,\ a(\eta)=\eta^2/2,\ b(y)=\frac{1}{\sqrt{2\pi}}e^{-y^2/2}$

### 3. 指数族的好用性质

- **MLE 是凸优化**：对数似然是凹函数 → 只有全局最优
- **期望和方差不用积分，求导即可**：
$$
E[y; \eta] = \frac{\partial a(\eta)}{\partial \eta}, \qquad \mathrm{Var}[y; \eta] = \frac{\partial^2 a(\eta)}{\partial \eta^2}
$$

### 4. 指数族成员速查

| 数据类型 | 分布 |
|----------|------|
| 连续实数 | Gaussian |
| 二分类 | Bernoulli |
| 计数（非负整数） | Poisson |
| 正实数 | Gamma / Exponential |
| 概率分布本身 | Beta / Dirichlet |

---

## 三、广义线性模型 GLM（Generalized Linear Models）

> 统一框架：把**线性回归、逻辑回归、Softmax 回归**全部纳入同一个数学框架。

### 1. 三个假设（设计选择）

1. **$y \mid x; \theta \sim \text{ExponentialFamily}(\eta)$**：给定 $x$，$y$ 服从某个指数族分布
2. **$\eta = \theta^T x$**：自然参数是 $x$ 的线性组合
3. **预测输出 = 期望**：$h_\theta(x) = E[y \mid x; \theta]$

### 2. 关键函数

- **Canonical Response Function**：$\mu = g(\eta) = E[y;\eta] = \frac{\partial a}{\partial \eta}$
- **Canonical Link Function**：$\eta = g^{-1}(\mu)$（上面的反函数）

### 3. 由 GLM 推出三个模型

| 问题 | 假设 $y$ 服从 | 推出 $h_\theta(x)$ | 模型 |
|------|--------------|--------------------|------|
| 回归 | Gaussian | $\mu = \eta = \theta^T x$ | **线性回归** |
| 二分类 | Bernoulli | $\phi = \frac{1}{1+e^{-\theta^T x}}$ | **逻辑回归**（sigmoid 自然出现） |
| 多分类 | Multinomial | softmax | **Softmax 回归** |

> 统一更新规则（随机梯度版，线性回归/逻辑回归长得一样）：
> $$
> \theta_j := \theta_j + \alpha \left( y^{(i)} - h_\theta(x^{(i)}) \right) x_j^{(i)}
> $$
> 差别只在 $h_\theta$ 的定义不同——这就是"所有 GLM 收敛到同一形式"的原因。

### 4. 训练 vs 预测

- **训练**：最大化似然（等价最小化 MSE / 交叉熵），找最优 $\theta$
- **预测**：由 $\theta^T x$ 算出 $\eta$，再取该分布的**期望**作为预测

---

## 四、Softmax 回归（多分类）

逻辑回归推广到 $k$ 个类别。

### 1. 设定

- 标签用 **one-hot 编码**：$y \in \{0,1\}^k$，如 $[0,0,1]$
- 每个类别 $c$ 有自己的参数 $\theta_c \in \mathbb{R}^n$

### 2. Softmax 函数：logit → 概率

1. 对每个类别算打分（logit）：$\theta_c^T x$
2. 取指数变正数：$e^{\theta_c^T x}$
3. 归一化：

$$
p(y=c \mid x) = \frac{e^{\theta_c^T x}}{\sum_{j=1}^{k} e^{\theta_j^T x}}
$$

> Softmax 把 $k$ 个任意实数变成一个概率分布，概率和为 1。

### 3. 损失：交叉熵 Cross-Entropy

$$
\mathrm{Loss} = -\log p(y=t \mid x) = -\log \frac{e^{\theta_t^T x}}{\sum_{c} e^{\theta_c^T x}}
$$

- 只惩罚"真实类别 $t$ 的预测概率"
- 然后用梯度下降/上升最小化（或最大化对数似然）

> Softmax 回归 = 逻辑回归的多分类推广；也是深度学习多分类输出层的标准做法。

---

## 小结

```
感知机（硬阶跃，历史意义）→ 指数分布族（统一 Bernoulli / Gaussian / Poisson…）
        ↓
GLM 三假设：y服从指数族 · η=θᵀx · 预测=期望
        ↓
Gaussian→线性回归 | Bernoulli→逻辑回归(sigmoid) | Multinomial→Softmax回归
```

**本讲关键词**：感知机、自然参数、充分统计量、对数配分函数、canonical link/response function、softmax、交叉熵、one-hot。

**下讲预告**：生成学习算法（Generative Learning Algorithms）——高斯判别分析（GDA）、朴素贝叶斯（Naive Bayes）。
