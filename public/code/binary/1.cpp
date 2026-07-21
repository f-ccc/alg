int l = -1, r = n;
while (l + 1 < r)
{
    int mid = l + (r - l) / 2;
    if (a[mid] < k)
        l = mid; // mid 及其左侧都 < k
    else
        r = mid; // mid 就是第一个 >= k 的位置
}
// 关于这里应该返回什么 可以看看if判断怎么折半的
// 如果a[mid]<k l=mid r就是答案 反过来如果 a[mid]<=k l=mid 这样l就是答案
// 可以看那个是有等号折半 那个就是二分后的答案
return r; // r 就是第一个 ;