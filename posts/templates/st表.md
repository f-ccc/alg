# st表

```c++
int st[MAXN][LOG];  
int lg_2[MAXN];  
void init_log(int n) {
    lg_2[1] = 0;
    for (int i = 2; i <= n; i++) {
        lg_2[i] = lg_2[i / 2] + 1;
    }
} 
void build(int n, vector<int>&a) {
    for (int i = 1; i <= n; i++)st[i][0] = a[i];  
    for (int j = 1; j < LOG; j++) { 
        for (int i = 1; i + (1 << j) - 1 <= n; i++) { 
            st[i][j] = min(st[i][j-1], st[i + (1 << (j-1))][j-1]);
        }
    }
} 
int qry(int l, int r) {
    int k = lg_2[r - l + 1];  
    return min(st[l][k], st[r - (1 << k) + 1][k]);
}
```