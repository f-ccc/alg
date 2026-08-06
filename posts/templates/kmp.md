* kmp
```c++
vector<int> get_Next(const std::string s){
    int m=s.size();
    if(m==1)return {-1};

    std::vector<int>next(m);
    next[0]=-1;
    next[1]=0;

    int i=2,cn=0;
    while(i<m){
        if(s[i-1]==s[cn]){
            next[i++]=++cn;
        }else if(cn>0){
            cn=next[cn];
        }else{
            next[i++]=0;
        }
    }
    return next;
}

int kmp(string s1, string s2) {
    int n = s1.length(), m = s2.length();
    if (m == 0) return 0;
    vector<int> next = get_Next(s2);
    int x = 0, y = 0;
    while (x < n && y < m) {
        if (s1[x] == s2[y]) { x++; y++; }
        else if (y == 0) x++;
        else y = next[y];
    } return y == m ? x - y : -1;
}
```