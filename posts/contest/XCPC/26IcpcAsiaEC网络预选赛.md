---
date: 2026-09-6
---

# 2026 ICPC Asia EC 网络赛

点击查看[题面](/pdf/2026IcpcAsiaEC网络预选赛.pdf){target="_blank" rel="noopener noreferrer"}              
点击查看[题解(en)](/pdf/2026IcpcAsiaEC网络预选赛题解-en.pdf){target="_blank" rel="noopener noreferrer"}  

## Problem M. 签到

### 题目大意

维护一个竞赛签到系统。首先给定包含 $n$ 支队伍名称的名册（队伍名称互不相同）。随后进行 $m$ 次签到查询，对于每次查询给出的名称，需归入并输出以下三种结果之一：

* `OK`：该名称存在于名册中且此前未完成签到（签到成功）；
* `WRONG`：该名称不属于名册中的任何队伍（非有效队伍）；
* `REPEAT`：该名称属于有效队伍，但此前已经完成过签到（已签到）。

**数据范围：**

* $1 \le n, m \le 10^5$
* 所有队伍名与查询名的字符总数不超过 $10^6$，且均由大写或小写英文字母组成。
* 时间限制：$1.0\text{ s}$，空间限制：$1024\text{ MB}$。

### 思路

本题为典型的字符串检索与状态更新问题。

1. **状态设计**：
每个有效队伍存在两种业务状态：未签到（`false`）与已签到（`true`）。若查询的字符串从未在名册中出现，则属于非法队伍。
2. **算法选型**：
利用平衡二叉搜索树映射容器 `std::map<std::string, bool>`（底层为红黑树）维护“队伍名称 $\to$ 签到状态”。
* **预处理**：依次读入 $n$ 个队伍名称，将其作为键存入 `map` 中，对应的值初始化为 `false`。
* **查询处理**：对于每次输入的查询字符串 $s$：
* 利用 `count(s)` 检索键是否存在。若不存在，说明是非有效队伍，直接输出 `WRONG`；
* 若键存在，读取其布尔值：若为 `false` 则输出 `OK`，若为 `true` 则输出 `REPEAT`；
* 查询后将对应键的值置为 `true`，完成状态流转。





### 复杂度分析

* **时间复杂度**：$\mathcal{O}(L \log n)$。其中 $L$ 为名册与查询中所有字符串的字符总数（$L \le 10^6$）。在 `std::map` 中单次查找与插入需要比较字符串，总操作在红黑树深度 $\mathcal{O}(\log n)$ 范围内完成，在 $1.0\text{ s}$ 时限内可稳定通过。
* **空间复杂度**：$\mathcal{O}(L_{\text{roster}} + n)$。其中 $L_{\text{roster}}$ 为名册中所有字符串的字符长度之和。空间主要用于存储红黑树的节点开销及名册字符串，远低于 $1024\text{ MB}$ 限制。

### 参考代码

??? node 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

void fc() {
    int n, m;
    std::cin >> n >> m;

    // 维护名册信息：key 为队伍名称，value 为签到状态（false: 未签到, true: 已签到）
    std::map<std::string, bool> name;
    for (int i = 0; i < n; i++) {
        std::string s;
        std::cin >> s;
        name[s] = false; // 初始状态为未签到
    }

    // 处理 m 次签到查询
    for (int i = 0; i < m; i++) {
        std::string s;
        std::cin >> s;
        
        // 1. 判断是否属于有效队伍
        if (!name.count(s)) {
            std::cout << "WRONG\n";
            continue;
        } else {
            // 2. 有效队伍：根据当前状态输出结果
            std::cout << (name[s] ? "REPEAT" : "OK") << "\n";
            // 3. 更新为已签到状态
            name[s] = true;
        }
    }
}

int main() {
    // 解绑 C++ 与 C 的标准输入输出流，提升 I/O 效率
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int t = 1;
    while (t--) fc();
    return 0;
}

