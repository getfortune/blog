---
id: "6"
title: 'gRpc 学习'
date: '2025-11-07'
excerpt: 'gRpc 学习'
tags: [ 'gRpc', '学习' ]
---

# gRpc 学习



## 安装gRpc

以go 语言为例，安装gRpc
下载protobuf 编译器
点击这个网站找到对应的链接下载 https://grpc.io/docs/protoc-installation/
下载完成后记得将这个文件的bin目录放到你的环境变量中

安装go protobuf 插件

```bash
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
```



## 生成gRpc 代码

假设你有一个gRpc 服务的定义文件 `helloworld.proto`，你可以使用以下命令生成对应的go 代码：



### 假设你的 `helloworld.proto` 文件内容如下：

```protobuf
syntax = "proto3";

package helloworld;

option go_package = "github.com/yourusername/helloworld/helloworld";

service Greeter {
  rpc SayHello (HelloRequest) returns (HelloReply) {}
}

message HelloRequest {
  string name = 1;
}

message HelloReply {
  string message = 1;
}
```

这将重新生成 helloworld.pb.go 和 helloworld_grpc.pb.go 文件，其中包含：

- `helloworld.pb.go`：包含了所有的消息类型和服务接口的定义。
- `helloworld_grpc.pb.go`：包含了gRpc 服务的客户端和服务器端的代码。
- 用于填充、序列化和检索 HelloRequest 的代码 HelloReply 消息类型
- 生成的客户端和服务端代码。

```bash
protoc --go_out=. --go_opt=paths=source_relative \
    --go-grpc_out=. --go-grpc_opt=paths=source_relative \
    helloworld.proto  
```





## 服务端生成代码的命名如下

> 单一方法(Unary methods ):

```go
Foo(context.Context, *RequestMsg) (*ResponseMsg, error)
```

RequestMsg 是客户端发送的 protobuf 消息，ResponseMsg 是服务器发送回的 protobuf 消息。

```go
func (s *routeGuideServer) GetFeature(ctx context.Context, point *pb.Point) (*pb.Feature, error) {
    for _, feature := range s.savedFeatures {
        if proto.Equal(feature.Location, point) {
            return feature, nil
        }
    }
    // No feature was found, return an unnamed feature
    return &pb.Feature{Location: point}, nil
}
```

> 服务端流式方法(Server streaming methods ):

```go
Foo(*RequestMsg, grpc.ServerStreamingServer[*ResponseMsg]) error
```

RequestMsg 是来自客户端的单个请求，而 grpc.ServerStreamingServer 表示服务器到客户端响应类型为 ResponseMsg 的流的服务器端

```go
func (s *routeGuideServer) ListFeatures(rect *pb.Rectangle, stream pb.RouteGuide_ListFeaturesServer) error {
    for _, feature := range s.savedFeatures {
        if inRange(feature.Location, rect) {
            if err := stream.Send(feature); err != nil {
                return err
            }
        }
    }
    return nil
}
```

> 客户端流式方法(Client streaming methods ):

```go
Foo(grpc.ClientStreamingServer[*RequestMsg, *ResponseMsg]) error
```

RequestMsg 是客户端发送的 protobuf 消息，ResponseMsg 是服务器发送回的 protobuf 消息。
grpc.ClientStreamingServer 表示客户端到服务器请求类型为 RequestMsg 的流的客户端端

```go
func (s *routeGuideServer) RecordRoute(stream pb.RouteGuide_RecordRouteServer) error {
    var pointCount, featureCount, distance int32
    var lastPoint *pb.Point
    startTime := time.Now()
    for {
        point, err := stream.Recv()
        if err == io.EOF {
            endTime := time.Now()
            return stream.SendAndClose(&pb.RouteSummary{
                PointCount:   pointCount,
                FeatureCount: featureCount,
                Distance:     distance,
                ElapsedTime:  int32(endTime.Sub(startTime).Seconds()),
            })
        }
        if err != nil {
            return err
        }
        pointCount++
        for _, feature := range s.savedFeatures {
            if proto.Equal(feature.Location, point) {
                featureCount++
            }
        }
        if lastPoint != nil {
            distance += calcDistance(lastPoint, point)
        }
        lastPoint = point
    }
}
```

> 双向流式方法(Bidirectional streaming methods ):

```go
Foo(grpc.BidiStreamingServer[*RequestMsg, *ResponseMsg]) error
```

RequestMsg 是客户端发送的 protobuf 消息，ResponseMsg 是服务器发送回的 protobuf 消息。
grpc.BidiStreamingServer 可用于访问客户端到服务器的消息流和服务器到客户端的消息流。

```go
func (s *routeGuideServer) RouteChat(stream pb.RouteGuide_RouteChatServer) error {
    for {
        in, err := stream.Recv()
        if err == io.EOF {
            return nil
        }
        if err != nil {
            return err
        }
        key := serialize(in.Location)
        ... // look for notes to be sent to client
        for _, note := range s.routeNotes[key] {
            if err := stream.Send(note); err != nil {
                return err
            }
        }
    }
}
```





## 客户端生成代码的命名如下

> 单一方法(Unary methods ):

```go
(ctx context.Context, in *RequestMsg, opts ...grpc.CallOption) (*ResponseMsg, error)
```

