# 最近公共祖先LCA

## 树链剖分（HLD 求 LCA）
```c++
struct HLD {
    int n;
    std::vector<std::vector<int>> adj;
    std::vector<int> siz, dep, top, son, parent;

    explicit HLD(int n)
        : n(n), adj(n + 1), siz(n + 1), dep(n + 1),
          top(n + 1), son(n + 1), parent(n + 1) {}

    void add(int u, int v) {
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    void dfs1(int u) {
        siz[u] = 1;
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
        if (son[u]) dfs2(son[u], up);
        for (int v : adj[u]) {
            if (v == parent[u] || v == son[u]) continue;
            dfs2(v, v);
        }
    }

    void work(int root = 1) {
        dfs1(root);
        dfs2(root, root);
    }

    int lca(int u, int v) const {
        while (top[u] != top[v]) {
            if (dep[top[u]] < dep[top[v]]) std::swap(u, v);
            u = parent[top[u]];
        }
        return dep[u] < dep[v] ? u : v;
    }

    int calc(int u, int v) const {
        return dep[u] + dep[v] - 2 * dep[lca(u, v)];
    }
};
```

## 树上倍增
:::tabs variant:code
=== "无权图"
```c++
struct TreeLCA {
    int n;
    static constexpr int LOG = 20; // 支持 N <= 1,000,000
    std::vector<std::vector<int>> adj;
    std::vector<int> dep;
    std::vector<std::array<int, LOG>> fa;

    explicit TreeLCA(int n) : n(n), adj(n + 1), dep(n + 1), fa(n + 1) {}

    void add(int u, int v) {
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    void dfs(int u, int p) {
        fa[u][0] = p;
        dep[u] = dep[p] + 1;
        for (int i = 1; i < LOG; ++i) {
            fa[u][i] = fa[fa[u][i - 1]][i - 1];
        }
        for (int v : adj[u]) {
            if (v != p) dfs(v, u);
        }
    }

    void work(int root = 1) {
        dfs(root, 0);
    }

    int lca(int u, int v) const {
        if (dep[u] < dep[v]) std::swap(u, v);
        for (int i = LOG - 1; i >= 0; --i) {
            if (dep[u] - (1 << i) >= dep[v]) {
                u = fa[u][i];
            }
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

    int calc(int u, int v) const {
        return dep[u] + dep[v] - 2 * dep[lca(u, v)];
    }
};
```
=== "带权图：单趟 LCA 与路径最大边权查询"
```c++
struct TreeMaxLCA {
    struct Edge { int to, w; };
    int n;
    static constexpr int LOG = 20;
    std::vector<std::vector<Edge>> adj;
    std::vector<int> dep;
    std::vector<std::array<int, LOG>> fa;
    std::vector<std::array<int, LOG>> mx;

    explicit TreeMaxLCA(int n) : n(n), adj(n + 1), dep(n + 1), fa(n + 1), mx(n + 1) {}

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
            mx[u][i] = std::max(mx[u][i - 1], mx[fa[fa[u][i - 1]][i - 1]]);
        }
        for (const auto& edge : adj[u]) {
            if (edge.to != p) dfs(edge.to, u, edge.w);
        }
    }

    void work(int root = 1) {
        dfs(root, 0, 0);
    }

    // 单趟同步完成 LCA 计算与最大边权统计，常数最小化
    int query_max(int u, int v) const {
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
        res = std::max({res, mx[u][0], mx[v][0]});
        return res;
    }

    int lca(int u, int v) const {
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

    int calc(int u, int v) const {
        return dep[u] + dep[v] - 2 * dep[lca(u, v)];
    }
};
```