```c++
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
const int N = 2e5 + 5;
int dep[N << 1], f[N << 1];
std::vector<int> g[N], adj[N << 1];
int dfn[N], low[N], timer;
int stk[N], top;
int n, m, tot;
int a, b, c;
bool bo[N << 1];
inline void add(int u, int v) {
    adj[u].push_back(v);
    adj[v].push_back(u);
}

void tarjan(int u) {
    low[u] = dfn[u] = ++timer;
    stk[++top] = u;
    for (int v : g[u]) {
        if (!dfn[v]) {
            tarjan(v);
            low[u] = std::min(low[u], low[v]);
            if (low[v] >= dfn[u]) {
                int sq = ++tot;
                add(sq, u);
                do {
                    add(sq, stk[top]);
                } while (stk[top--] != v);
            }
        } else {
            low[u] = std::min(low[u], dfn[v]);
        }
    }
}

void dfs(int u, int p) {
    dep[u] = dep[p] + 1;
    for (int v : adj[u])
        if (v != p) f[v] = u, dfs(v, u);
}

bool check() {
    for (int v : adj[b]) bo[v] = true;
    while (a != c) {
        if (dep[a] < dep[c]) std::swap(a, c);
        a = f[a];
        if (bo[a]) return true;
    }
    return false;
}

void fc() {
    std::cin >> n >> m >> a >> b >> c;
    tot=n;
    for (int i = 0; i < m; i++) {
        int u, v;
        std::cin >> u >> v;
        g[u].push_back(v);
        g[v].push_back(u);
    }

    tarjan(1);
    dfs(1, 0);
    std::cout << (check() ? "Yes" : "No") << "\n";
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t = 1;
    // std::cin>>t;
    while (t--) fc();
    return 0;
}