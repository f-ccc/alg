# 并查集 DSU

Disjoint Set Union 的原理、优化与应用，包括路径压缩和按秩合并。 HMR_TEST

```cpp
struct DSU {
    vector<int> f, sz;
    DSU(int n) : f(n), sz(n, 1) { iota(f.begin(), f.end(), 0); }
    int find(int x) { return f[x] == x ? x : f[x] = find(f[x]); }
    bool merge(int a, int b) {
        a = find(a), b = find(b);
        if (a == b) return false;
        if (sz[a] < sz[b]) swap(a, b);
        f[b] = a, sz[a] += sz[b];
        return true;
    }
};
```
