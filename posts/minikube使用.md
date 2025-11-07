---
id: "3"
title: 'minikube 使用'
date: '2025-11-07'
excerpt: 'minikube 使用'
tags: ['minikube', '使用']
---
# minikube 使用
## 使用
注意点：minikube 里面的docker 和 主机的docker 是隔离的，需要手动加载主机的docker镜像到minikube集群中, 这样集群里面的docker才能使用到主机镜像
加载的命令：minikube image load 镜像名:标签


## minikube启动
minikube start --image-repository=registry.cn-hangzhou.aliyuncs.com/google_containers
--image-repository=registry.cn-hangzhou.aliyuncs.com/google_containers 修改镜像源
--driver=docker
--container-runtime=docker
--vm-driver=none 不使用虚拟机直接在宿主机上运行


minikube start --driver=docker --container-runtime=docker --vm-driver=none --image-repository=registry.cn-hangzhou.aliyuncs.com/google_containers
### minikube集群加载主机docker镜像
minikube image load registry.k8s.io/metrics-server/metrics-server:v0.8.0