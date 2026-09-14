---
date: 2026-09-12
---

# 2026 ICPC Asia EC 网络赛（2）

## J. Joker or Judger

### 题目大意

给定评测人员收到的 $n$ 条负面评价字符串以及预期的总容忍扣分上限 $P$。负面评价对应的类别与扣分规则如下：

* `WrongProblemX`：$100$ 分
* `SameProblemX`：$30$ 分
* `UnreasonableProblemArrangement`：$10$ 分
* `UnreasonableLimitForProblemX`：$5$ 分
* `WeakTestsForProblemX`：$3$ 分
* `BadProblemX`：$1$ 分

其中 $X$ 为占位符，且必须严格替换为集合 $\{\text{'A'}, \text{'B'}, \dots, \text{'L'}\}$ 中的某一个大写英文字母。匹配过程区分大小写。若字符串不符合上述任何规则，则该条评价的分值为 $0$。

试计算所有评价的总扣分，若严格大于 $P$，则输出 `Joker`；否则输出 `Judger`。

**数据范围：**

* $1 \le T \le 10^3$
* $0 \le n \le 10^3$，$0 \le P \le 10^5$
* 评价字符串 $S$ 满足 $1 \le \vert{}S\vert{} \le 50$，且仅由大小写英文字母组成
* 保证单个测试用例中所有字符串数量之和 $\sum n \le 10^3$

### 思路

本题属于规则明确的字符串匹配与模拟统计问题。

1. **规则分类**：
* **无后缀固定串**：只有 `"UnreasonableProblemArrangement"` 一种，若完全相等则直接计 $10$ 分。
* **带后缀变量串**：其余所有合法规则均以单个大写字母 $X \in [\text{'A'}, \text{'L'}]$ 结尾。


2. **匹配逻辑**：
* 读入评价字符串 $S$。
* 若 $S = \text{"UnreasonableProblemArrangement"}$，则得分增加 $10$。
* 否则，检验其末尾字符 $S.\text{back}()$ 是否在区间 $[\text{'A'}, \text{'L'}]$ 内：
* 若在区间内，将末尾字符弹出，得到前缀串 $S'$；
* 将 $S'$ 在预设的哈希映射表（包含 `WrongProblem`、`SameProblem`、`UnreasonableLimitForProblem`、`WeakTestsForProblem`、`BadProblem` 及其对应分值）中进行查找并累加分值；
* 若查找不存在或末尾字符不合规，则分值为 $0$。



3. **阈值判定**：
* 遍历完 $n$ 个字符串后，比较累计总分 $\text{sum}$ 与阈值 $P$。若 $\text{sum} > P$ 输出 `Joker`，否则输出 `Judger`。



### 复杂度分析

* **时间复杂度**：每个测试用例处理 $n$ 个长度不超过 $\vert{}S\vert{}$ 的字符串。单次前缀截取与哈希匹配开销为 $\mathcal{O}(\vert{}S\vert{})$。单测试点总时间复杂度为 $\mathcal{O}\left(\sum n \cdot \vert{}S\vert{}\right)$。在 $\sum n \le 10^3$ 与 $\vert{}S\vert{} \le 50$ 的约束下，计算量约为 $5 \times 10^4$ 次基本操作，运行耗时在毫秒级。
* **空间复杂度**：哈希映射仅存储固定数量的模式串，占用常数空间 $\mathcal{O}(1)$；字符串操作所需辅助空间为 $\mathcal{O}(\vert{}S\vert{})$。因此整体辅助空间复杂度为 $\mathcal{O}(1)$。

### 参考代码

??? node 参考代码

