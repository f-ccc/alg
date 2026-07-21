//[left, right)（左闭右开）。即 left 是搜索范围内的元素，而 right 是一个不可达的边界
// 寻找第一个 >= target 的元素的索引 (lower_bound)
int l = 0, r = n; // 右开，初始为 n
while(l < r) {
    int mid = l + (r - l) / 2;
    if(a[mid] < k) {
        l = mid + 1; // 闭区间一侧，排除 mid
    } else {
        r = mid;     // 开区间一侧，保留 mid 作为边界
    }
}
return l; // 此时 l == r