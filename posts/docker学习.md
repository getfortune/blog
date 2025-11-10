---
id: "4"
title: 'docker 学习'
date: '2025-11-07'
excerpt: 'docker 学习'
tags: ['docker', '学习']
---
# docker 学习

## 修改镜像源
1. 查看当前的docker配置文件没有就创建 /etc/docker/daemon.json
2. 在配置文件中添加以下内容：
```json
{
  "registry-mirrors": [
    "阿里的镜像源（https://<你的ID>.mirror.aliyuncs.com）需要登录阿里云账号然后去控制台获取",
    "腾讯云的镜像源（https://mirror.ccs.tencentyun.com）"
  ]
}
```
3. 重启docker服务
```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```