```

???



## Problem F. 五十年卓越

### 题目大意

考虑连续的 $n$ 年，每年固定准备 $m$ 道题目，每道题均有一个整数评分 $a_{i, j}$。
定义第 $i$ 年的分数 $S_i$ 为该年全部 $m$ 道题目的评分之和，即：


$$S_i = \sum_{j=1}^m a_{i, j}$$


特别地，第一年之前的基准分数定义为 $S_0 = 0$。

若某年的分数严格小于上一年的分数（即 $S_i < S_{i-1}$），则称该年为“卓越年”（第一年与 $S_0 = 0$ 进行比较）。计算并输出这 $n$ 年中卓越年的总个数。

**数据范围：**

* $1 \le n \le 50$
* $1 \le m \le 13$
* $-1000 \le a_{i, j} < 0$
* 时间限制：$1.0\text{ s}$，空间限制：$1024\text{ MB}$

### 思路

本题是一道线性的序列模拟与条件计数问题。

1. **状态定义与初始值**：
引入变量 $\textit{pre}$ 记录前一年的总分。根据题面规定，第一年之前（即第 $0$ 年）的评分为 $0$，因此初始状态设定为 $\textit{pre} = 0$。同时设立计数器 $\textit{ans} = 0$。
2. **状态转移与判断**：
按年份顺序从第 $1$ 年循环至第 $n$ 年：
* 读入该年 $m$ 道题目的评分并求和，得到当年分数 $\textit{sum} = \sum_{j=1}^{m} a_{i, j}$。
* 比较当年分数 $\textit{sum}$ 与前一年分数 $\textit{pre}$：若满足严格小于条件 $\textit{sum} < \textit{pre}$（即代码中的 `pre > sum`），则说明当前年份为卓越年，计数器累加 $1$。
* 状态滚动：将当前年份的总分更新为历史分数，即 $\textit{pre} \leftarrow \textit{sum}$，为下一年的比较提供基准。


3. **数值边界考量**：
每道题目的评分取值范围为 $[-1000, -1]$，单年总分的极值范围为 $[13 \times (-1000), 13 \times (-1)] = [-13000, -13]$。各项数值及其累加和均严格落在标准 32 位有符号整型（`int`）表示范围内，不会发生算术溢出。

### 复杂度分析

* **时间复杂度**：$\mathcal{O}(n \cdot m)$。总共处理 $n$ 年的数据，每年需进行 $m$ 次读入与累加计算，总操作次数上限为 $50 \times 13 = 650$ 次，远远低于 $1.0\text{ s}$ 的计算上限，耗时在毫秒级别。
* **空间复杂度**：$\mathcal{O}(1)$。在流式读取输入并完成累加判定的过程中，仅使用了有限的标量变量（`pre`、`sum`、`ans` 等）维护状态，无需存储完整的二维矩阵，辅助空间复杂度为常数级。

### 参考代码

??? node 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

void fc() {
    int n, m;
    std::cin >> n >> m;

    // pre 记录上一年的总分，初始第 0 年设定为 0；ans 统计卓越年总数
    int pre = 0, ans = 0;
    for (int i = 0; i < n; i++) {
        int sum = 0;
        // 累加计算第 i 年的 m 道题目总评分
        for (int j = 0; j < m; j++) {
            int x;
            std::cin >> x;
            sum += x;
        }
        // 若当前年总分严格小于上一年总分，则卓越年计数加 1
        ans += (pre > sum);
        // 滚动更新前一年的总分
        pre = sum;
    }

    std::cout << ans << "\n";
}

int main() {
    // 关闭同步流以提升 I/O 效率
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int t = 1;
    // std::cin >> t;
    while (t--) fc();
    return 0;
}

```

???

## Problem C. 排列逆序

### 题目大意

存在一个未知的 $1 \sim n$ 的全排列 $p = (p_1, p_2, \dots, p_n)$。给定 $m$ 条偏序信息，每条信息包含一个区间 $[l_i, r_i]$ 以及该区间内下标构成的排列 $q_{i, 1}, q_{i, 2}, \dots, q_{i, r_i - l_i + 1}$，表示这些位置上的数值满足严格单调递增关系：


$$p_{q_{i, 1}} < p_{q_{i, 2}} < \dots < p_{q_{i, r_i - l_i + 1}}$$

