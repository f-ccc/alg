---
date: 2026-10-3
---


# Kruskal 重构树

Kruskal 重构树（Kruskal Reconstruction Tree）是将无向图在最小/最大生成树的构建过程中，将边权转化为点权、将连通性与瓶颈边权转化为树上祖先关系的数据结构。它能够将图上的**路径瓶颈最值问题**和**带边权限制的连通块查询问题**，转化为树上的 **LCA 查询**与**子树区间查询**。

<img src="/img/kruskal重构树.png" alt="Kruskal重构树全景图">


---
<a href="/html/kruskal_reconstruction_tree_visualizer.html" target="_blank">可视化演示</a>



## 1. 核心定义与构建逻辑

设原图有 $n$ 个节点、$m$ 条无向边。

1. **初始状态**：原图中的 $n$ 个点作为重构树的叶子节点，权值通常置为 $0$（或特定点权）。
2. **加边合并**：将原图边按边权升序排序（求瓶颈最小值用降序，最小生成树用升序）。按顺序遍历每条边 $(u, v, w)$：
* 若 $u, v$ 在并查集中已连通，直接跳过。 
* 若 $u, v$ 不连通，新建一个虚拟节点 $p$（编号从 $n+1$ 开始递增，权值 $val[p] = w$）。
* 将 $u$ 和 $v$ 所在连通块的根节点分别作为 $p$ 的左右儿子。
* 将 $u, v$ 所在集合合并，新集合的代表元更新为 $p$。


3. **最终规模**：若原图连通，最终构建出一棵恰有 $2n - 1$ 个节点的有根二叉树；若不连通，则为包含多棵二叉树的森林。

---

## 2. 核心数学性质

### 2.1 堆性质与单调性

从任意叶子节点向上到根节点，经过的内部节点权值具有严格单调性：

* 若边权升序构建（最小生成树向）：内部节点权值自底向上单调不降（大根堆性质）。
* 若边权降序构建（最大生成树向）：内部节点权值自底向上单调不增（小根堆性质）。

### 2.2 瓶颈路径转 LCA

原图中两点 $u, v$ 之间所有路径中，“最大边权的最小值”等于重构树上 $\text{LCA}(u, v)$ 的点权：


$$\min_{P \in \text{Paths}(u, v)} \max_{e \in P} w(e) = val[\text{LCA}(u, v)]$$

### 2.3 约束连通块等价于子树

在升序重构树中，从点 $u$ 出发、仅通过边权 $\le x$ 的边所能到达的所有点集，严格对应重构树上满足 $val[p] \le x$ 的**最高祖先 $p$ 的整棵子树中的所有叶子节点**。

* 寻找该祖先 $p$ 可通过**树上倍增**在 $O(\log n)$ 内定位。

### 2.4 子树拍平为连续区间

通过对重构树求 DFS 序（Euler Tour），任意节点 $p$ 的子树对应 DFS 序上的连续闭区间 $[L[p], R[p]]$。原图点集被规整化为连续序列，支持线段树、树状数组或可持久化线段树（主席树）高效维护。

---
<img src="/img/Kruskal重构树构建与结构全景图.png" alt="Kruskal重构树全景图">
<img src="/img/Kruskal重构树核心应用场景图解.png" alt="Kruskal重构树全景图">

## 3. 算法复杂度

* **时间复杂度**：
* 排序与并查集建树：$O(m \log m + m \alpha(n))$
* 树上倍增预处理与 DFS 序：$O(n \log n)$
* 单次查询：倍增定位最高合法祖先 $O(\log n)$，后续区间查询 $O(1)$ 或 $O(\log n)$


* **空间复杂度**：
* 重构树点数为 $2n - 1$，边数为 $2n - 2$。所有与重构树节点相关的数组需开 **$2N$** 规模，倍增表空间为 $O(n \log n)$。



---

## 4. 模板

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Edge {
    int u, v, w;
    bool operator<(const Edge& other) const {
        return w < other.w; // 升序建树，用于边权 <= x 连通或最小瓶颈路
    }
};

const int MAXN = 100005;
const int MAX_NODE = 2 * MAXN;
const int LOGN = 20;

int n, m;
vector<Edge> edges;
vector<int> adj[MAX_NODE];
int val[MAX_NODE];
int fa_dsu[MAX_NODE];

int up[MAX_NODE][LOGN];
int dfn_in[MAX_NODE], dfn_out[MAX_NODE], dfn_clk;
int leaf_map[MAX_NODE]; // DFS序位置对应的原始叶子编号

int find_dsu(int x) {
    return fa_dsu[x] == x ? x : fa_dsu[x] = find_dsu(fa_dsu[x]);
}

// 1. 构建 Kruskal 重构树
int build_kruskal_tree() {
    sort(edges.begin(), edges.end());
    iota(fa_dsu + 1, fa_dsu + 2 * n, 1);
    
    int cur_idx = n;
    for (const auto& [u, v, w] : edges) {
        int fu = find_dsu(u), fv = find_dsu(v);
        if (fu != fv) {
            cur_idx++;
            val[cur_idx] = w;
            fa_dsu[fu] = cur_idx;
            fa_dsu[fv] = cur_idx;
            adj[cur_idx].push_back(fu);
            adj[cur_idx].push_back(fv);
            if (cur_idx == 2 * n - 1) break;
        }
    }
    return cur_idx; // 返回重构树根节点编号
}

// 2. 预处理倍增与 DFS 序
void dfs(int u, int p) {
    up[u][0] = p;
    for (int i = 1; i < LOGN; ++i) {
        up[u][i] = up[up[u][i - 1]][i - 1];
    }
    dfn_in[u] = ++dfn_clk;
    if (u <= n) {
        leaf_map[dfn_clk] = u;
    }
    for (int v : adj[u]) {
        dfs(v, u);
    }
    dfn_out[u] = dfn_clk;
}

// 3. 查询从 u 出发仅经边权 <= max_w 的边可达的点集区间 [L, R]
pair<int, int> query_range(int u, int max_w) {
    for (int i = LOGN - 1; i >= 0; --i) {
        if (up[u][i] && val[up[u][i]] <= max_w) {
            u = up[u][i];
        }
    }
    return {dfn_in[u], dfn_out[u]};
}

// 4. 查询两点间瓶颈最值
int query_bottleneck(int u, int v) {
    if (dfn_in[u] > dfn_in[v]) swap(u, v);
    // 标准倍增求 LCA
    for (int i = LOGN - 1; i >= 0; --i) {
        if (up[v][i] && dfn_in[up[v][i]] > dfn_in[u]) {
            v = up[v][i];
        }
    }
    int lca = (u == v) ? u : up[u][0];
    return val[lca];
}

```
