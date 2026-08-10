- Manacher
  
```c++
#include <bits/stdc++.h>
using namespace std;

std::string toManachers(const std::string& s){
    std::string res;
    res.reserve(2 * s.size() + 3);
    res += "@#";
    for(char c : s){
        res += c;
        res += '#';
    }
    res += '%';
    return res;
}

int get_Manacher_mx(std::string& s){
    std::string t=toManachers(s);
    std::vector<int>p(t.size());//回文半径数组
    int mx=0;
    for(int i=1,r=0,c=0; i < (int)t.size() - 1; i++){
        p[i] = (r > i) ? std::min(p[2*c-i], r-i) : 1;
        while(t[i-p[i]] == t[i+p[i]]) p[i]++;
        if(i + p[i] > r){
            r = i + p[i];
            c = i;
        }
        mx = std::max(mx, p[i]);
    }
    return mx - 1;
    //return p
}
```