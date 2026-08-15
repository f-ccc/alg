# ac自动机

定义 $|s_i|$ 是模板串的长度，$|S|$ 是文本串的长度，$|\Sigma|$ 是字符集的大小（常数，一般为 26），时间复杂度为 $O\left(\sum |s_i| + |S|\right)$。  

```c++
const int MAXN = 1e6 + 10;
const int SIGMA = 26;

struct ACAutomaton {
    int ch[MAXN][SIGMA], fail[MAXN], cnt[MAXN];
    int cntNodes;

    ACAutomaton() { init(); }

    void init() {
        for (int i = 0; i <= cntNodes; i++) {
            memset(ch[i], 0, sizeof(ch[i]));
            fail[i] = 0;
            cnt[i] = 0;
        }
        cntNodes = 1;
    }

    void insert(const string &s) {
        int u = 1;
        for (char c : s) {
            int &v = ch[u][c - 'a'];
            if (!v) v = ++cntNodes;
            u = v;
        }
        cnt[u]++;
    }

    void build() {
        fill(ch[0], ch[0] + SIGMA, 1);
        queue<int> q;
        q.push(1);

        while (!q.empty()) {
            int u = q.front();
            q.pop();

            for (int i = 0; i < SIGMA; i++) {
                int &v = ch[u][i];
                if (!v) {
                    v = ch[fail[u]][i];
                } else {
                    fail[v] = ch[fail[u]][i];
                    q.push(v);
                }
            }
        }
    }
 
    int query(const string &t) {
        int ans = 0;
        int u = 1;
        for (char c : t) {
            u = ch[u][c - 'a'];
            for (int v = u; v && ~cnt[v]; v = fail[v]) {
                ans += cnt[v];
                cnt[v] = -1; // 标记已访问，避免重复统计与退化
            }
        }
        return ans;
    }
} ac;
```

