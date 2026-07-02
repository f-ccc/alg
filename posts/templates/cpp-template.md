---
title: C++ 竞赛模板
date: 2026-01-01
tags:
  - 模板
  - C++
langs: [cpp]
readingTime: 8
description: 'C++ 算法竞赛常用模板，包含头文件、类型别名、常用宏和输入输出优化。'
---

# C++ 竞赛模板

## 常用头文件

```cpp
#include <bits/stdc++.h>
using namespace std;
```

## 类型别名

```cpp
using ll = long long;
using ull = unsigned long long;
using ld = long double;
using pii = pair<int, int>;
using pll = pair<ll, ll>;
using vi = vector<int>;
using vll = vector<ll>;
using vvi = vector<vector<int>>;
```

## 常用宏

```cpp
#define all(x) (x).begin(), (x).end()
#define rall(x) (x).rbegin(), (x).rend()
#define sz(x) (int)(x).size()
#define pb push_back
#define mp make_pair
#define fi first
#define se second
#define endl '\n'
```

## 输入输出优化

```cpp
// 快速输入输出 — 在 main 开头调用
void fast_io() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);
}

// 读入一行整数（未知个数）
string line;
getline(cin, line);
stringstream ss(line);
int x;
while (ss >> x) { ... }
```

## 常用算法模板

### 二分查找

```cpp
// 第一个 >= target 的位置
int lower_bound(vi& arr, int target) {
    int lo = 0, hi = sz(arr);
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}

// 第一个 > target 的位置
int upper_bound(vi& arr, int target) {
    int lo = 0, hi = sz(arr);
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] <= target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}
```

### 快速幂

```cpp
ll qpow(ll a, ll b, ll mod = 1e9 + 7) {
    ll res = 1;
    a %= mod;
    while (b) {
        if (b & 1) res = res * a % mod;
        a = a * a % mod;
        b >>= 1;
    }
    return res;
}
```

### 最大公约数

```cpp
ll gcd(ll a, ll b) {
    return b ? gcd(b, a % b) : a;
}

ll lcm(ll a, ll b) {
    return a / gcd(a, b) * b;
}
```

## main 函数模板

```cpp
void solve() {
    // your code here
}

int main() {
    fast_io();
    int tc = 1;
    cin >> tc;
    while (tc--) {
        solve();
    }
    return 0;
}
```
