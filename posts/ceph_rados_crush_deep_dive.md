<!-- category: 스토리지 -->
<!-- date: 2025-06-02 -->
<!-- keywords: Ceph, RADOS, CRUSH, 스토리지, 분산시스템, 데이터 배치, 클러스터, OSD, CRUSH Map, CRUSH Rule, Storage, Distributed System, Data Placement, Cluster -->
<!-- title: Ceph 심층 분석: RADOS 개념과 CRUSH Rule 완전 정복 -->

Ceph는 현대적인 분산 스토리지 시스템으로, 뛰어난 확장성과 안정성을 제공하여 많은 기업 및 조직에서 주목받고 있습니다. Ceph의 핵심에는 RADOS라는 강력한 객체 스토리지와 데이터 배치를 결정하는 CRUSH 알고리즘이 자리 잡고 있습니다. 본 문서에서는 Ceph의 심장부라 할 수 있는 RADOS의 개념과 CRUSH Rule에 대해 상세히 알아보겠습니다.

**English Summary**: This document provides an in-depth analysis of Ceph's core components: RADOS (Reliable Autonomic Distributed Object Store) and the CRUSH (Controlled Replication Under Scalable Hashing) algorithm. It covers their fundamental concepts, key features, and how they work together to deliver a scalable and reliable distributed storage solution.

## 1. RADOS (Reliable Autonomic Distributed Object Store) 란?

RADOS는 Ceph 스토리지 클러스터의 기반이 되는 핵심 구성 요소입니다. 이름에서 알 수 있듯이, 신뢰할 수 있고(Reliable), 자율적이며(Autonomic), 분산된(Distributed) 객체 저장소(Object Store)입니다.

### 주요 특징 및 구성 요소:

*   **객체 기반 스토리지**: RADOS는 모든 데이터를 객체(Object) 형태로 저장합니다. 파일 시스템의 파일이나 블록 장치의 블록과 달리, 객체는 데이터와 메타데이터를 함께 포함하는 유연한 단위입니다.
*   **분산 및 확장성**: 데이터는 클러스터 내 여러 OSD(Object Storage Daemon)에 분산되어 저장됩니다. OSD는 실제 물리적 저장 장치(HDD, SSD 등)를 관리하는 데몬입니다. 새로운 OSD를 추가하면 클러스터의 용량과 성능이 선형적으로 확장될 수 있습니다.
*   **고가용성 및 데이터 안정성**: 데이터는 복제(Replication) 또는 이레이저 코딩(Erasure Coding)을 통해 여러 OSD에 중복 저장되어 장애 발생 시에도 데이터 유실을 방지하고 서비스 연속성을 보장합니다.
*   **자율적인 관리**: RADOS는 OSD의 상태를 지속적으로 모니터링하고, 장애 발생 시 자동으로 데이터를 복구하고 재배치(Rebalancing)하는 기능을 수행합니다. 이를 통해 관리 부담을 크게 줄여줍니다.
*   **핵심 구성 요소**:
    *   **OSD (Object Storage Daemon)**: 실제 데이터를 저장하고, 데이터 복제, 복구, 재배치 등의 작업을 수행합니다.
    *   **MON (Monitor)**: 클러스터 맵(Cluster Map)의 마스터 복사본을 유지하며, 클러스터의 전반적인 상태를 관리하고 OSD 간의 합의를 중재합니다. 고가용성을 위해 일반적으로 3개 이상의 홀수 개수로 구성됩니다.
    *   **MGR (Manager)**: 클러스터의 상태 정보(사용량, 성능, 시스템 부하 등)를 추적하고, Ceph Dashboard와 같은 관리 인터페이스를 제공합니다.
    *   **MDS (Metadata Server)**: CephFS (Ceph File System)를 사용할 경우 파일 시스템의 메타데이터를 저장하고 관리합니다.

### RADOS 접근 인터페이스:

Ceph는 RADOS 위에 다양한 인터페이스를 제공하여 여러 방식으로 스토리지에 접근할 수 있도록 합니다.

*   **librados**: C, C++, Java, Python, PHP 등 다양한 프로그래밍 언어에서 RADOS 클러스터에 직접 접근할 수 있도록 하는 라이브러리입니다. RBD, RGW, CephFS의 기반이 됩니다.
*   **RADOS Gateway (RGW)**: Amazon S3 및 OpenStack Swift와 호환되는 RESTful API를 제공하는 객체 스토리지 게이트웨이입니다.
*   **RBD (RADOS Block Device)**: 스냅샷, 씬 프로비저닝 등의 기능을 제공하는 블록 스토리지 서비스입니다. 가상 머신의 디스크 이미지 등으로 활용됩니다.
*   **CephFS (Ceph File System)**: POSIX 호환 분산 파일 시스템입니다.

## 2. CRUSH (Controlled Replication Under Scalable Hashing) 알고리즘

CRUSH는 Ceph에서 데이터의 위치를 결정하는 핵심 알고리즘입니다. 기존의 중앙 집중식 메타데이터 서버에 의존하지 않고, 클라이언트가 직접 데이터가 저장될 OSD를 계산할 수 있도록 합니다. 이는 Ceph의 확장성과 성능에 크게 기여합니다.

