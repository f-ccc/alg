# 字典树 trie

## 基础封装
```c++ 
const int N = 1e5 + 5;
const int SIGMA = 62;

struct Trie {
    int ch[N][SIGMA], cnt[N], idx;

    // O(1) 字符映射：a-z (0-25), A-Z (26-51), 0-9 (52-61)
    inline int get_id(char c) {
        if (c >= 'a' && c <= 'z') return c - 'a';
        if (c >= 'A' && c <= 'Z') return c - 'A' + 26;
        return c - '0' + 52;
    }

    void insert(const string &s) {
        int u = 0;
        for (char c : s) {
            int v = get_id(c);
            if (!ch[u][v]) ch[u][v] = ++idx;
            u = ch[u][v];
            cnt[u]++; // 维护前缀出现次数
        }
    }

    int query(const string &s) {
        int u = 0;
        for (char c : s) {
            int v = get_id(c);
            if (!ch[u][v]) return 0;
            u = ch[u][v];
        }
        return cnt[u];
    }

    void clear() {
        for (int i = 0; i <= idx; i++) {
            cnt[i] = 0;
            memset(ch[i], 0, sizeof(ch[i]));
        }
        idx = 0;
    }
} trie;
```

##  01 字典树
```c++
#include <bits/stdc++.h>
using namespace std;

const int MAXN = 1e5 + 5;
const int BITS = 31;                 // 处理 0 ~ 30 位非负整数
const int MAX_NODE = MAXN * BITS;    // 节点池上限

struct Trie01 {
    int ch[MAX_NODE][2];
    int idx;

    void clear() {
        for (int i = 0; i <= idx; i++) {
            ch[i][0] = ch[i][1] = 0;
        }
        idx = 0;
    }

    void insert(int x) {
        int u = 0;
        for (int i = BITS - 1; ~i; i--) {
            int v = (x >> i) & 1;
            if (!ch[u][v]) ch[u][v] = ++idx;
            u = ch[u][v];
        }
    }

    // 查询与 x 异或能获得的最大值
    int query_max(int x) {
        int u = 0, res = 0;
        for (int i = BITS - 1; ~i; i--) {
            int v = (x >> i) & 1;
            if (ch[u][!v]) {
                res |= (1 << i);
                u = ch[u][!v];
            } else {
                u = ch[u][v];
            }
        }
        return res;
    }
} trie;
```