要求构造一个满足所有给定信息且**逆序对数最小**的排列 $p$。若不存在满足条件的合法排列，输出 `-1`；若存在多个逆序数最小的最优排列，输出任意一个。

**数据范围：**

* $1 \le T \le 10^6$
* $1 \le n, m \le 10^6$
* $1 \le l_i \le r_i \le n$
* $\sum n \le 10^6$，$\sum m \le 10^6$，且 $\sum_{i=1}^m (r_i - l_i + 1) \le 10^6$
* 时间限制：$3.0\text{ s}$，空间限制：$1024\text{ MB}$

---

### 思路

本题可转化为**带偏序约束的有向无环图（DAG）拓扑排序与贪心数值分配问题**。

1. **图论建模与约束转化**：
* 题面中给出的每个区间偏序链形如 $p_{q_1} < p_{q_2} < \dots < p_{q_k}$。在值的大小关系上，这等价于对相邻项施加前驱与后继约束。
* 将每个下标 $1 \sim n$ 视作图中的一个顶点。对于每条信息中的相邻下标对 $(q_j, q_{j+1})$，建立一条有向边 $q_j \to q_{j+1}$，表示下标 $q_j$ 的值必须严格小于下标 $q_{j+1}$ 的值（即 $q_j$ 是 $q_{j+1}$ 的拓扑前驱），同时累加后继节点的入度。


2. **拓扑排序与无解判定**：
* 若构建的有向图中存在有向环，则表示存在形如 $p_{u} < \dots < p_{v} < p_{u}$ 的自相矛盾链，此时无法赋出任何严格递增的实数值，说明无解，直接输出 `-1`。
* 拓扑排序过程中，若最终成功出队的节点总数小于 $n$，说明图中存在环，判定为无解。


3. **最小化逆序数的贪心策略**：
* 逆序对定义为满足 $x < y$ 且 $p_x > p_y$ 的二元组 $(x, y)$。
* 若两个下标 $u$ 和 $v$（不妨设 $u < v$）在偏序图中没有强依赖关系，当赋予 $p_u < p_v$ 时对逆序数的贡献为 $0$，而赋予 $p_u > p_v$ 时则会产生 $1$ 个逆序对。因此，**在所有没有前驱依赖的候选位置中，下标较小者应当优先分配较小的数值**。
* 维护当前所有入度为 $0$ 的节点集合，使用小根堆（优先队列）维护可用下标。赋值计数器 $k$ 从 $1$ 单调递增到 $n$：
* 每次从小根堆中弹出**当前最小的下标** $u$，分配当前最小的值 $k$，即令 $p_u = k$；
* 随后遍历 $u$ 的所有出边节点 $v$，将 $v$ 的入度减 $1$。若某个后继节点的入度减为 $0$，则将其推入小根堆。


* 该策略能保证较小的值最大程度地落在靠前的下标上，使得生成的排列在满足拓扑偏序的前提下，逆序对数量达到理论最小值。



---

### 复杂度分析

* **时间复杂度**：$\mathcal{O}\left(T + \sum (n \log n + E)\right)$，其中 $E = \sum_{i=1}^m (r_i - l_i)$ 为所有相邻关系生成的总边数。
* 对于每组测试数据，建图消耗 $\mathcal{O}(E)$ 时间。
* 小根堆中每个节点至多进堆、出堆各一次，优先队列操作耗时 $\mathcal{O}(n \log n)$。
* 遍历所有边和点完成拓扑排序的时间为 $\mathcal{O}(n + E)$。
* 根据题目数据范围保证，$\sum n \le 10^6$ 且 $\sum E \le 10^6$，整体运行时间在 $10^7$ 次基本运算以内，在 $3.0\text{ s}$ 时限内具有充足的常数余量。


* **空间复杂度**：$\mathcal{O}(N + \sum E)$。
* 邻接表 `g` 的总边数不超过 $10^6$。
* 入度数组 `deg`、答案存储 `ans` 以及优先队列的节点数规模为 $\mathcal{O}(n)$。
* 内存开销稳定在几十兆字节级别，远低于 $1024\text{ MB}$ 的限制。