RequestMsg 是来自客户端的单个请求，而 grpc.ServerStreamingServer 表示服务器到客户端响应类型为 ResponseMsg 的流的服务器端

```go

feature, err := client.GetFeature(context.Background(), &pb.Point{409146138, -746188906})
if err != nil {
...
}
```

> 服务端流式方法(Server streaming methods ):

```go
Foo(ctx context.Context, in *RequestMsg, opts ...grpc.CallOption) (grpc.ServerStreamingClient[*ResponseMsg], error)
```

grpc.ServerStreamingClient 表示服务器到客户端的 ResponseMsg 消息流的客户端。

```go
func printFeatures(client pb.RouteGuideClient, rect *pb.Rectangle) {
    log.Printf("Looking for features within %v", rect)
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
	// 调用服务端流式方法
    stream, err := client.ListFeatures(ctx, rect)
    if err != nil {
        log.Fatalf("client.ListFeatures failed: %v", err)
    }
    for {
        feature, err := stream.Recv()
        if err == io.EOF {
            break
        }
        if err != nil {
            log.Fatalf("client.ListFeatures failed: %v", err)
        }
        log.Printf("Feature: name: %q, point:(%v, %v)", feature.GetName(),
        feature.GetLocation().GetLatitude(), feature.GetLocation().GetLongitude())
    }
}
```

> 客户端流式方法(Client streaming methods ):

```go
Foo(ctx context.Context, opts ...grpc.CallOption) (grpc.ClientStreamingClient[*RequestMsg, *ResponseMsg], error)
```

grpc.ClientStreamingClient 代表客户端到服务器的 RequestMsg 消息流的客户端部分。它既可以用于发送客户端到服务器的消息流，也可以用于接收单个服务器响应消息。

```go
func runRecordRoute(client pb.RouteGuideClient) {
    // Create a random number of random points
    pointCount := int(rand.Int32N(100)) + 2 // Traverse at least two points
    var points []*pb.Point
    for i := 0; i < pointCount; i++ {
        points = append(points, randomPoint())
    }
    log.Printf("Traversing %d points.", len(points))
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
	// 调用客户端流式方法
    stream, err := client.RecordRoute(ctx)
    if err != nil {
        log.Fatalf("client.RecordRoute failed: %v", err)
    }
    for _, point := range points {
		// 发送客户端到服务端的消息
        if err := stream.Send(point); err != nil {
            log.Fatalf("client.RecordRoute: stream.Send(%v) failed: %v", point, err)
        }
    }
	// 接收服务端响应并关闭流
    reply, err := stream.CloseAndRecv()
    if err != nil {
        log.Fatalf("client.RecordRoute failed: %v", err)
    }
    log.Printf("Route summary: %v", reply)
}
```

> 双向流式方法(Bidirectional streaming methods ):

```go
Foo(ctx context.Context, opts ...grpc.CallOption) (grpc.BidiStreamingClient[*RequestMsg, *ResponseMsg], error)
```

grpc.BidiStreamingClient 表示客户端到服务器和服务器到客户端的消息流。

```go
func runRouteChat(client pb.RouteGuideClient) {
    notes := []*pb.RouteNote{
        {Location: &pb.Point{Latitude: 0, Longitude: 1}, Message: "First message"},
        {Location: &pb.Point{Latitude: 0, Longitude: 2}, Message: "Second message"},
        {Location: &pb.Point{Latitude: 0, Longitude: 3}, Message: "Third message"},
        {Location: &pb.Point{Latitude: 0, Longitude: 1}, Message: "Fourth message"},
        {Location: &pb.Point{Latitude: 0, Longitude: 2}, Message: "Fifth message"},
        {Location: &pb.Point{Latitude: 0, Longitude: 3}, Message: "Sixth message"},
    }
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    stream, err := client.RouteChat(ctx)
    if err != nil {
        log.Fatalf("client.RouteChat failed: %v", err)
    }
    waitc := make(chan struct{})
    go func () {
        for {
			// 接收服务端到客户端的消息
            in, err := stream.Recv()
            if err == io.EOF {
                // read done.
                close(waitc)
                return
            }
            if err != nil {
                log.Fatalf("client.RouteChat failed: %v", err)
            }
            log.Printf("Got message %s at point(%d, %d)", in.Message, in.Location.Latitude, in.Location.Longitude)
        }
    }()
    for _, note := range notes {
		// 发送客户端到服务端的消息
        if err := stream.Send(note); err != nil {
            log.Fatalf("client.RouteChat: stream.Send(%v) failed: %v", note, err)
        }
    }
	// 关闭客户端到服务端的流
    stream.CloseSend()
	// 等待服务端响应并关闭流
    <-waitc
}
```





## ALTS authentication  ALTS 身份验证

Application Layer Transport Security (应用层传输安全) 是由谷歌开发的一种双向认证和传输加密系统。它用于保护谷歌基础设施内的 RPC 通信。

> gRPC 中的 ALTS 具有以下特性： 

- 使用 ALTS 作为传输安全协议创建 gRPC 服务器和客户端。
- ALTS 连接具有端到端的隐私和完整性保护。
- 应用程序可以访问对等方信息，例如对等方服务帐户。
- 支持客户端授权和服务器授权。
- 只需对代码进行少量更改即可启用 ALTS。