### 주요 개념:

*   **CRUSH Map**: 클러스터의 물리적인 토폴로지(랙, 호스트, OSD 등)와 데이터 배치 정책을 정의하는 맵입니다. CRUSH 알고리즘은 이 맵을 기반으로 데이터의 위치를 결정합니다.
*   **Bucket**: CRUSH Map 내에서 OSD를 그룹화하는 논리적인 단위입니다. `host`, `rack`, `row`, `datacenter` 등 다양한 유형의 버킷을 정의하여 물리적인 장애 도메인(Failure Domain)이나 성능 도메인(Performance Domain)을 설정할 수 있습니다.
*   **CRUSH Rule**: 특정 풀(Pool)의 데이터가 어떻게 저장될지를 정의하는 규칙입니다. 예를 들어, "데이터 복제본 3개를 서로 다른 랙에 있는 OSD에 저장하라"와 같은 규칙을 설정할 수 있습니다.
*   **Placement Group (PG)**: OSD 내에서 객체를 그룹화하는 단위입니다. 객체는 먼저 PG에 매핑되고, PG는 CRUSH Rule에 따라 OSD에 매핑됩니다. PG는 데이터 관리의 효율성을 높이고, OSD 장애 시 데이터 이동 단위를 줄여줍니다.

### CRUSH 알고리즘의 작동 방식:

1.  클라이언트가 특정 객체에 대한 작업을 요청하면, 객체 ID와 풀 ID를 기반으로 해당 객체가 속한 PG를 계산합니다.
2.  계산된 PG ID와 CRUSH Map의 CRUSH Rule을 사용하여 해당 PG가 저장될 OSD들의 목록을 결정합니다. 이 과정에서 CRUSH 알고리즘은 장애 도메인, OSD 가중치(용량 등) 등을 고려하여 데이터를 균등하게 분산시키려고 시도합니다.
3.  클라이언트는 계산된 OSD 목록 중 Primary OSD에 직접 접근하여 데이터 작업을 수행합니다.

### CRUSH Rule의 중요성:

CRUSH Rule은 데이터의 안정성, 가용성, 성능에 직접적인 영향을 미칩니다. 관리자는 클러스터의 물리적 환경과 요구 사항에 맞춰 CRUSH Rule을 신중하게 설계해야 합니다.

*   **장애 도메인 (Failure Domain)**: CRUSH Rule을 통해 데이터 복제본이 서로 다른 장애 도메인(예: 다른 서버, 다른 랙)에 저장되도록 강제할 수 있습니다. 이를 통해 특정 서버나 랙 전체에 장애가 발생하더라도 데이터 유실 없이 서비스를 지속할 수 있습니다.
*   **성능 도메인 (Performance Domain)**: SSD와 HDD를 혼용하는 경우, CRUSH Rule을 사용하여 특정 유형의 데이터(예: 고성능이 요구되는 메타데이터)를 SSD OSD에만 저장하도록 설정할 수 있습니다.
*   **가중치 (Weight)**: OSD의 용량이나 성능에 따라 가중치를 설정하여 데이터가 균형 있게 분산되도록 유도할 수 있습니다.

## 3. RADOS와 CRUSH Rule의 관계

RADOS는 데이터를 객체 형태로 저장하고 관리하는 시스템이며, CRUSH는 이 객체들이 클러스터 내의 어떤 OSD에 저장될지를 결정하는 알고리즘입니다.

*   클라이언트가 데이터를 저장하거나 읽으려고 할 때, CRUSH 알고리즘이 작동하여 대상 OSD를 결정합니다.
*   RADOS는 CRUSH에 의해 결정된 OSD들과 통신하여 실제 데이터 I/O 작업을 수행합니다.
*   OSD 장애 발생 시, MON은 클러스터 맵을 업데이트하고, CRUSH는 새로운 데이터 배치 계획을 계산합니다.
*   RADOS는 이 새로운 계획에 따라 데이터를 자동으로 복구하고 재배치합니다.

이처럼 RADOS와 CRUSH는 긴밀하게 협력하여 Ceph 스토리지의 핵심 기능인 데이터 저장, 관리, 분산, 고가용성 등을 제공합니다.

## 결론

Ceph의 RADOS와 CRUSH 알고리즘은 분산 스토리지 시스템의 복잡성을 효과적으로 관리하고, 뛰어난 확장성과 안정성을 제공하는 핵심 기술입니다. RADOS는 지능적인 객체 스토리지 백엔드를 제공하며, CRUSH는 데이터 배치에 대한 유연하고 강력한 제어 기능을 제공합니다. 이러한 구성 요소에 대한 깊이 있는 이해는 Ceph 클러스터를 효과적으로 설계, 구축 및 운영하는 데 필수적입니다.

앞으로 Ceph를 활용하여 대규모 데이터를 안정적으로 관리하고자 하는 모든 분들에게 본 문서가 도움이 되기를 바랍니다.