---

### 参考代码

??? node 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

const int N = 1e6 + 5;

// 有向图邻接表、入度数组以及最终排列答案数组
std::vector<std::vector<int>> g(N);
int deg[N], ans[N];
int n, m;

// 针对单组用例进行 O(n) 的高效清空，避免全局 memset 导致超时
void clear() {
    for (int i = 1; i <= n; i++) {
        g[i].clear();
        deg[i] = 0;
    }
}

void fc() {
    std::cin >> n >> m;
    clear();

    // 1. 读取偏序约束并建图
    for (int i = 0; i < m; i++) {
        int l, r;
        std::cin >> l >> r;
        int pre;
        std::cin >> pre;
        // 依次将相邻约束转化为有向边 pre -> x
        for (int j = l + 1; j <= r; j++) {
            int x;
            std::cin >> x;
            g[pre].push_back(x);
            deg[x]++;
            pre = x;
        }
    }

    // 2. 使用小根堆维护当前所有入度为 0 的候选下标，以贪心最小化逆序数
    std::priority_queue<int, std::vector<int>, std::greater<int>> q;
    for (int i = 1; i <= n; i++) {
        if (deg[i] == 0) {
            q.push(i);
        }
    }

    int k = 1; // 当前待分配的数值（从 1 开始递增至 n）
    while (!q.empty()) {
        int u = q.top();
        q.pop();

        ans[u] = k++; // 将当前最小的值赋给最小的可用下标

        // 释放后继节点的入度
        for (int v : g[u]) {
            if (--deg[v] == 0) {
                q.push(v);
            }
        }
    }

    // 3. 有向环判定：若拓扑排序未遍历所有节点，说明存在环，无解
    if (k <= n) {
        std::cout << "-1\n";
        return;
    }

    // 4. 格式化输出目标排列
    for (int i = 1; i <= n; i++) {
        std::cout << ans[i] << (i == n ? "" : " ");
    }
    std::cout << "\n";
}

int main() {
    // 提升 I/O 流执行效率
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int t = 1;
    std::cin >> t;
    while (t--) fc();
    return 0;
}

