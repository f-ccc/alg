# KMP算法


## 一、引入

### 1\. 字符串匹配问题

1. **任务**：给定主串 `s1`（长 $n$）与模式串 `s2`（长 $m$）。若 `s2` 是 `s1` 子串，返回首次出现的下标，否则返回 \-1。  
2. **暴力解法 (Brute Force)**：尝试枚举 `s1` 的每一个字符作为起点，一旦失配，主串指针必须回退到原起点的下一个位置。  
3. **缺陷**：时间复杂度为 $O(n \times m)$，在处理长文本匹配时效率极低。

## 二、`next` 数组的定义

`next[i]` 的含义是模式串 `s2` 中下标 `i` 之前子串（`s2[0...i-1]`）的**最长相等真前后缀**长度。

1. **真前后缀约束**：不能包含子串整体本身。  
2. **Base Cases**：  
   - `next[0] = -1`：人为规定，作为匹配失败跳转的终点信号。  
   - `next[1] = 0`：因不能包含整体，长度 1 的串真前后缀必为 0。
  

## 三、匹配逻辑与证明

### 1\. KMP 匹配逻辑

设 `x` 在 `s1`，`y` 在 `s2`。若失配且 `y > 0`，令 `y = next[y]`，主串 `x` 永不回头。

### 2\. 反证法证明

假设在失配点 `x-y` 到新起点 `x-next[y]` 之间存在一个起点 `k` 能成功。这意味着 `s1[k...x-1]` 既是 `s2` 前缀，又是 `s2[0...y-1]` 后缀。由于 `k > x-y` 且 `k < x-next[y]`，该相等前后缀长度将大于 `next[y]`。这直接违反了 `next[y]` 是**最长**相等真前后缀的定义，故证明中间位置无解，加速有效。

## 四、生成`next` 数组的递推逻辑

利用已求解信息推导 `next[i]`，分为三个分支：

1. **分支 A**：`s2[i-1] == s2[cn]`。匹配延长成功：`next[i] = cn + 1`，`i` 和 `cn` 同步推进。  
2. **分支 B**：字符不等且 `cn > 0`。继续回缩：`cn = next[cn]`。  
3. **分支 C**：字符不等且 `cn == 0`。无匹配项：`next[i] = 0`，`i` 推进。

??? node next函数
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
```
???

## 五、复杂度证明

通过观察循环变量边界证明 **KMP 时间复杂度为** **$O(n+m)$**：

1. **主匹配 (x, x-y)**：分支 1 中 `x` 升，分支 2 中 `x` 升且 `x-y` 升，分支 3 中 `x-y` 升。由于 `x` 和 `x-y` 上限均为 $n$ 且单调不减，总步数 $\\leq 2n$。  
2. **Next 生成 (i, i-cn)**：同理，变量 `i` 与 `i-cn` 的上限均为 $m$，总步数 $\leq 2m$。

## kmp代码实现

### C++ 实现

```c++
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

**参考视频**：[左程云：算法讲解100【扩展】 KMP算法原理和代码详解](https://www.bilibili.com/video/BV19Q4y1c7ko/)