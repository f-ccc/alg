# 最小生成树（MST问题）

## 1.（稀疏图）Prim算法

使用邻接矩阵存图，以$O(N^2+M)$的复杂度计算，思想与$djikstra$基本一致。
```c++
#include <iostream>
#include <cstring>
#include <algorithm>

using namespace std;

const int N = 550, INF = 0x3f3f3f3f;
int n, m, g[N][N];
int d[N], v[N];

int prim() {
    memset(d, 0x3f, sizeof d);
    memset(v, 0, sizeof v);
    d[1] = 0; // 显式置起点距离为 0
    int ans = 0;

    for (int i = 0; i < n; ++i) {
        int t = -1;
        for (int j = 1; j <= n; ++j)
            if (!v[j] && (t == -1 || d[j] < d[t]))
                t = j;

        if (d[t] == INF) return INF; // 存在未连通节点

        v[t] = 1;
        ans += d[t];

        for (int j = 1; j <= n; ++j)
            d[j] = min(d[j], g[t][j]);
    }
    return ans;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    memset(g, 0x3f, sizeof g);
    if (!(cin >> n >> m)) return 0;

    while (m--) {
        int x, y, w;
        cin >> x >> y >> w;
        g[x][y] = g[y][x] = min(g[x][y], w); // 消除重边影响
    }

    int t = prim();
    if (t == INF) cout << "impossible\n";
    else cout << t << "\n";

    return 0;
}
```

## 2.（稠密图）Kruskal算法
平均时间复杂度为$O(MlogM)$，简化了并查集。

```c++
using ll = long long;

struct DSU {
    vector<int> fa;
    DSU(int n) : fa(n + 1) {
        iota(fa.begin(), fa.end(), 0);
    }
    int get(int x) {
        return fa[x] == x ? x : fa[x] = get(fa[x]);
    }
    bool merge(int x, int y) {
        x = get(x), y = get(y);
        if (x == y) return false;
        fa[y] = x;
        return true;
    }
};

struct Edge {
    int u, v;
    ll w;
    bool operator<(const Edge& o) const {
        return w < o.w;
    }
};

struct Kruskal {
    int n;
    vector<Edge> edges;

    Kruskal(int n) : n(n) {}

    void add(int u, int v, ll w) {
        edges.push_back({u, v, w});
    }

    ll solve() {
        sort(edges.begin(), edges.end());
        DSU dsu(n);
        ll ans = 0;
        int cnt = 0;

        for (const auto& [u, v, w] : edges) {
            if (dsu.merge(u, v)) {
                ans += w;
                if (++cnt == n - 1) return ans;
            }
        }
        return -1; // 图不连通，无法生成树
    }
};
```