```

???

## Problem D. 序列

### 题目大意

给定一个长度为 $n$ 的 $01$ 序列 $s = (s_1, s_2, \dots, s_n)$。对于每个位置 $i$（$1 \le i \le n$），定义其特征值 $p_i$ 为前缀 $s[1 \dots i]$ 中与 $s_i$ 不同的字符总数，即：


$$p_i = \sum_{j=1}^i [s_i \neq s_j]$$

现给定整数 $n$ 以及多重集 $\{p_1', p_2', \dots, p_n'\}$，求能够产生该多重集的合法 $01$ 序列 $s$ 的方案数。答案对 $998244353$ 取模。保证至少存在一个满足条件的合法序列。

**数据范围：**

* $1 \le n \le 10^5$
* $0 \le p_i' \le n - 1$
* 时间限制：$1.0\text{ s}$，空间限制：$1024\text{ MB}$

---

### 思路

本题的核心在于**前缀状态抽象**与**贪心强制转移分析**。

#### 1. 状态表示与对称性规范化

考虑从左到右逐位构造 $01$ 序列 $s$：

* 对于当前已构造的前缀，下一步填入字符所产生的特征值 $p$，仅取决于该前缀中 $0$ 的个数与 $1$ 的个数，具体字符的排列顺序不影响后续产生的值。
* 记当前前缀中 $0$ 的出现次数为 $a$，$1$ 的出现次数为 $b$。
* **对称性原理**：将整个序列的所有位置按位取反（$0 \leftrightarrow 1$），由于每一对相异字符的判定条件 $[s_i \neq s_j]$ 保持不变，所生成的特征值多重集完全一致。因此，状态只与计数组合 $\{a, b\}$ 有关。为了消除对称冗余，可在构造过程中始终保持规范化状态：$a \le b$。

#### 2. 状态转移的分类讨论与强制性

从初态 $(a, b) = (0, 0)$ 开始，进行 $n$ 步转移，每一步必须从剩余多重集中消耗一个元素：

* **情况一：$a = b$（对称平衡态）**
* 若下一步填入 $0$，此前已有 $b$ 个 $1$，产生 $p = b = a$；
* 若下一步填入 $1$，此前已有 $a$ 个 $0$，产生 $p = a$。
* 两种选择产生的特征值均为 $a$。因此，必须从剩余多重集中消耗一个数值 $a$。
* 填 $0$ 与填 $1$ 分别产生状态 $(a+1, a)$ 与 $(a, a+1)$，规范化后均等价于 $(a, a+1)$，但代表两条完全独立、互为反演的合法路径。
* 故**每次到达 $a = b$ 状态时，方案数必定乘以 $2$**。状态转移为 $(a, a+1)$。


* **情况二：$a < b$（偏序约束态）**
* 若填入较少字符的相异字符，产生特征值 $p = a$，状态变为 $(a, b+1)$；
* 若填入较多字符的相异字符，产生特征值 $p = b$，状态变为 $(a+1, b)$。
* **决策唯一性推导**：
1. 若当前多重集中**仍存在剩余的数值 $a$**：下一步**必须**产生 $a$。
*反证法*：若此处选择产生 $b$，较小计数将增加至 $a+1$。由于计数单调不减，后续过程中前缀的 $0$ 和 $1$ 计数均至少为 $a+1$，剩余的数值 $a$ 将永远无法被生成，导致无解。因此该步分支是唯一的，只能消耗一个 $a$，状态更新为 $(a, b+1)$。
2. 若当前多重集中**已无剩余的数值 $a$**：下一步绝不能产生 $a$，只能产生 $b$。消耗一个数值 $b$，状态变为 $(a+1, b)$。若此时 $a+1 = b$，则系统重新进入平衡态。





#### 3. 统计方案数

题目保证至少存在一个满足条件的序列。因此，直接使用频数数组维护多重集中各数值的出现次数，按照上述确定性状态机模拟 $n$ 步。设过程中经历 $a = b$ 平衡态的总次数为 $k$，最终合法序列总数即为：


$$\text{Ans} = 2^k \pmod{998244353}$$

---

### 复杂度分析

* **时间复杂度**：$\mathcal{O}(n)$。统计元素频数需要 $\mathcal{O}(n)$ 时间；状态机单步转移仅涉及常数次数值判断与累加，模拟 $n$ 步耗时 $\mathcal{O}(n)$；快速幂计算 $2^k \bmod 998244353$ 耗时 $\mathcal{O}(\log n)$。总运行时间为线性，远低于 $1.0\text{ s}$ 限制。
* **空间复杂度**：$\mathcal{O}(n)$。仅需开设大小为 $\mathcal{O}(n)$ 的频数数组记录每个特征值的剩余数量。

---

### 参考代码

??? node 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

const ll mod = 998244353;

// 快速幂计算 (a^b) % mod
ll qpow(ll a, ll b) {
    ll res = 1;
    for (; b; b >>= 1, a = a * a % mod) {
        if (b & 1) res = a * res % mod;
    }
    return res;
}

void fc() {
    int n;
    std::cin >> n;

    // 频数数组统计各特征值的出现次数
    std::vector<int> cnt(n + 1, 0);
    for (int i = 0; i < n; i++) {
        int x;
        std::cin >> x;
        cnt[x]++;
    }

    int a = 0, b = 0; // a 维护较小计数，b 维护较大计数
    ll k = 0;         // 统计 a == b 平衡态的触发次数

    for (int i = 0; i < n; i++) {
        if (a == b) {
            // Case 1: 对称平衡态，产生两种对称独立分支
            k++;
            cnt[a]--;
            b++;
        } else {
            // Case 2: a < b，根据剩余多重集中是否存在 a 进行强制转移
            if (cnt[a] > 0) {
                cnt[a]--;
                b++;
            } else {
                cnt[b]--;
                a++;
            }
        }
    }

    // 每个平衡态带来因子 2
    ll ans = qpow(2, k);
    std::cout << ans << "\n";
}

int main() {
    // 解绑标准 I/O 以提升读写效率
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int t = 1;
    // std::cin >> t;
    while (t--) fc();
    return 0;
}

```