```cpp
#include <iostream>
#include <string>
#include <unordered_map>

void solve() {
    int n, p;
    std::cin >> n >> p;

    // 预先建立带参负面评价的前缀与对应权重的映射
    static const std::unordered_map<std::string, int> score_table = {
        {"WrongProblem", 100},
        {"SameProblem", 30},
        {"UnreasonableLimitForProblem", 5},
        {"WeakTestsForProblem", 3},
        {"BadProblem", 1}
    };

    long long total_score = 0;

    for (int i = 0; i < n; ++i) {
        std::string s;
        std::cin >> s;

        // 判定无后缀固定规则
        if (s == "UnreasonableProblemArrangement") {
            total_score += 10;
        } else if (!s.empty()) {
            char last_char = s.back();
            // 校验末尾占位符 X 是否为合法题号 ('A' ~ 'L')
            if (last_char >= 'A' && last_char <= 'L') {
                s.pop_back(); // 移除占位字符以提取模式前缀
                auto it = score_table.find(s);
                if (it != score_table.end()) {
                    total_score += it->second;
                }
            }
        }
    }

    // 判断扣分是否超出预设阈值
    if (total_score > p) {
        std::cout << "Joker\n";
    } else {
        std::cout << "Judger\n";
    }
}

int main() {
    // 提高 I/O 交互效率
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);

    int t = 1;
    std::cin >> t;
    while (t--) {
        solve();
    }
    return 0;
}

```

???

## L. Loop

### 题目大意

给定一个长度为 $n$ 的整数序列 $a_0, a_1, \dots, a_{n-1}$。
据此构建一个 $n \times n$ 的网格矩阵 $B$，行列下标均从 $0$ 开始。
其中第 $0$ 列由上至下依次填入 $a_0, a_1, \dots, a_{n-1}$；此后每一列均由前一列向下循环移位 $1$ 格得到。形式化定义如下：


$$b_{i, j} = \begin{cases} a_i, & j = 0 \\ b_{(i - 1 + n) \bmod n, \, j - 1}, & j > 0 \end{cases}$$

现有一旅行者从左上角 $(0, 0)$ 出发，每一步仅允许向下或向右移动一格，直至到达右下角 $(n-1, n-1)$。
求该路径所经过的 $2n - 1$ 个格点权值之和的最小值。

**数据范围：**

* $1 \le T \le 10^3$
* $1 \le n \le 10^5$
* $0 \le a_i \le 10^9$
* 保证单个测试用例中所有数据规模之和 $\sum n \le 10^5$

### 思路

1. **格点权值的代数化简**：
根据转移式 $b_{i, j} = b_{(i-1)\bmod n, j-1}$，沿主对角线方向移动时权值保持不变，归纳可得：

$$b_{i, j} = a_{(i - j) \bmod n}$$



即格点 $(i, j)$ 的权值完全取决于其坐标差值 $d = i - j$。  
  
2. **状态映射与游走模型**：
从 $(0, 0)$ 行走至 $(n-1, n-1)$ 共包含 $n-1$ 次“向下”移动与 $n-1$ 次“向右”移动。
令坐标差值 $d = i - j$：
* 向下移动一步：$i \leftarrow i + 1 \implies d \leftarrow d + 1$；
* 向右移动一步：$j \leftarrow j + 1 \implies d \leftarrow d - 1$。


起点处 $d = 0$，终点处 $d = (n-1) - (n-1) = 0$。
在行走过程中，向下步数 $D \in [0, n-1]$，向右步数 $R \in [0, n-1]$，因此任意时刻的差值严格受限于：

$$-(n-1) \le d \le n-1$$



由于 $\vert{}d\vert{} < n$，模运算不会发生跨周期折返：
* 若 $d \ge 0$，则 $(d \bmod n) = d$，格点权值为 $a_d$；
* 若 $d < 0$，则 $(d \bmod n) = n - \vert{}d\vert{}$，格点权值为 $a_{n - \vert{}d\vert{}}$。


若构造辅助数组 $b$，使得 $b_0 = a_0$ 且 $b_k = a_{n - k}$（$1 \le k \le n-1$），则当 $d \le 0$ 时，格点权值可直接表示为 $b_{\vert{}d\vert{}}$。

