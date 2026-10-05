# z函数

```c++
std::vector<int> zArray(const std::string& s) {
    int n = s.size();
    std::vector<int> z(n, 0);
    for (int i = 1, c = 0, r = 0; i < n; ++i) {
        int len = (r > i) ? std::min(r - i, z[i - c]) : 0;
        while (i + len < n && s[i + len] == s[len]) ++len;
        if (i + len > r) {
            r = i + len;
            c = i;
        }
        z[i] = len;
    }
    return z;
}
```