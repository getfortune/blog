---
id: "2"
title: 'K8S 学习'
date: '2025-11-07'
excerpt: 'K8S 学习'
tags: ['K8S', '学习']
---
# K8S 学习
## 基础概念
###  Pod
Pod 是 K8S 中最小的部署单元，一个 Pod 中可以运行多个容器。
Pod 的生命周期如下：
1. 当创建一个 Pod 时，K8S 会为其分配一个唯一的 ID，并且将其状态设置为 `Pending`。
2. 当 Pod 中的所有容器都启动成功后，K8S 会将其状态设置为 `Running`。
3. 当 Pod 中的所有容器都正常运行时，K8S 会将其状态设置为 `Ready`。
4. 当 Pod 中的所有容器都退出时，K8S 会将其状态设置为 `Failed` 或 `Succeeded`，具体取决于容器的退出码。
5. 当 Pod 被删除时，K8S 会将其状态设置为 `Terminating`，并等待所有容器退出。


### Deployment
Deployment 的主要作用是保证 Pod 的副本数量，因此，Deployment 的创建、更新、删除操作都会触发 Pod 的创建、更新、删除操作。


报错：The Deployment "kubernetes-dashboard" is invalid: spec.selector: Invalid value: {"matchLabels":{"app":"kubernetes-dashboard"}}: field is immutable
因为deployment的selector字段是只读的，不能修改，所以删除deployment后再创建一个新的deployment就可以了
命令：
```shell
kubectl delete deployment deploymentName -n 命名空间
```



### Service
Service 是 K8S 中用于实现服务发现和负载均衡的机制。Service 定义了一个逻辑的服务，它可以将流量路由到一个或多个 Pod 上。


### kubectl
获取指定命名空间的所有service
kubectl get services -n kubernetes-dashboard

编辑指定命名空间下的service配置
kubectl edit svc kubernetes-dashboard -n kubernetes-dashboard