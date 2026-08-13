# 染色法判定二分图 (dfs算法)
判断一张图能否被二分染色。

```c++
vector<int> color(n + 1, 0);

auto dfs = [&](auto self, int u, int c) -> bool {
    color[u] = c;
    for (int v : ver[u]) {
        if (!color[v]) {
            if (!self(self, v, 3 - c)) return false;
        } else if (color[v] == c) {
            return false;
        }
    }
    return true;
};

bool is_bipartite = true;
for (int i = 1; i <= n; ++i) {
    if (!color[i]) {
        if (!dfs(dfs, i, 1)) {
            is_bipartite = false;
            break;
        }
    }
}

cout << (is_bipartite ? "Yes\n" : "No\n");
```