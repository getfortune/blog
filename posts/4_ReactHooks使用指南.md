---
id: "4"
title: 'React Hooks 使用指南'
date: '2023-01-04'
excerpt: '深入学习 React Hooks 的使用方法和最佳实践'
tags: ['React', 'Hooks', '前端']
---
## React Hooks 使用指南

React Hooks 是 React 16.8 引入的新特性，它让我们可以在函数组件中使用状态和其他 React 特性。

### 什么是 Hooks？

Hooks 是一些可以让你在函数组件里"钩入" React state 及生命周期等特性的函数。

### useState Hook

`useState` 是最基本的 Hook，它允许你在函数组件中添加 state：

```javascript
import React, { useState } from 'react';

function Example() {
  // 声明一个叫 "count" 的 state 变量
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

### useEffect Hook

`useEffect` Hook 允许你在函数组件中执行副作用操作：

```javascript
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // 相当于 componentDidMount 和 componentDidUpdate:
  useEffect(() => {
    // 使用浏览器 API 更新页面标题
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

### 自定义 Hooks

你可以创建自定义 Hooks 来复用组件逻辑：

```javascript
import { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```