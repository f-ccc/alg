---
title: '洛谷 P1551 亲戚 — 并查集入门'
date: 2026-07-02
tags:
  - 并查集
  - 洛谷
  - 图论
  - 入门
difficulty: Easy
langs: [cpp, python]
readingTime: 8
description: '洛谷 P1551 亲戚题解，并查集（Disjoint Set Union, DSU）的经典应用。'
---

# 洛谷 P1551 亲戚

## 题目描述

若某个家族人员过于庞大，要判断两个人是否是亲戚，确实不容易。

已知：如果 $a$ 和 $b$ 是亲戚，$b$ 和 $c$ 是亲戚，那么 $a$ 和 $c$ 也是亲戚。

现在给出 $n$ 个人和 $m$ 条亲戚关系，然后进行 $p$ 次询问，每次询问两个人是否有亲戚关系。

!!! note "输入格式"
    第一行：三个整数 $n,m,p$（$n \le 5000, m \le 5000, p \le 5000$）

    接下来 $m$ 行：每行两个整数 $a_i, b_i$，表示 $a_i$ 和 $b_i$ 有亲戚关系

    接下来 $p$ 行：每行两个整数 $c_i, d_i$，询问 $c_i$ 和 $d_i$ 是否有亲戚关系

!!! example "样例"

    ```
    输入：
    6 5 3
    1 2
    1 5
    3 4
    5 2
    1 3
    1 4
    2 3
    5 6

    输出：
    Yes
    Yes
    No
    ```

## 思路

这就是一个 **并查集（Disjoint Set Union, DSU）** 的裸题。

???+ info "什么是并查集？"
    并查集是一种树型的数据结构，用于处理一些 **不相交集合** 的合并及查询问题。

    核心操作：
    - **查询（Find）**：查找元素所属的集合（根节点）
    - **合并（Union）**：将两个元素所在的集合合并
???

### 解题步骤

1. 初始化：每个人自己是一个集合，`fa[i] = i`
2. 对每对亲戚关系执行 **合并** 操作
3. 对每个询问执行 **查询**，判断根节点是否相同

!!! warning "路径压缩"
    如果不做路径压缩，Find 操作可能退化成 $O(n)$，导致超时。递归将沿途所有节点直接指向根节点即可。

## 代码

::: code-group

```cpp [C++]
#include <iostream>
#include <vector>
using namespace std;

vector<int> fa;

// 初始化
void init(int n) {
    fa.resize(n + 1);
    for (int i = 1; i <= n; i++) fa[i] = i;
}

// 查询（带路径压缩）
int find(int x) {
    if (fa[x] != x) fa[x] = find(fa[x]);
    return fa[x];
}

// 合并
void merge(int x, int y) {
    fa[find(x)] = find(y);
}

int main() {
    int n, m, p;
    cin >> n >> m >> p;
    init(n);

    while (m--) {
        int a, b;
        cin >> a >> b;
        merge(a, b);
    }

    while (p--) {
        int a, b;
        cin >> a >> b;
        cout << (find(a) == find(b) ? "Yes" : "No") << '\n';
    }

    return 0;
}
```

```python [Python]
import sys
sys.setrecursionlimit(10000)

def init(n):
    return list(range(n + 1))

def find(fa, x):
    if fa[x] != x:
        fa[x] = find(fa, fa[x])
    return fa[x]

def merge(fa, x, y):
    fa[find(fa, x)] = find(fa, y)

n, m, p = map(int, input().split())
fa = init(n)

for _ in range(m):
    a, b = map(int, input().split())
    merge(fa, a, b)

for _ in range(p):
    a, b = map(int, input().split())
    print("Yes" if find(fa, a) == find(fa, b) else "No")
```

:::

## 复杂度分析

- **时间复杂度：** $O((m+p) \cdot \alpha(n))$，$\alpha$ 为反阿克曼函数，近似常数
- **空间复杂度：** $O(n)$

!!! tip "路径压缩 + 按秩合并"
    如果追求极致性能，可以加上 **按秩合并**（按树大小/深度合并），能让复杂度达到理论最坏情况下的反阿克曼函数级别。对于本题 $n \le 5000$，仅路径压缩已足够。
