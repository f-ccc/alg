* kmp

标准kmp模板
```c++
// 求next数组
vector<int> getNext(const string &p) {
    int n = p.size();
    vector<int> nxt(n, 0);
    for (int i = 1, j = 0; i < n; ++i) {
        while (j > 0 && p[i] != p[j]) j = nxt[j - 1];
        if (p[i] == p[j]) j++;
        nxt[i] = j;
    }
    return nxt;
}

// 返回第一个匹配的起始下标，无匹配返回 -1
int kmp_get_first(const string &s, const string &p) {
    int n = s.size(), m = p.size();
    if(m == 0) return 0;
    vector<int> next = getNext(p);
    for(int i = 0, j = 0; i < n; i++){
        while(j > 0 && s[i] != p[j]) j = next[j-1];
        if(s[i] == p[j]) j++;
        if(j == m){
            return i - m + 1;
        }
    }
    return -1;
}

// KMP 返回所有匹配起始下标
vector<int> kmp(const string &s, const string &p) {
    vector<int> res;
    vector<int> nxt = getNext(p);
    int n = s.size(), m = p.size();
    for (int i = 0, j = 0; i < n; ++i) {
        while (j > 0 && s[i] != p[j]) j = nxt[j - 1];
        if (s[i] == p[j]) j++;
        if (j == m) {
            res.push_back(i - m + 1);
            j = nxt[j - 1];
        }
    }
    return res;
}
```

左程云模板
```c++
vector<int> getNext(const std::string s){
    int m=s.size();
    if(m==1)return {-1};

    std::vector<int>nxt(m);
    nxt[0]=-1;
    nxt[1]=0;

    int i=2,cn=0;
    while(i<m){
        if(s[i-1]==s[cn]){
            nxt[i++]=++cn;
        }else if(cn>0){
            cn=nxt[cn];
        }else{
            nxt[i++]=0;
        }
    }
    return nxt;
}

int kmp(string s1, string s2) {
    int n = s1.length(), m = s2.length();
    if (m == 0) return 0;
    vector<int> nxt = get_Next(s2);
    int x = 0, y = 0;
    while (x < n && y < m) {
        if (s1[x] == s2[y]) { x++; y++; }
        else if (y == 0) x++;
        else y = nxt[y];
    } return y == m ? x - y : -1;
}
```