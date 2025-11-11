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


在初始化的时候通过配置option 来实现

1. 认证器
   Credentials 通常指的是与传输层的安全性相关的配置，比如 SSL/TLS 证书，或者是应用层的身份验证信息。
2. 拦截器 
   Interceptor 拦截器是一种在 RPC 调用前后执行逻辑的机制，通常用于进行日志记录、监控、错误处理和身份验证等。 
3. TLS（Transport Layer Security）
   gRPC 支持使用 TLS 来加密传输数据。这是实现安全通信的基础，可以保护数据在网络传输过程中的安全。您可以通过提供证书和密钥来配置 TLS：

```go
import (
"google.golang.org/grpc"
"google.golang.org/grpc/credentials"
)

creds, err := credentials.NewServerTLSFromFile("server.crt", "server.key")
if err != nil {
    panic(err)
}
s := grpc.NewServer(grpc.Creds(creds))
```

4. Message-Based Authentication
   除了使用 PerRPCCredentials，您还可以在消息中传递认证信息。比如，您可以在请求的消息体中添加用户身份信息，然后在服务器端进行验证。

5. Streaming Interceptors
   除了单向 RPC（Unary RPC），gRPC 还支持流式 RPC。您可以为流式 RPC 创建相应的拦截器，使用 grpc.StreamServerInterceptor 和 grpc.StreamClientInterceptor。它们的工作原理与 Unary 拦截器类似，但支持处理数据流。
```go
func streamAuthInterceptor(srv interface{}, stream grpc.ServerStream, info *grpc.StreamServerInfo, handler grpc.StreamHandler) error {
// 验证逻辑
    return handler(srv, stream)
}
```

6. Load Balancing
   gRPC 还支持负载均衡，可以将请求分发到多个后端服务。你可以使用 gRPC 的负载均衡策略，或者使用外部负载均衡器。

7. Rate Limiting
   可以通过拦截器或中间件实现速率限制，以防止服务过载。这通常涉及到在拦截器中跟踪请求频率，并根据策略拒绝过多的请求。

8. Circuit Breaker Pattern
   实现断路器模式，以防止系统在遇到故障时完全崩溃。可以使用流行的库，如 Hystrix、go-resiliency 等，配合拦截器使用。

9. Middleware
   虽然 gRPC 的拦截器是中间件的形式，但可以结合使用其他中间件（如日志记录、中间件框架等）来增强应用程序的功能。

10. Metadata
   gRPC 支持在请求中附加元数据（metadata），可以用于传递额外的信息，例如用户 ID、请求标识符等。元数据可以在拦截器中访问并用于认证或审计。

```go
md := metadata.Pairs("key", "value")
grpc.SendHeader(ctx, md)
```
11. Health Checking
   gRPC 提供内置的健康检查服务（Health Checking），允许客户端查询服务的可用性。这对于微服务架构中的服务发现和故障转移非常有用。

12. Tracing and Monitoring
    可以集成分布式追踪系统（如 OpenTracing、Jaeger、Zipkin）来监控 gRPC 调用的性能，并进行故障排查。



###  Credentials 和 Interceptor 联合使用  示例

> 服务端代码
```go
package main

import (
	"context"
	"fmt"
	"net"
	"strings"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

func validateToken(token string) error {
	// 验证 token 的逻辑
	if token == "valid_token" {
		return nil
	}
	return fmt.Errorf("invalid token")
}

func authInterceptor(
	ctx context.Context,
	req interface{},
	info *grpc.UnaryServerInfo,
	handler grpc.UnaryHandler,
) (interface{}, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, status.Error(codes.Unauthenticated, "missing metadata")
	}

	token := md["authorization"]
	if len(token) == 0 {
		return nil, status.Error(codes.Unauthenticated, "missing authorization token")
	}

	if err := validateToken(strings.TrimPrefix(token[0], "Bearer ")); err != nil {
		return nil, status.Error(codes.Unauthenticated, fmt.Sprintf("invalid token: %v", err))
	}

	return handler(ctx, req)
}

func main() {
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		panic(err)
	}

	s := grpc.NewServer(grpc.UnaryInterceptor(authInterceptor))
	// 注册你的服务

	if err := s.Serve(lis); err != nil {
		panic(err)
	}
}

```


> 客户端代码
```go
package main

import (
	"context"
	"fmt"
	"google.golang.org/grpc"
	"google.golang.org/grpc/metadata"
)

type tokenCredentials struct {
	token string
}

func (c *tokenCredentials) GetRequestMetadata(ctx context.Context, uri ...string) (map[string]string, error) {
	return map[string]string{"authorization": "Bearer " + c.token}, nil
}

func (c *tokenCredentials) RequireTransportSecurity() bool {
	return true // 如果使用 TLS，则返回 true
}

func main() {
	conn, err := grpc.Dial("localhost:50051", grpc.WithInsecure(), grpc.WithPerRPCCredentials(&tokenCredentials{token: "your_access_token"}))
	if err != nil {
		panic(err)
	}
	defer conn.Close()

	// 创建你的 gRPC 客户端并调用方法
}

```
