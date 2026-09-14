# C4 Level 4 — Deployment Diagram

## 1. Overview

The **Deployment Diagram** maps the runtime software containers to physical and virtual hardware infrastructure, network ingress boundaries, and client devices deployed across the primary school campus.

---

## 2. Infrastructure Deployment Diagram (C4Deployment)

```mermaid
C4Deployment
  title Deployment Diagram - Primary School Semi-Boarding Meal Management System

  Deployment_Node(clientNodes, "Campus End-User Devices", "Physical Hardware") {
    Deployment_Node(mobileDevice, "Teacher Smartphone", "Apple iOS / Android") {
      Container(teacherBrowser, "Teacher Mobile Web", "Mobile Safari / Chrome", "Responsive mobile-first web app, single-hand tap interactions")
    }

    Deployment_Node(desktopWorkstation, "Nutritionist Workstation", "Windows 11 / macOS") {
      Container(managerBrowser, "Manager Analytical Web", "Desktop Chrome / Edge", "Data-dense analytical dashboard, multi-column portion tables")
    }

    Deployment_Node(kioskDevice, "Kitchen Touch Kiosk", "Industrial Android Tablet / All-in-One") {
      Container(kioskApp, "Kitchen Kiosk Touch Web", "Dedicated Fullscreen Kiosk Browser", "Water/grease-resistant touchscreen, large touch targets")
    }
  }

  Deployment_Node(serverEnvironment, "Application Server Cluster", "Linux / Containerized Environment") {
    Deployment_Node(ingressNode, "Edge Ingress & Reverse Proxy", "Nginx Server") {
      Container(ingress, "TLS Reverse Proxy", "Nginx", "Terminates HTTPS (443) & WSS, enforces rate limiting, routes traffic")
    }

    Deployment_Node(appServer, "Compute Node (App Server)", "Ubuntu 22.04 LTS") {
      Container(spaContainer, "Static Web Server", "Nginx Static Container", "Serves minified HTML5, CSS3, and ES6 JavaScript bundles")
      Container(apiContainer, "Backend API Service", "Node.js / Express Runtime", "Executes REST API logic, RBAC checks, portion calculations")
      Container(wsContainer, "Real-time Event Server", "WebSocket Server", "Maintains long-lived WebSocket connections with clients")
    }

    Deployment_Node(dataServer, "Database & Storage Tier", "Managed Database Node") {
      ContainerDb(postgresDb, "Relational Database", "PostgreSQL 15 Cluster", "Stores primary entities, B-Tree indexes, and immutable audit logs")
      ContainerDb(storageService, "Compliance Asset Storage", "MinIO / Encrypted Storage", "Houses 24-hour food retention sample photos and scale receipts")
    }
  }

  %% Network connections
  Rel(teacherBrowser, ingress, "Transmits morning attendance records", "HTTPS/443")
  Rel(managerBrowser, ingress, "Submits demand approvals and recipe tweaks", "HTTPS/443")
  Rel(kioskApp, ingress, "Transmits cooking batch milestones and scale readings", "HTTPS/443 & WSS")

  Rel(ingress, spaContainer, "Proxies static asset requests", "HTTP/80")
  Rel(ingress, apiContainer, "Proxies authenticated API requests", "HTTP/Internal")
  Rel(ingress, wsContainer, "Proxies WebSocket upgrade handshakes", "WebSocket/Internal")

  Rel(apiContainer, wsContainer, "Dispatches internal business events", "TCP / Internal IPC")
  Rel(apiContainer, postgresDb, "Executes transactional queries", "SQL / Port 5432")
  Rel(apiContainer, storageService, "Uploads and retrieves compliance photos", "S3 API / Internal")
```

---

## 3. Infrastructure & Node Specifications

### 3.1. Client Device Requirements
1. **Teacher Mobile Devices:**
   - Runs standard mobile browsers (Safari on iOS 15+, Google Chrome on Android 10+).
   - Utilizes lightweight client-side caching to maintain responsiveness even if school Wi-Fi experiences intermittent degradation.
2. **Kitchen Wall-Mount Kiosk:**
   - Industrial 15.6"+ touchscreen tablet with an IP54-rated enclosure protecting against steam, humidity, and grease.
   - Operates in locked fullscreen kiosk mode to prevent accidental application exits.

### 3.2. Server Compute & Ingress Architecture
- **Nginx Ingress Proxy:**
  - Automated SSL/TLS termination using modern TLS 1.3 cipher suites.
  - Granular rate limiting configured to prevent request surges during the peak 07:45 - 08:15 AM window.
- **Node.js API Runtime:**
  - Deployed in lightweight Docker containers with automated health checks (`/healthz`).
  - Stateless architecture allowing horizontal scaling if the system expands to multiple school campuses.
- **PostgreSQL 15 Database Cluster:**
  - Connection pooling managed via internal poolers (e.g., PgBouncer or native node-postgres connection pool).
  - Configured with daily automated snapshot backups and 30-day Point-In-Time Recovery (PITR) retention.
