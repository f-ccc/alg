//[left, right]（两端都是闭区间） left 和 right 指向的元素都包含在当前的搜索范围内
int l = 0, r = n - 1;
while (l <= r)
{
    int mid = l + (r - l) / 2;
    if (a[mid] == k)
    {
        return mid;
        // 找到了提前返回
    }
    else if (a[mid] < k)
        l = mid + 1;
    else
        r = mid - 1;
}
// 没有找到返回-1
return -1;