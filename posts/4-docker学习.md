---
id: "4"
title: 'docker 学习'
date: '2025-11-07'
excerpt: 'docker 学习'
tags: ['docker', '学习']
---
# docker 学习

## 下载docker
如果yum不是国内源，可以先配置国内源
```shell
#centos7
sudo curl -o /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.repo
```


1. 更新软件 sudo yum update -y
2. 下载依赖包 sudo yum install -y yum-utils
3. 添加docker-ce的yum源
```shell
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```
4. 安装docker-ce
```shell
sudo yum install docker-ce docker-ce-cli containerd.io -y
```
5. 自启动docker  sudo systemctl start docker
6. 检查docker是否安装成功  sudo systemctl status docker



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

## 下载docker-compose
VERSION=2.27.3
curl -L "https://github.com/docker/compose/releases/download/${VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