???

请问是否需要对本题中“合法性无解判定分支（多重集非法时输出 0 的完备校验）”进行扩展探讨，还是需要一组基于格路计数/前缀状态机建模的进阶配套练习题？


## Problem L. 最长公共前缀

### 题目大意

给定 $n$ 个由小写英文字母组成的非空字符串 $s_1, s_2, \dots, s_n$。
对每对整数 $(i, j)$（$1 \le j \le i \le n$），定义 $f_{i, j}$ 为在前 $i$ 个字符串中任选 $j$ 个字符串时，它们的最长公共前缀（LCP）的最大可能长度：


$$f_{i, j} = \max_{T \subseteq \{1, 2, \dots, i\}, \vert{}T\vert{} = j} \vert{}\text{LCP}(s_k \mid k \in T)\vert{}$$


规定单个字符串的最长公共前缀长度即为其自身长度。

对于每个前缀阶段 $i = 1, 2, \dots, n$，计算并输出所有 $j \in [1, i]$ 对应的 $(f_{i, j} \oplus j)$ 的按位异或和：


$$\bigoplus_{j=1}^i (f_{i, j} \oplus j)$$

**数据范围：**

* $1 \le n \le 5 \cdot 10^5$
* $\sum_{i=1}^n \vert{}s_i\vert{} \le 5 \cdot 10^5$
* 所有字符串仅由小写英文字母组成
* 时间限制：$1.0\text{ s}$，空间限制：$1024\text{ MB}$

---

### 思路

#### 1. 字典树（Trie）与公共前缀映射

多个字符串的公共前缀在字典树上具有直接的几何对应关系：

* 若集合 $T$ 中的所有字符串具有长度为 $L$ 的公共前缀，则在字典树上必然存在一个深度为 $L$ 的节点 $u$（满足根节点深度为 $0$），使得集合 $T$ 中的每一个字符串在插入时都经过了该节点 $u$。
* 设节点 $u$ 的树深度为 $\textit{dep}[u]$，在前 $i$ 个串中经过节点 $u$ 的字符串总数为 $\textit{cnt}[u]$。则以节点 $u$ 为前缀的字符串数量达到了 $\textit{cnt}[u]$ 个，它能够为所有选出子集大小 $j \le \textit{cnt}[u]$ 提供长度为 $\textit{dep}[u]$ 的公共前缀候选值。
* 因此，在任意时刻，选出 $j$ 个字符串的最大 LCP 长度可表示为：

$$f_j = \max \{ \textit{dep}[u] \mid \textit{cnt}[u] \ge j \}$$



#### 2. 增量维护与状态继承

随着字符串按 $i = 1, 2, \dots, n$ 的顺序逐个插入，整个系统的状态具有单调性与增量特性：

1. **新增集合容量**：当处理第 $i$ 个字符串时，$j$ 的取值范围由 $[1, i-1]$ 扩展到 $[1, i]$。在考虑新字符串之前，$f_i$ 的基础初值为 $0$（对应空前缀），将 $(f_i \oplus i) = (0 \oplus i) = i$ 率先异或计入当前总答案。
2. **节点计数的动态跃迁**：遍历当前字符串 $s_i$ 的每个字符，沿 Trie 树向下移动。对于沿途访问的每个节点 $u$：
* 将经过该节点的计数加 $1$：$\textit{cnt}[u] \leftarrow \textit{cnt}[u] + 1$；
* 此时，经过节点 $u$ 的字符串个数恰好达到了新的高度 $c = \textit{cnt}[u]$。
* **核心性质**：由于节点 $u$ 的深度 $\textit{dep}[u]$ 是恒定不变的，在其计数此前达到 $1, 2, \dots, c-1$ 的历史时刻，已经分别对 $f_1, f_2, \dots, f_{c-1}$ 进行过候选更新。因此，当 $\textit{cnt}[u]$ 递增到 $c$ 时，**只需且仅需尝试更新 $f_c$**。
* 若 $\textit{dep}[u] > f_c$，说明我们找到了一个包含 $c$ 个串且更长的公共前缀，执行状态松弛：$f_c \leftarrow \textit{dep}[u]$。



