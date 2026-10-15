# 最近公共祖先LCA

## 树链剖分（HLD 求 LCA）
```c++
#include <bits/stdc++.h>

constexpr int N = 500005;
std::vector<int> adj[N];
int siz[N], dep[N], top[N], son[N], parent[N];

void add(int u, int v) {
    adj[u].push_back(v);
    adj[v].push_back(u);
}

void dfs1(int u) {
    siz[u] = 1, son[u] = 0;
    dep[u] = dep[parent[u]] + 1;
    for (int v : adj[u]) {
        if (v == parent[u]) continue;
        parent[v] = u;
        dfs1(v);
        siz[u] += siz[v];
        if (siz[v] > siz[son[u]]) son[u] = v;
    }
}

void dfs2(int u, int up) {
    top[u] = up;
    if (!son[u]) return;
    dfs2(son[u], up);
    for (int v : adj[u]) {
        if (v != parent[u] && v != son[u]) dfs2(v, v);
    }
}

void work(int root = 1) {
    parent[root] = 0;
    dfs1(root);
    dfs2(root, root);
}

int lca(int u, int v) {
    while (top[u] != top[v]) {
        if (dep[top[u]] < dep[top[v]]) std::swap(u, v);
        u = parent[top[u]];
    }
    return dep[u] < dep[v] ? u : v;
}

int calc(int u, int v) {
    return dep[u] + dep[v] - 2 * dep[lca(u, v)];
}
```

## 树上倍增
:::tabs variant:code
=== "无权图"
```c++
#include <bits/stdc++.h>
using namespace std;

const int N = 500005, LOG = 20;
vector<int> g[N];
int dep[N], up[N][LOG];

void dfs(int u, int p) {
    dep[u] = dep[p] + 1;
    up[u][0] = p;
    for (int i = 1; i < LOG; ++i)
        up[u][i] = up[up[u][i - 1]][i - 1];
    for (int v : g[u])
        if (v != p) dfs(v, u);
}

int lca(int u, int v) {
    if (dep[u] < dep[v]) swap(u, v);
    int d = dep[u] - dep[v];
    for (int i = 0; i < LOG; ++i)
        if ((d >> i) & 1) u = up[u][i];
    if (u == v) return u;
    for (int i = LOG - 1; i >= 0; --i)
        if (up[u][i] != up[v][i])
            u = up[u][i], v = up[v][i];
    return up[u][0];
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, s;
    if (!(cin >> n >> m >> s)) return 0;
    for (int i = 1, u, v; i < n; ++i) {
        cin >> u >> v;
        g[u].push_back(v);
        g[v].push_back(u);
    }
    dfs(s, 0);
    while (m--) {
        int u, v;
        cin >> u >> v;
        cout << lca(u, v) << '\n';
    }
    return 0;
}
```
=== "带权图：单趟 LCA 与路径最大边权查询"
```c++
#include <bits/stdc++.h>

constexpr int N = 500005, LOG = 20;
struct Edge { int to, w; };
std::vector<Edge> adj[N];
int dep[N], fa[N][LOG], mx[N][LOG];

void add(int u, int v, int w) {
    adj[u].push_back({v, w});
    adj[v].push_back({u, w});
}

void dfs(int u, int p, int w) {
    fa[u][0] = p;
    mx[u][0] = w;
    dep[u] = dep[p] + 1;
    for (int i = 1; i < LOG; ++i) {
        fa[u][i] = fa[fa[u][i - 1]][i - 1];
        mx[u][i] = std::max(mx[u][i - 1], mx[fa[u][i - 1]][i - 1]);
    }
    for (const auto& edge : adj[u]) {
        if (edge.to != p) dfs(edge.to, u, edge.w);
    }
}

int query_max(int u, int v) {
    int res = 0;
    if (dep[u] < dep[v]) std::swap(u, v);
    for (int i = LOG - 1; i >= 0; --i) {
        if (dep[u] - (1 << i) >= dep[v]) {
            res = std::max(res, mx[u][i]);
            u = fa[u][i];
        }
    }
    if (u == v) return res;
    for (int i = LOG - 1; i >= 0; --i) {
        if (fa[u][i] != fa[v][i]) {
            res = std::max({res, mx[u][i], mx[v][i]});
            u = fa[u][i];
            v = fa[v][i];
        }
    }
    return std::max({res, mx[u][0], mx[v][0]});
}

int lca(int u, int v) {
    if (dep[u] < dep[v]) std::swap(u, v);
    for (int i = LOG - 1; i >= 0; --i) {
        if (dep[u] - (1 << i) >= dep[v]) u = fa[u][i];
    }
    if (u == v) return u;
    for (int i = LOG - 1; i >= 0; --i) {
        if (fa[u][i] != fa[v][i]) {
            u = fa[u][i];
            v = fa[v][i];
        }
    }
    return fa[u][0];
}

int calc(int u, int v) {
    return dep[u] + dep[v] - 2 * dep[lca(u, v)];
}
```