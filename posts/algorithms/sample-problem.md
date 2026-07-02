---
title: 'Two Sum — 两数之和'
date: 2026-01-15
tags:
  - 数组
  - 哈希表
  - LeetCode
difficulty: Easy
langs: [cpp, python, java]
readingTime: 5
description: 'LeetCode 1. Two Sum 的多种解法，包含暴力枚举和哈希表优化。'
---

# Two Sum — 两数之和

## 题目描述

> 给定一个整数数组 `nums` 和一个整数目标值 `target`，请你在该数组中找出 **和为目标值** 的那 **两个** 整数，并返回它们的数组下标。
>
> 你可以假设每种输入只会对应一个答案，且同样的元素不能被重复利用。

**示例：**

```
输入：nums = [2, 7, 11, 15], target = 9
输出：[0, 1]
解释：因为 nums[0] + nums[1] == 9，返回 [0, 1]。
```

## 解法一：暴力枚举

### 思路

两层循环枚举所有数对，检查两数之和是否等于 `target`。

### 复杂度

- **时间复杂度：** O(n²)
- **空间复杂度：** O(1)

### 代码

::: code-group

```cpp [C++]
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        int n = nums.size();
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (nums[i] + nums[j] == target) {
                    return {i, j};
                }
            }
        }
        return {};
    }
};
```

```python [Python]
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        n = len(nums)
        for i in range(n):
            for j in range(i + 1, n):
                if nums[i] + nums[j] == target:
                    return [i, j]
        return []
```

```java [Java]
class Solution {
    public int[] twoSum(int[] nums, int target) {
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        return new int[]{};
    }
}
```

:::

## 解法二：哈希表（最优）

### 思路

遍历数组，用哈希表存储每个元素的值和下标。对于每个元素 `nums[i]`，检查 `target - nums[i]` 是否已在哈希表中。

### 复杂度

- **时间复杂度：** O(n)
- **空间复杂度：** O(n)

### 代码

::: code-group

```cpp [C++]
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> hash;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (hash.count(complement)) {
                return {hash[complement], i};
            }
            hash[nums[i]] = i;
        }
        return {};
    }
};
```

```python [Python]
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        hash_map = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in hash_map:
                return [hash_map[complement], i]
            hash_map[num] = i
        return []
```

```java [Java]
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}
```

:::

## 关键思路

- 哈希表解法是典型「空间换时间」策略
- 一次遍历即可完成，注意先查再存（避免使用当前元素自身）
- 本题是哈希表应用的经典入门题

## 相关题目

- [167. Two Sum II - Input Array Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)
- [15. 3Sum](https://leetcode.com/problems/3sum/)
- [454. 4Sum II](https://leetcode.com/problems/4sum-ii/)