3. **最优游走策略与贪心极值**：
原问题等价于在一维链图上寻找一条由 $n-1$ 步 $+1$ 与 $n-1$ 步 $-1$ 构成的回路，且起止点均为 $0$。
由于所有权值非负，且步数奇偶交替，任意多余步数的消耗均等价于在某一相邻点对 $(k, k+1)$ 之间往返振荡（每次往返消耗一个 $+1$ 和一个 $-1$，代价为两点权值和）。
为了最小化总代价，最优路径必然选择完全在非负半轴（序列 $a$）或非正半轴（序列 $b$）内进行，并将多余步数全部集中于代价最小的相邻层之间：
以正半轴（序列 $a$）为例，设选取的振荡区间最高层为 $i$ 与 $i+1$（其中 $0 \le i \le n-2$）：
* 从 $0$ 直达 $i$，点 $0 \sim i-1$ 在进出过程中各经过 $2$ 次，贡献 $2 \sum_{j=0}^{i-1} a_j$；
* 剩余 $n - 1 - i$ 对往返步数全部用于在 $i$ 与 $i+1$ 之间来回振荡，使得点 $i$ 共计被访问 $n - i$ 次，点 $i+1$ 共计被访问 $n - 1 - i$ 次。


合并各项系数，该振荡方案对应的总权值为：

$$(a_i + a_{i+1}) \cdot (n - i) - a_{i+1} + 2 \sum_{j=0}^{i-1} a_j$$



同理，负半轴（序列 $b$）具有完全对称的计算公式。  

4. **算法流程**：
特殊判断 $n = 1$ 时答案即为 $a_0$。
对于 $n > 1$，预处理序列 $a$ 和 $b$ 的前缀和，线性枚举分界层 $i \in [0, n-2]$ 并取所有候选值的全局最小值即可。

### 复杂度分析

* **时间复杂度**：构造序列 $b$ 及两序列的前缀和耗时 $\mathcal{O}(n)$；遍历枚举振荡分界点 $i$ 耗时 $\mathcal{O}(n)$。单测试用例运行时间为 $\mathcal{O}(n)$，在 $\sum n \le 10^5$ 的限制下总时间复杂度为 $\mathcal{O}\left(\sum n\right)$，可在毫秒级内完成。
* **空间复杂度**：需要辅助数组存储反向移位序列 $b$ 及其前缀和，空间复杂度为 $\mathcal{O}(n)$。

### 参考代码

??? node 参考代码

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>

using ll = long long;

void solve() {
    int n;
    std::cin >> n;

    std::vector<ll> a(n), b(n);
    for (int i = 0; i < n; ++i) {
        std::cin >> a[i];
    }

    // 边界特判：起点即终点
    if (n == 1) {
        std::cout << a[0] << "\n";
        return;
    }

    // 构造负半轴偏移映射对应的序列 b
    b[0] = a[0];
    for (int i = 1; i < n; ++i) {
        b[i] = a[n - i];
    }

    // 预计算序列 a 与序列 b 的前缀和
    std::vector<ll> pre_a(n + 1, 0), pre_b(n + 1, 0);
    for (int i = 0; i < n; ++i) {
        pre_a[i + 1] = pre_a[i] + a[i];
        pre_b[i + 1] = pre_b[i] + b[i];
    }

    ll min_cost = LLONG_MAX;

    // 枚举在相邻层 (i, i + 1) 进行步数消解振荡的决策点
    for (int i = 0; i < n - 1; ++i) {
        // 在负半轴 (b 序列) 振荡的总代价
        ll cost_b = (b[i] + b[i + 1]) * (n - i) - b[i + 1] + pre_b[i] * 2;
        // 在正半轴 (a 序列) 振荡的总代价
        ll cost_a = (a[i] + a[i + 1]) * (n - i) - a[i + 1] + pre_a[i] * 2;

        min_cost = std::min({min_cost, cost_a, cost_b});
    }

    std::cout << min_cost << "\n";
}

int main() {
    // 提高 I/O 执行效率
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);

    int t = 1;
    std::cin >> t;
    while (t--) {
        solve();
    }
    return 0;
}

