```c++
const int N = 1e5 + 5;
std::vector<int> g[N], vbcc[N];
int dfn[N], low[N], tot;
int stk[N], top, cnt;
bool cut[N];
void tarjan(int u, bool root) {
    dfn[u] = low[u] = ++tot;
    stk[++top] = u;
    int son = 0;
    for (int v : g[u]) {
        if (!dfn[v]) {
            son++;
            tarjan(v, false);
            low[u] = std::min(low[u], low[v]);
            if (low[v] >= dfn[u]) {
                if (!root || son >= 2)
                    cut[u] = true;
                ++cnt;
                do {
                    vbcc[cnt].push_back(stk[top]);
                } while (stk[top--] != v);
                vbcc[cnt].push_back(u);
            }
        } else {
            low[u] = std::min(low[u], dfn[v]);
        }
    }
}
class Solution {
public:
    long long minimumCost(vector<int>& cost, vector<vector<int>>& roads) {
        int n = cost.size();
        for (int i = 1; i <= n; i++) {
            g[i].clear();
            vbcc[i].clear();
            dfn[i] = low[i] = 0;
            cut[i] = false;
        }
        top = tot = cnt = 0;
        for (auto& e : roads) {
            int u = e[0], v = e[1];
            ++u, ++v;
            g[u].push_back(v);
            g[v].push_back(u);
        }

        tarjan(1, true);

        long long ans = 0;
        if (cnt == 1) {
            ans = LLONG_MAX;
            for (int v : cost)
                ans = std::min(ans, (long long)v);
        } else {
            long long mx = 0;
            for (int i = 1; i <= cnt; i++) {
                long long mn = LLONG_MAX;
                int c = 0;
                for (int v : vbcc[i]) {
                    if (cut[v])
                        c++;
                    else
                        mn = std::min(mn, (long long)cost[v - 1]);
                }
                if (c == 1) {
                    ans += mn;
                    mx = std::max(mx, mn);
                }
            }
            ans -= mx;
        }
        return ans;
    }
};