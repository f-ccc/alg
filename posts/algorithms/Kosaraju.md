---
date: 2026-10-3
---

# Kosaraju

Kosaraju 算法是求解有向图**强连通分量（Strongly Connected Components, SCC）**的经典线性时间算法，其核心思想为**“原图后序标记，反图逆向剥离”**。

<img src="/img/licensed-image.png" alt="licensed-image">
---

### 一、 数学原理与证明

将有向图 $G = (V, E)$ 缩点后，得到一个**有向无环图（DAG）**，记为 $D$。

#### 1. 离开时间引理（Finishing Time Lemma）

设分量 $C$ 内所有节点的后序遍历离开时间（即递归回溯离开节点的时间）最大值为 $f(C) = \max_{u \in C} \{ finish[u] \}$。

若在 DAG $D$ 中存在跨分量有向边 $C_1 \to C_2$（即 $C_1$ 可达 $C_2$），则恒有：


$$f(C_1) > f(C_2)$$

*证明*：考虑原图第一遍 DFS 首次接触到 $C_1 \cup C_2$ 的时刻：

* **情况 1：DFS 先访问到 $C_1$ 中的点**。由于从 $C_1$ 可达 $C_2$，且 DAG 无环导致 $C_2$ 无法反向到达 $C_1$，DFS 会在遍历完 $C_2$ 中的所有可达节点并全部回溯后，才最终回溯离开 $C_1$。因此 $f(C_1) > f(C_2)$。
* **情况 2：DFS 先访问到 $C_2$ 中的点**。由于 $C_2$ 无法到达 $C_1$，DFS 将完整遍历 $C_2$ 并全部回溯结束；此时 $C_1$ 尚未被访问。随后外层循环才从 $C_1$ 启动新的搜索。因此 $f(C_1) > f(C_2)$。

#### 2. 反图隔离性（Transposition Isolation）

取 $G$ 的转置图（反图）$G^R$，其缩点 DAG $D^R$ 的边方向全部反转（若原图为 $C_1 \to C_2$，反图则为 $C_1 \leftarrow C_2$）。

若按 $finish$ 从大到小的顺序提取节点：

* 最大 $finish$ 节点必然属于 DAG 中的**源点分量**（出度存在但入度为 0 的分量 $C_{top}$）。
* 在反图 $G^R$ 中，该分量变为**汇点分量**（入度存在但出度为 0）。
* 此时在 $G^R$ 上以该节点启动 DFS，搜索流**无法通过任何反向边流出 $C_{top}$**；同时由强连通性，$C_{top}$ 内部节点彼此完全可达。搜索范围被严格限制在 $C_{top}$ 内部，完整且独立地剥离出一个 SCC。

---

### 二、 算法执行步骤

1. **图的转置**：读入每条有向边 $u \to v$ 时，同时在原图建立 $u \to v$，并在反图建立 $v \to u$。
2. **第一遍 DFS（后序推进）**：在原图上遍历所有未访问节点。当某个节点的出边全部遍历完毕准备回溯时，将该节点压入栈或序列 `ord`。
3. **第二遍 DFS（反图着色）**：将序列 `ord` 倒序扫描（即离开时间由大到小）。若当前节点未被分配 SCC 编号，则在**反图**上启动 DFS，本次遍历到的所有节点分配同一个分量编号。

> **拓扑序副产物**：第二遍 DFS 依次剥离的分量编号 $1, 2, \dots, k$ **天然满足缩点 DAG 的正向拓扑序**。在缩点后进行 DP 时，无需重新执行拓扑排序。

---

### 三、 模板

该实现追求极简与零额外空间冗余，时间复杂度严格为 $O(V + E)$，空间复杂度为 $O(V + E)$。

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MAXN = 200005;
vector<int> g[MAXN], rg[MAXN];
vector<int> ord;
bool vis[MAXN];
int scc[MAXN], scc_cnt;

// 第一遍 DFS：记录原图后序离开时间
void dfs1(int u) {
    vis[u] = true;
    for (int v : g[u]) {
        if (!vis[v]) dfs1(v);
    }
    ord.push_back(u);
}

// 第二遍 DFS：在反图上沿汇点分量染色
void dfs2(int u, int c) {
    scc[u] = c;
    for (int v : rg[u]) {
        if (!scc[v]) dfs2(v, c);
    }
}

// n: 点数 (1-indexed), m: 边数
void kosaraju(int n) {
    ord.clear();
    for (int i = 1; i <= n; i++) {
        vis[i] = false;
        scc[i] = 0;
    }
    scc_cnt = 0;

    for (int i = 1; i <= n; i++) {
        if (!vis[i]) dfs1(i);
    }
    for (int i = n - 1; i >= 0; i--) {
        int u = ord[i];
        if (!scc[u]) dfs2(u, ++scc_cnt);
    }
}

```

---

### 四、 Kosaraju 与 Tarjan 的工程选型权衡

| 维度 | Kosaraju 算法 | Tarjan 算法 |
| --- | --- | --- |
| **代码量 / 心智负担** | 极低（两个标准 DFS，无时间戳维护） | 中等（需维护 `dfn`、`low`、栈及在栈标记） |
| **拓扑序生成** | **天然为正向拓扑序**（可以直接做 DAG DP） | **天然为逆拓扑序**（需倒序遍历进行 DP） |
| **常数 / 耗时** | 稍大（两遍 DFS + 反图存图） | 更优（一遍 DFS 遍历） |
| **空间开销** | $2 \times (V + E)$（需额外存反图） | $V + E$（单向原图） |

---

例题： [abc478 - E](https://atcoder.jp/contests/abc478/tasks/abc478_e)  题解：[abc478 - E 题解](https://ac.fccc.xyz/posts/contest/atcoder/abc_478#e-lt-and-le)