```

???



## K. K-MEX

### 题目大意

给定一个长度为 $n$ 的非负整数序列 $a_1, a_2, \dots, a_n$。定义 $\operatorname{mex}(a)$ 为未在序列 $a$ 中出现的最小非负整数。

定义一次 **$k$-变换** 为：对于每个下标 $i \in [1, n]$，独立地选择保留原值 $a_i$ 或将其替换为 $k - a_i$，最终得到一个新序列 $a'$。记 $k\text{-mex}(a)$ 为通过 $k$-变换所能达到的 $\operatorname{mex}(a')$ 的最大值。

共有 $q$ 次独立询问，每次给出一个非负整数 $k$，求 $k\text{-mex}(a)$。为了减少输出量，最终只需输出所有 $q$ 次询问答案的按位异或和（$\bigoplus$）。

**数据范围：**

* $1 \le T \le 10^3$
* $1 \le n \le 5 \times 10^3$
* $0 \le a_i \le 10^9$
* $1 \le q \le 5 \times 10^5$
* $0 \le k \le 10^9$
* 保证单个测试点内 $\sum n \le 5 \times 10^3$，$\sum q \le 5 \times 10^5$

---

### 思路

1. **基准 $\operatorname{mex}$ 与非平凡 $k$ 的判定**：
* 设原序列的 $\operatorname{mex}(a) = m$。根据定义，数 $0, 1, \dots, m-1$ 已经在原序列中存在，而 $m$ 在原序列中不存在。
* 若某种变换能够使得新的 $\operatorname{mex}$ 严格大于 $m$，则新序列中必须构造出数值 $m$。
* 由于原序列中不存在 $m$，数值 $m$ 只能由某个元素 $x \in a$ 经过变换得到，即满足：

$$k - x = m \iff k = m + x$$


* **关键结论**：若给定的询问参数 $k \notin \{m + x \mid x \in a\}$，则任何元素都无法通过变换生成 $m$。这意味着无论如何选择，新序列中必定缺失 $m$，因此必有 $k\text{-mex}(a) = m$。
* 由于原序列中本质不同的元素至多有 $n$ 个，因此可能使得答案大于 $m$ 的“关键 $k$”至多只有 $n$ 种。其余绝大多数询问的答案直接为 $m$。


2. **配对覆盖分析**：
* 固定一个关键候选值 $k$。我们需要从 $t = m$ 开始依次向上检验 $t = m, m+1, m+2, \dots$ 是否能被同时覆盖进新序列中。
* 对于任意数值 $t$，其变换后的互补伙伴为 $u = k - t$。
* 原序列中的 $t$ 可以保持为 $t$ 或变为 $u$；
* 原序列中的 $u$ 可以保持为 $u$ 或变为 $t$；
* 其它任何数值均无法转化为 $t$ 或 $u$。


* 因此，无序数对 $\{t, u\}$ 在序列中所拥有的可用总资源数为 $\operatorname{cnt}(t) + \operatorname{cnt}(u)$。
* 考察从小到大贪心验证当前目标 $t$ 能否存在的过程：
* **情况一：$u < 0$ 或 $u = t$**：
若 $u < 0$，原序列中无负数，无法通过补数提供贡献；若 $u = t$（即 $2t = k$），变换前后数值不变。两者均要求原序列中必须原本就存在 $t$，即需满足 $\operatorname{cnt}(t) \ge 1$。
* **情况二：$u > t$**：
由于 $u > t \ge m$，说明 $u$ 尚未在当前之前的检验中被强制要求占用。此时只需保证 $t$ 能够被表示即可，条件为 $\operatorname{cnt}(t) + \operatorname{cnt}(u) \ge 1$。
* **情况三：$u < t$**：
由于 $u < t$，说明 $u$ 在此前已被作为必须出现的数字占用。为同时保留 $u$ 并构造出 $t$，无序对 $\{t, u\}$ 必须提供至少两个独立元素，条件为 $\operatorname{cnt}(t) + \operatorname{cnt}(u) \ge 2$。


* 一旦上述某一判定条件被打破，说明当前 $t$ 无法被构造，贪心立即终止，此时的最大可能 $\operatorname{mex}$ 即为当前的 $t$。


3. **算法流程**：
* 统计频数并计算初始 $m = \operatorname{mex}(a)$。
* 提取原序列中去重后的所有数值 $x$，生成至多 $n$ 个候选 $k = m + x$。
* 对每个候选 $k$，从 $t = m$ 开始递增模拟检验直到失败，将二元组 $(k, \text{ans}_k)$ 记录在哈希表或有序数组中。
* 处理 $q$ 次询问：在记录中进行检索。若检索命中则累加（异或）其预处理结果；否则直接异或基准值 $m$。



---

### 复杂度分析

* **时间复杂度**：
* 计算初始 $m$ 与离散化去重开销为 $\mathcal{O}(n \log n)$。
* 关键参数 $k$ 至多有 $n$ 个。对于每个 $k$，$t$ 的枚举上限为 $n$（因为序列长度为 $n$，$\operatorname{mex}$ 不可能超过 $n$）。借助有序表对频数进行二分查找耗时 $\mathcal{O}(\log n)$。因此单次测试预处理时间为 $\mathcal{O}(n^2 \log n)$，在 $\sum n \le 5 \times 10^3$ 的数据规模下运算量约为 $10^7$ 级别，运行极快。
* 处理 $q$ 次询问，单次二分检索耗时 $\mathcal{O}(\log n)$，总开销为 $\mathcal{O}(q \log n)$。
* 总体时间复杂度为 $\mathcal{O}\left(\sum (n^2 \log n + q \log n)\right)$。


* **空间复杂度**：
* 仅需保存去重后的元素、频数表以及至多 $n$ 个候选二元组，空间复杂度为 $\mathcal{O}(n)$。



---

### 参考代码

??? node 参考代码

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using ll = long long;

const int N = 5e3 + 5;
int n;
int a[N], cnt[N], vals[N];

// 计算原序列的基础 mex
int get_mex() {
    int mex = 0;
    while (cnt[mex]) mex++;
    return mex;
}

void solve() {
    std::cin >> n;

    // 清空当前测试用例中可能用到的频数数组
    for (int i = 0; i <= n + 2; i++) {
        cnt[i] = 0;
    }

    for (int i = 0; i < n; i++) {
        std::cin >> a[i];
        vals[i] = a[i];
        if (a[i] <= n + 2) {
            cnt[a[i]]++;
        }
    }

    int mex = get_mex();
    int ans = 0;

    // 对原数组进行排序与去重，便于后续统计与二分
    std::sort(vals, vals + n);
    std::vector<std::pair<int, int>> cc;
    for (int i = 0; i < n;) {
        int j = i;
        while (i < n && vals[i] == vals[j]) i++;
        cc.push_back({vals[j], i - j});
    }

    // 快速获取任意数值 val 在原序列中的出现频数
    auto get_c = [&](int val) -> int {
        if (val < 0) return 0;
        if (val <= n + 2) return cnt[val];
        auto it = std::lower_bound(cc.begin(), cc.end(), std::make_pair(val, 0));
        if (it != cc.end() && it->first == val) return it->second;
        return 0;
    };

    // 预处理所有可能产生 mex 提升的关键 k
    std::vector<std::pair<int, int>> as;
    as.reserve(cc.size());

    for (auto& [x, c] : cc) {
        int k = mex + x;
        int nmex = mex;
        
        // 从 mex 开始逐步递增校验连续性
        while (nmex < n) {
            int u = k - nmex;
            int cu = get_c(u);
            int cm = cnt[nmex];

            // 依据 u 与 nmex 的相对大小与有效性进行资源充足性判定
            if (u < 0 || u == nmex) {
                if (cm < 1) break;
            } else if (u > nmex) {
                if (cu + cm < 1) break;
            } else if (u < nmex) {
                if (cu + cm < 2) break;
            }
            nmex++;
        }
        as.push_back({k, nmex});
    }

    // 保证查询序列按 k 升序排列
    std::sort(as.begin(), as.end());

    int q;
    std::cin >> q;
    while (q--) {
        int k;
        std::cin >> k;
        // 若 k 命中候选集合则取强化后的 mex，否则结果为基准 mex
        auto it = std::lower_bound(as.begin(), as.end(), std::make_pair(k, 0));
        if (it != as.end() && it->first == k) {
            ans ^= it->second;
        } else {
            ans ^= mex;
        }
    }

    std::cout << ans << '\n';
}

int main() {
    // 优化 I/O 效率以应对较大规模的查询数据
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);

    int t = 1;
    std::cin >> t;
    while (t--) {
        solve();
    }
    return 0;
}

```

???