#### 3. 异或和的 $O(1)$ 动态更新

题目要求维护全局异或和 $\textit{ans} = \bigoplus_{j=1}^i (f_j \oplus j)$。利用异或运算的自反性（$x \oplus y \oplus y = x$）：

* 当某个 $f_c$ 即将从旧值 $\textit{old}$ 被更新为新值 $\textit{new} = \textit{dep}[u]$ 时，原有的贡献项为 $(\textit{old} \oplus c)$，新的贡献项为 $(\textit{new} \oplus c)$；
* 仅需执行两步异或操作即可在 $\mathcal{O}(1)$ 内完成总贡献维护：

$$\textit{ans} \leftarrow \textit{ans} \oplus (\textit{old} \oplus c) \oplus (\textit{new} \oplus c)$$


* 单个字符插入过程中至多触发一次该更新操作，无需重构任何全局数组。

*(注：原代码草稿中使用加减算子 `+=` / `-=` 维护累加和，依据题面规范的按位异或要求，应统一采用自反异或操作 `^=` 维护。)*

---

### 复杂度分析

* **时间复杂度**：$\mathcal{O}\left(\sum_{i=1}^n \vert{}s_i\vert{} \cdot \vert{}\Sigma\vert{}\right)$，其中 $\vert{}\Sigma\vert{} = 26$。每个字符在 Trie 树上转移与分配节点的开销为 $\mathcal{O}(1)$，沿途更新 $\textit{cnt}$、比较 $f_c$ 并维护全局异或和的操作均为 $\mathcal{O}(1)$。总运行时间严格正比于输入字符总数，在 $5 \cdot 10^5$ 规模下耗时约数十毫秒，远低于 $1.0\text{ s}$ 限制。
* **空间复杂度**：$\mathcal{O}\left(\vert{}\Sigma\vert{} \cdot \sum_{i=1}^n \vert{}s_i\vert{}\right)$。Trie 树的节点总数不超过 $\sum \vert{}s_i\vert{} + 1$。各状态数组大小为 $\mathcal{O}(N)$，空间开销约数十兆字节，远小于 $1024\text{ MB}$ 的限制。

---

### 参考代码

??? node 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

const int N = 5e5 + 5;
const int SIGMA = 26;

// tree 存储字典树转移边，cnt 记录经过各节点的字符串数，ch 记录节点深度
int tree[N][SIGMA], cnt[N], ch[N], idx;
// f[j] 表示当前选出 j 个串的最大 LCP 长度，ans 维护当前前缀的异或和
int f[N];
ll ans = 0;

void insert(const std::string& s) {
    int u = 0;
    for (char c : s) {
        int bit = c - 'a';
        if (!tree[u][bit]) {
            tree[u][bit] = ++idx;
            ch[idx] = ch[u] + 1; // 节点深度即为公共前缀长度
        }
        u = tree[u][bit];
        cnt[u]++;

        // 仅在 cnt[u] 达到新数值且深度更优时更新 f[cnt[u]]
        if (ch[u] > f[cnt[u]]) {
            // 利用异或自反性：先消除旧贡献，再并入新贡献
            ans ^= (f[cnt[u]] ^ cnt[u]);
            f[cnt[u]] = ch[u];
            ans ^= (f[cnt[u]] ^ cnt[u]);
        }
    }
}

void fc() {
    int n;
    std::cin >> n;
    std::string s;

    for (int i = 1; i <= n; i++) {
        std::cin >> s;
        // 扩展第 i 个位置的初值状态：初始 f[i] = 0，贡献为 (0 ^ i) = i
        ans ^= (f[i] ^ i);

        // 将当前字符串插入字典树并动态松弛相关状态
        insert(s);

        // 输出当前前缀 i 的最终异或和
        std::cout << ans << "\n";
    }
}

int main() {
    // 提高标准 I/O 执行效率
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int t = 1;
    // std::cin >> t;
    while (t--) fc();
    return 0;
}

```

???

