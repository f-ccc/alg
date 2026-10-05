# 缩点 & Tarjan算法

## 有向图强连通分量

目标：求出所有强连通分量，并按拓扑序逆序标号（缩点后天然为拓扑序逆序）。复杂度：时间 $O(V + E)$，空间 $O(V + E)$。

```c++
#include <bits/stdc++.h>
using namespace std;

const int N = 200005;
vector<int> adj[N];
int dfn[N], low[N], dfn_cnt;
int stk[N], top;
bool in_stk[N];
int scc[N], scc_cnt, sz[N];

void tarjan(int u) {
    dfn[u] = low[u] = ++dfn_cnt;
    stk[++top] = u;
    in_stk[u] = true;
    for (int v : adj[u]) {
        if (!dfn[v]) {
            tarjan(v);
            low[u] = min(low[u], low[v]);
        } else if (in_stk[v]) {
            low[u] = min(low[u], dfn[v]);
        }
    }
    if (dfn[u] == low[u]) {
        scc_cnt++;
        int v;
        do {
            v = stk[top--];
            in_stk[v] = false;
            scc[v] = scc_cnt;
            sz[scc_cnt]++;
        } while (u != v);
    }
}

// 验证逻辑: 遍历 1~n 执行 if (!dfn[i]) tarjan(i);
// scc_cnt 为总强连通分量数，scc[u] 为点 u 所属分量编号。
```

## 无向图割点与点双连通分量
目标：求出所有割点，并将点划分为若干点双连通分量（割点可同属于多个点双）。注意：栈中弹出的点集需加上当前割点 $u$。复杂度：时间 $O(V + E)$，空间 $O(V + E)$。

```c++
#include <bits/stdc++.h>
using namespace std;

const int N = 200005;
vector<int> adj[N], bcc[N];
int dfn[N], low[N], dfn_cnt, root;
int stk[N], top, bcc_cnt;
bool is_cut[N];

void tarjan(int u) {
    dfn[u] = low[u] = ++dfn_cnt;
    stk[++top] = u;
    int child = 0;
    for (int v : adj[u]) {
        if (!dfn[v]) {
            child++;
            tarjan(v);
            low[u] = min(low[u], low[v]);
            if (low[v] >= dfn[u]) {
                if (u != root || child > 1) is_cut[u] = true;
                bcc_cnt++;
                while (true) {
                    int x = stk[top--];
                    bcc[bcc_cnt].push_back(x);
                    if (x == v) break;
                }
                bcc[bcc_cnt].push_back(u);
            }
        } else {
            low[u] = min(low[u], dfn[v]);
        }
    }
    if (u == root && child == 0) { // 处理孤立点
        bcc[++bcc_cnt].push_back(u);
    }
}

// 验证逻辑: for (int i = 1; i <= n; i++) if (!dfn[i]) { root = i; tarjan(i); }
```

## 无向图割边（桥）与边双连通分量
目标：识别所有桥，缩点后整张图变为森林。关键实现：边集从标号 2 开始（ec = 1），利用 i ^ 1 判断反向边，直接原生规避重边陷阱。复杂度：时间 $O(V + E)$，空间 $O(V + E)$。
```c++
#include <bits/stdc++.h>
using namespace std;

const int N = 200005, M = 400005;
struct Edge { int to, nxt; } e[M << 1];
int head[N], ec = 1; // 必须为 1，第一条边编号为 2, 反向边为 3
int dfn[N], low[N], dfn_cnt;
bool is_bridge[M << 1];
int ebcc[N], ebcc_cnt;

inline void add_edge(int u, int v) {
    e[++ec] = {v, head[u]}; head[u] = ec;
    e[++ec] = {u, head[v]}; head[v] = ec;
}

void tarjan(int u, int in_edge) {
    dfn[u] = low[u] = ++dfn_cnt;
    for (int i = head[u]; i; i = e[i].nxt) {
        int v = e[i].to;
        if (!dfn[v]) {
            tarjan(v, i);
            low[u] = min(low[u], low[v]);
            if (low[v] > dfn[u]) {
                is_bridge[i] = is_bridge[i ^ 1] = true;
            }
        } else if ((i ^ 1) != in_edge) {
            low[u] = min(low[u], dfn[v]);
        }
    }
}

void dfs_ebcc(int u) {
    ebcc[u] = ebcc_cnt;
    for (int i = head[u]; i; i = e[i].nxt) {
        int v = e[i].to;
        if (is_bridge[i] || ebcc[v]) continue;
        dfs_ebcc(v);
    }
}

// 验证逻辑:
// 1. for (int i = 1; i <= n; i++) if (!dfn[i]) tarjan(i, 0);
// 2. for (int i = 1; i <= n; i++) if (!ebcc[i]) { ebcc_cnt++; dfs_ebcc(i); }
```

## 树上离线最近公共祖先
目标：离线单次 DFS 配合并查集解决全量 LCA 查询。复杂度：时间 $O((N + Q) \alpha(N))$，极速常数。
```c++
#include <bits/stdc++.h>
using namespace std;

const int N = 500005;
vector<int> adj[N];
vector<pair<int, int>> qry[N]; // {v, query_id}
int fa[N], ans[N];
bool vis[N];

int find(int x) { return fa[x] == x ? x : fa[x] = find(fa[x]); }

void tarjan_lca(int u) {
    vis[u] = true;
    for (int v : adj[u]) {
        if (!vis[v]) {
            tarjan_lca(v);
            fa[v] = u; // 合并子树到根
        }
    }
    for (auto &[v, id] : qry[u]) {
        if (vis[v]) {
            ans[id] = find(v);
        }
    }
}

// 初始化: iota(fa + 1, fa + 1 + n, 1);
// 询问加双向: qry[u].push_back({v, id}); qry[v].push_back({u, id});
// 执行: tarjan_lca(root);
```