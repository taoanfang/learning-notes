# Softmax 回归

> **课程**：Stanford CS229 (Autumn 2018) · Andrew Ng
> **对应内容**：Lecture 4（Perceptron & GLM）· 官方讲义 *notes1* §9.3 Softmax Regression
> **定位**：`Les3.md` 里的 Softmax 是概览版，这份笔记把 GLM 推导、损失、梯度、数值实现细节展开
> **视频**：[Lecture 4 - Perceptron & Generalized Linear Model](https://www.youtube.com/watch?v=iZTeva0WSTQ)

---

## 一、问题设定

- 从二分类走到**多分类**：$y \in \{1,2,\dots,k\}$
- 例：邮件不再只分"垃圾/非垃圾"，而是分 spam / 私人邮件 / 工作邮件
- 目标：直接建模每一类的概率 $p(y=i\mid x;\theta)$，输出一个**$k$ 类的概率分布**
- 标签可以用 **one-hot** 表示（$y=2$ → $(0,1,0,\dots,0)^T$）

---

## 二、从 GLM 推出 softmax（"为什么是 softmax"）

### 0. 回顾 GLM 的三个假设

1. $y\mid x;\theta \sim \mathrm{ExponentialFamily}(\eta)$
2. 预测目标是期望：$h_\theta(x) = E[T(y)\mid x;\theta]$
3. 自然参数与输入线性相关：$\eta_i = \theta_i^T x$

### 1. 先把 Multinomial 写成指数族

$k$ 种结果的概率用 $\phi_1,\dots,\phi_k$ 描述，但**存在冗余**：只要知道任意 $k-1$ 个，最后一个就由 $\sum_i\phi_i = 1$ 确定。

所以只保留 $k-1$ 个参数：$\phi_i = p(y=i;\phi)$（$i=1..k-1$），并记 $\phi_k = 1-\sum_{i=1}^{k-1}\phi_i$（注意 $\phi_k$ 不是独立参数）。

定义**充分统计量** $T(y) \in \mathbb{R}^{k-1}$：

$$
(T(y))_i = \mathbb{1}\{y = i\}
$$

即

$$
T(1)=\begin{bmatrix}1\\0\\\vdots\\0\end{bmatrix},\quad
T(2)=\begin{bmatrix}0\\1\\\vdots\\0\end{bmatrix},\quad\cdots,\quad
T(k-1)=\begin{bmatrix}0\\0\\\vdots\\1\end{bmatrix},\quad
T(k)=\begin{bmatrix}0\\0\\\vdots\\0\end{bmatrix}
$$

> ⚠️ 两个容易忽略的点：这里 **$T(y)\ne y$**，而且 $T(y)$ 是 **$k-1$ 维向量**而不是标量。另外 $E[(T(y))_i] = P(y=i) = \phi_i$。

化简可得多项分布属于指数族：

$$
p(y;\phi) = \phi_1^{\mathbb{1}\{y=1\}}\phi_2^{\mathbb{1}\{y=2\}}\cdots\phi_k^{\mathbb{1}\{y=k\}}
= b(y)\exp\left(\eta^T T(y) - a(\eta)\right)
$$

其中

$$
\eta = \begin{bmatrix}\log(\phi_1/\phi_k)\\ \log(\phi_2/\phi_k)\\ \vdots \\ \log(\phi_{k-1}/\phi_k)\end{bmatrix},
\qquad a(\eta) = -\log\phi_k,\qquad b(y) = 1
$$

### 2. 自然参数（link function）

由上式直接读出（对 $i=1,\dots,k$）：

$$
\eta_i = \log\frac{\phi_i}{\phi_k},
\qquad\text{且}\qquad \eta_k = \log\frac{\phi_k}{\phi_k} = 0
$$

这就是二分类 logit（对数几率）在多分类下的推广：**"与第 $k$ 类相比的对数几率"**。

### 3. 反解 → softmax 函数（canonical response function）

由 $e^{\eta_i} = \phi_i/\phi_k$，两边对 $i$ 求和：

$$
\sum_{i=1}^{k} e^{\eta_i} = \frac{1}{\phi_k}\sum_{i=1}^{k}\phi_i = \frac{1}{\phi_k}
\qquad\Longrightarrow\qquad
\phi_k = \frac{1}{\sum_{j=1}^{k}e^{\eta_j}}
$$

代回 $e^{\eta_i} = \phi_i/\phi_k$ 即得响应函数：

$$
\phi_i = \frac{e^{\eta_i}}{\sum_{j=1}^{k}e^{\eta_j}}
$$

把"自然参数 $\eta$ → 分布均值 $\phi$"的这个映射命名为 **softmax 函数**。

### 4. 代回 $\eta_i = \theta_i^Tx$，得到模型

$$
\boxed{\;p(y=i\mid x;\theta) = \frac{e^{\theta_i^Tx}}{\sum_{j=1}^{k}e^{\theta_j^Tx}}\;}
$$

这就是 Lecture 4 里那个式子。**softmax 不是拍脑袋设计的**——它是"假设 $y\mid x$ 服从多项分布 + GLM 三假设"之后的必然结果，正如 sigmoid 之于 Bernoulli。

模型输出：

$$
h_\theta(x) = E[T(y)\mid x;\theta] = (\phi_1,\phi_2,\dots,\phi_{k-1})^T
$$

第 $k$ 类概率由 $1-\sum_{i=1}^{k-1}\phi_i$ 得到。

---

## 三、Softmax 函数的性质

| 性质 | 说明 |
|---|---|
| 输出是**概率分布** | 每一项 $>0$，且 $\sum_i \phi_i = 1$ |
| **保序** | logit（打分）最大的类别，概率也最大 |
| **平移不变** | $\eta \to \eta + c\cdot\mathbf{1}$ 时输出完全不变 → 参数有冗余 |
| 对差值敏感 | logit 差距拉大时概率趋向 one-hot（表现为"过度自信"）|

### 1. 参数冗余（over-parameterization）

若使用 $k$ 组参数 $\theta_1,\dots,\theta_k$，则把**所有** $\theta_i$ 同时加上任意向量 $\psi$，模型输出不变：

$$
\frac{e^{(\theta_i+\psi)^Tx}}{\sum_j e^{(\theta_j+\psi)^Tx}} = \frac{e^{\psi^Tx}e^{\theta_i^Tx}}{e^{\psi^Tx}\sum_j e^{\theta_j^Tx}} = \frac{e^{\theta_i^Tx}}{\sum_j e^{\theta_j^Tx}}
$$

两种处理方式：

- **CS229 讲义的做法**：只保留 $k-1$ 组参数，固定 $\theta_k = 0$（参数量 $(k-1)\times(n+1)$）
- **实践的常用做法**：保留全部 $k$ 组，加上 **L2 正则项（weight decay）**，让最优解唯一

### 2. 特例：$k=2$ 退化成逻辑回归

$$
\phi_1 = \frac{e^{\theta_1^Tx}}{e^{\theta_1^Tx}+e^{\theta_2^Tx}}
= \frac{1}{1+e^{(\theta_2-\theta_1)^Tx}}
\quad\overset{\theta_2 = 0}{=}\quad
\frac{1}{1+e^{-\theta_1^Tx}} = \mathrm{sigmoid}(\theta_1^Tx)
$$

> 🔑 这也顺便解释了"为什么二分类只要有 $k-1=1$ 组参数"：两个类的参数差才是有效信息。

---

## 四、损失函数与极大似然

对数似然：

$$
\ell(\theta) = \sum_{i=1}^{n}\log p(y^{(i)}\mid x^{(i)};\theta)
= \sum_{i=1}^{n}\sum_{l=1}^{k}\mathbb{1}\{y^{(i)}=l\}\log\frac{e^{\theta_l^Tx^{(i)}}}{\sum_{j=1}^{k}e^{\theta_j^Tx^{(i)}}}
$$

因为 $\sum_l \mathbb{1}\{y=l\}\log p_l = \log p_{y}$，所以**每个样本只惩罚"真实类别的预测概率"**：真实类的概率越接近 1，损失越小。

即就是**交叉熵**（单样本，$t$ 为真实类别）：

$$
\mathrm{Loss} = -\log\frac{e^{\theta_t^Tx}}{\sum_{j=1}^{k}e^{\theta_j^Tx}} = -\eta_t + \log\sum_{j=1}^{k}e^{\eta_j}
$$

训练：用**梯度上升**最大化 $\ell(\theta)$，或梯度下降最小化交叉熵（注意 $\ell$ 是凹函数 → 只有全局最优）。

---

## 五、梯度（形式非常漂亮）

$$
\nabla_{\theta_c}\ell(\theta) = \sum_{i=1}^{n}\left[\mathbb{1}\{y^{(i)}=c\} - p(y=c\mid x^{(i)};\theta)\right]x^{(i)}
$$

（用 $\theta_k=0$ 的约定时，$c$ 取 $1,\dots,k-1$；若保留 $k$ 组参数，则对 $c=1..k$ 都成立。）

梯度下降/上升更新：

$$
\theta_c := \theta_c + \alpha\sum_{i=1}^{n}\left(\mathbb{1}\{y^{(i)}=c\} - p_c^{(i)}\right)x^{(i)}
$$

> 🔑 "**真实标签 − 预测概率**再乘输入"，和线性回归、逻辑回归的更新式是同一个模子——这正是 GLM 家族统一性的又一次体现。差别只在 $h_\theta$ 的定义。

---

## 六、实现要点（工程上最容易踩的坑）

1. **log-sum-exp 技巧**：直接算 $e^{\eta}$ 会溢出，先减去最大值：

$$
\log p(y=t\mid x) = \eta_t - \log\sum_j e^{\eta_j},
\qquad \eta_j \leftarrow \eta_j - \max_j\eta_j \ \text{后再指数化}
$$

2. **别"先 softmax 再取 log"**：应当使用 `log_softmax` + NLL。PyTorch 的 `CrossEntropyLoss` 就是 `log_softmax` + `nll_loss` 的组合，直接吃**整数标签**，不需要手工 one-hot。
3. **参数量**：含冗余时 $k\times(n+1)$，去冗余后 $(k-1)\times(n+1)$；$k$ 很大（如语言模型词表）时，归一化项 $\sum_j e^{\eta_j}$ 是主要计算瓶颈 → 负采样、层次 softmax 等技巧。
4. **正则化**：weight decay 既能消除参数冗余带来的不唯一性，也能抑制"过度自信"的概率输出。
5. **输出解释**：概率和恒为 1，不要再做归一化；做多标签（一篇邮件可同时是 spam 和 work）时应当每类独立用 sigmoid，而不是 softmax。

---

## 七、容易混淆的对照

| 概念 | 与 softmax 的关系 |
|---|---|
| Sigmoid | $k=2$ 时 softmax 的特例 |
| 交叉熵 / NLL | softmax 的标准损失，等价于多样本极大似然 |
| KL 散度 | 交叉熵 $= H(p_{\text{data}}) + \mathrm{KL}(p_{\text{data}}\,\|\,p_{\text{model}})$，最小化交叉熵 ⇔ 最小化 KL |
| Logistic 回归 / GLM | 同一框架下的二分类版本；softmax 是 GLM 家族的成员 |
| 神经网络 | 多分类输出层的标准结构：线性层 + softmax + 交叉熵 |

**易混点速查**

- softmax 的输入是 **logits（任意实数）**，输出才是概率；别把它当成"输出后再配平方误差"的激活函数
- $T(y)\ne y$：多分类的充分统计量是 $k-1$ 维 one-hot，不是标量（只有 Gaussian/Bernoulli 才恰好 $T(y)=y$）
- $\theta_k=0$ 与 "加 L2 正则" 是殊途同归的去冗余手段；用前者时梯度公式的 $c$ 只取到 $k-1$
- 二分类 k=2 用 softmax 与直接用一个 sigmoid 等价，但参数量差一倍

---

## 小结

```
多分类 y ∈ {1..k}  ──▶  假设 y|x 服从 Multinomial（指数族成员）
        │
        ├─ 充分统计量 T(y) ∈ Rᵏ⁻¹：（T(y)）ᵢ = 1{y=i}
        ├─ canonical link：ηᵢ = log(φᵢ/φ_k)，且 η_k = 0
        │
        ├─ 反解得 canonical response function = softmax
        │        φᵢ = e^{ηᵢ} / Σⱼ e^{ηⱼ}
        │
        ├─ 代入 ηᵢ = θᵢᵀx  ⇒  p(y=i|x) = e^{θᵢᵀx} / Σⱼ e^{θⱼᵀx}
        │
        ├─ 极大似然 = 最小化交叉熵（只惩罚真实类的预测概率）
        └─ 梯度：∇θ_c ℓ = Σᵢ (1{y⁽ⁱ⁾=c} − p_c⁽ⁱ⁾) x⁽ⁱ⁾
                 ↳ 与线性回归/逻辑回归同构 → GLM 的统一更新式
        k=2 时退化为 sigmoid ⇒ 逻辑回归
```

**关键词**：Multinomial、充分统计量 $T(y)$、natural parameter、canonical link / response function、softmax、one-hot、交叉熵、log-sum-exp、参数冗余、weight decay。

**备注**：推导依据 CS229 官方讲义 *notes1* §9.3（Multinomial 的指数族形式 → link/response → 参数拟合），与 Lecture 4 视频内容一致。
