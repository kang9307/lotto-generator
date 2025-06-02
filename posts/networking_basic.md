<!-- category: 네트워크 -->
<!-- date: 2025-06-01 -->
<!-- featured: true -->
<!-- keywords: TCP/IP, 네트워킹, 네트워크 기초, IP주소, 서브넷, 포트번호, networking, subnet, IP address, port number -->
<!-- title: TCP/IP 네트워크 기초 (TCP/IP Networking Basics) -->

네트워크는 현대 컴퓨팅 환경의 핵심입니다. 이 글에서는 TCP/IP 네트워크의 기본 개념과 작동 원리에 대해 알아봅니다.

**English**: Networking is the core of modern computing environments. This article explores the basic concepts and operating principles of TCP/IP networks.

## TCP/IP 프로토콜 스택 (TCP/IP Protocol Stack)

TCP/IP 프로토콜 스택은 4개의 계층으로 구성됩니다:

**English**: The TCP/IP protocol stack consists of 4 layers:

1. **애플리케이션 계층 (Application Layer)**: HTTP, FTP, DNS, SMTP 등
2. **전송 계층 (Transport Layer)**: TCP, UDP
3. **인터넷 계층 (Internet Layer)**: IP, ICMP, ARP
4. **네트워크 인터페이스 계층 (Network Interface Layer)**: 이더넷, Wi-Fi 등

## IP 주소 (IP Address)

IP 주소는 네트워크 상의 장치를 식별하는 고유한 주소입니다.

**English**: An IP address is a unique address that identifies a device on a network.

### IPv4 (Internet Protocol version 4)

IPv4 주소는 32비트로 구성되며, 일반적으로 점으로 구분된 4개의 숫자로 표현됩니다.

**English**: IPv4 addresses are 32-bit and typically represented as four numbers separated by dots.

```
192.168.1.1
```

### IPv6 (Internet Protocol version 6)

IPv6 주소는 128비트로 구성되며, 콜론으로 구분된 8개의 16진수 그룹으로 표현됩니다.

**English**: IPv6 addresses are 128-bit and represented as eight groups of hexadecimal digits separated by colons.

```
2001:0db8:85a3:0000:0000:8a2e:0370:7334
```

## 서브넷 마스크 (Subnet Mask)

서브넷 마스크는 IP 주소에서 네트워크 부분과 호스트 부분을 구분하는 데 사용됩니다.

**English**: A subnet mask is used to distinguish the network portion from the host portion in an IP address.

```
IP 주소 (IP Address): 192.168.1.10
서브넷 마스크 (Subnet Mask): 255.255.255.0
네트워크 주소 (Network Address): 192.168.1.0
```

## 포트 번호 (Port Numbers)

포트 번호는 특정 프로세스를 식별하는 데 사용됩니다. 잘 알려진 포트 번호는 다음과 같습니다:

**English**: Port numbers are used to identify specific processes. Well-known port numbers include:

- HTTP: 80
- HTTPS: 443
- FTP: 21
- SSH: 22
- SMTP: 25
- DNS: 53

## 네트워크 명령어 (Network Commands)

네트워크 문제를 진단하는 데 유용한 명령어는 다음과 같습니다:

**English**: Useful commands for diagnosing network problems include:

```bash
# 호스트에 연결 테스트 (Test connection to a host)
ping google.com

# 네트워크 경로 추적 (Trace network path)
traceroute google.com

# 네트워크 인터페이스 정보 표시 (Display network interface information)
ifconfig    # Unix/Linux
ipconfig    # Windows

# DNS 조회 (DNS lookup)
nslookup google.com
```

네트워크의 기본 개념을 이해하면 다양한 네트워크 문제를 더 효과적으로 해결할 수 있습니다.

**English**: Understanding the basic concepts of networking allows you to solve various network problems more effectively. 