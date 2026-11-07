# CS229 · Machine Learning

以 Stanford CS229 2018 课程为主线的机器学习笔记，覆盖监督学习、广义线性模型、生成学习、支持向量机、核方法与 Softmax 回归。

## 监督学习基础

1. [线性回归与梯度下降](01-linear-regression.md) — 监督学习基本框架、线性回归、批量与随机梯度下降、正规方程。
2. [局部加权与逻辑回归](02-weighted-logistic-regression.md) — LWR、线性回归的概率解释、逻辑回归与牛顿法。
3. [感知机与广义线性模型](03-perceptron-glm.md) — 感知机、指数族、GLM 的构造与 Softmax 概览。
4. [Softmax 回归](04-softmax-regression.md) — 从 GLM 推导多分类模型，讨论损失、梯度和数值实现。
5. [GDA 与朴素贝叶斯](05-gda-naive-bayes.md) — 生成学习、多元高斯、高斯判别分析、朴素贝叶斯与 Laplace 平滑。

## 间隔、对偶与核方法

6. [支持向量机](06-support-vector-machines.md) — 函数间隔、几何间隔、最优间隔分类器、拉格朗日对偶与 KKT。
7. [核方法与 SVM 对偶](07-kernels.md) — 核技巧、常见核函数、Mercer 定理与软间隔 SVM。
