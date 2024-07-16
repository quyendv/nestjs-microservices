# Example 1: Development & Production

## Đảm bảo Minikube đang chạy

```bash
  minikube start
```

## Tạo namespaces

```bash
  kubectl create namespace development
  kubectl create namespace production
```

## Tạo Role & RoleBinding

```yaml
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: development
  name: viewer-role
rules:
  - apiGroups: ['']
    resources: ['pods', 'services', 'configmaps']
    verbs: ['get', 'list', 'watch']
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: development
  name: developer-role
rules:
  - apiGroups: ['']
    resources: ['pods', 'services', 'configmaps']
    verbs: ['get', 'list', 'watch', 'create', 'update', 'patch', 'delete']
  - apiGroups: ['apps']
    resources: ['deployments']
    verbs: ['get', 'list', 'watch', 'create', 'update', 'patch', 'delete']
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: production
  name: admin-role
rules:
  - apiGroups: ['*']
    resources: ['*']
    verbs: ['*']
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: viewer-rolebinding
  namespace: development
subjects:
  - kind: User
    name: viewer
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: viewer-role
  apiGroup: rbac.authorization.k8s.io
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: developer-rolebinding
  namespace: development
subjects:
  - kind: User
    name: developer
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: developer-role
  apiGroup: rbac.authorization.k8s.io
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: admin-rolebinding
  namespace: production
subjects:
  - kind: User
    name: admin
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: admin-role
  apiGroup: rbac.authorization.k8s.io
```

```bash
  kubectl apply -f roles-and-bindings.yaml
```

## Tạo các users

Trong môi trường thực tế, sẽ sử dụng một hệ thống quản lý người dùng. Tuy nhiên, với Minikube, chúng ta có thể mô phỏng bằng cách tạo các client certificates.

```bash
# Tạo private key cho mỗi user (.key files)
openssl genrsa -out viewer.key 2048
openssl genrsa -out developer.key 2048
openssl genrsa -out admin.key 2048

# Tạo certificate signing request (CSR - .csr files)
openssl req -new -key viewer.key -out viewer.csr -subj "/CN=viewer/O=viewer"
openssl req -new -key developer.key -out developer.csr -subj "/CN=developer/O=developer"
openssl req -new -key admin.key -out admin.csr -subj "/CN=admin/O=admin"

# IMPORTANT: copy to minikube container (mount)
minikube cp ./viewer.csr minikube:/home/docker/
minikube cp ./developer.csr minikube:/home/docker/
minikube cp ./admin.csr minikube:/home/docker/

# Ký (Sign) các CSR bằng Minikube CA
minikube ssh
sudo openssl x509 -req -in /home/docker/viewer.csr -CA /var/lib/minikube/certs/ca.crt -CAkey /var/lib/minikube/certs/ca.key -CAcreateserial -out viewer.crt -days 500
sudo openssl x509 -req -in /home/docker/developer.csr -CA /var/lib/minikube/certs/ca.crt -CAkey /var/lib/minikube/certs/ca.key -CAcreateserial -out developer.crt -days 500
sudo openssl x509 -req -in /home/docker/admin.csr -CA /var/lib/minikube/certs/ca.crt -CAkey /var/lib/minikube/certs/ca.key -CAcreateserial -out admin.crt -days 500

# Copy các certificate từ Minikube
minikube cp minikube:/home/docker/viewer.crt ./
minikube cp minikube:/home/docker/developer.crt ./
minikube cp minikube:/home/docker/admin.crt ./
```

Trong đó

```bash
openssl genrsa -out viewer.key 2048
```

- Lệnh này tạo một private key RSA:

  - openssl: Công cụ dòng lệnh để làm việc với OpenSSL.

  - genrsa: Subcommand để tạo một RSA private key.
    -out viewer.key: Chỉ định tên file output cho private key.

  - 2048: Độ dài của key (số bit). 2048 là độ dài phổ biến, cung cấp sự cân bằng tốt giữa bảo mật và hiệu suất.

```bash
openssl req -new -key viewer.key -out viewer.csr -subj "/CN=viewer/O=viewer"
```

- Lệnh này tạo một Certificate Signing Request (CSR):
  - req: Subcommand để xử lý PKCS#10 certificate requests.
  - -new: Tạo một CSR mới.
  - -key viewer.key: Sử dụng private key đã tạo ở bước trước.
  - -out viewer.csr: Chỉ định tên file output cho CSR.
  - -subj "/CN=viewer/O=viewer": Đặt subject của certificate.
    - **CN=viewer**: Common Name là "viewer".
    - **O=viewer**: Organization là "viewer".

```bash
sudo openssl x509 -req -in /home/docker/viewer.csr -CA /var/lib/minikube/certs/ca.crt -CAkey /var/lib/minikube/certs/ca.key -CAcreateserial -out viewer.crt -days 500
```

- Lệnh này ký CSR để tạo ra một certificate:

  - x509: Subcommand để làm việc với certificates.
  - -req: Chỉ định rằng input là một CSR.
  - -in /home/docker/viewer.csr: Đường dẫn đến file CSR.
  - -CA /var/lib/minikube/certs/ca.crt: Đường dẫn đến certificate của CA (Certificate Authority).
  - -CAkey /var/lib/minikube/certs/ca.key: Đường dẫn đến private key của CA.
  - -CAcreateserial: Tạo một serial number cho certificate nếu chưa tồn tại.
  - -out viewer.crt: Chỉ định tên file output cho certificate đã ký.
  - -days 500: Thời hạn hiệu lực của certificate (500 ngày).

Có thể làm theo [cách khác](https://docs.bizflycloud.vn/kubernetes_engine/howtos/custom-authentication-authorization-rbac/) tạo resource **CertificateSigningRequest** file hoặc sử dụng [service account](https://devopsvn.tech/kubernetes/tips/tao-va-phan-quyen-nguoi-dung-tren-kubernetes)

## Cấu hình kubectl cho mỗi user

```bash
# Set credentials
kubectl config set-credentials viewer --client-certificate=./viewer.crt --client-key=./viewer.key
kubectl config set-credentials developer --client-certificate=./developer.crt --client-key=./developer.key
kubectl config set-credentials admin --client-certificate=./admin.crt --client-key=./admin.key

# Set context
kubectl config set-context viewer-context --cluster=minikube --user=viewer
kubectl config set-context developer-context --cluster=minikube --user=developer
kubectl config set-context admin-context --cluster=minikube --user=admin
```

Có thể switch current context bằng lệnh

```bash
kubectl config set-context $(kubectl config current-context) --user=developer
```

## Kiểm tra quyền truy cập

```bash
# Kiểm tra quyền của viewer
kubectl --context=viewer-context auth can-i list pods --namespace development
kubectl --context=viewer-context auth can-i create pods --namespace development

# Kiểm tra quyền của developer
kubectl --context=developer-context auth can-i list pods --namespace development
kubectl --context=developer-context auth can-i create pods --namespace development

# Kiểm tra quyền của admin
kubectl --context=admin-context auth can-i list pods --namespace production
kubectl --context=admin-context auth can-i create pods --namespace production
```

Có thể test với ứng dụng

```yaml
# demo-app.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: development
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:1.14.2
          ports:
            - containerPort: 80
```

```bash
kubectl apply -f demo-app.yaml
```

```bash
# Viewer có thể xem pods nhưng không thể tạo hoặc xóa
kubectl --context=viewer-context get pods -n development
kubectl --context=viewer-context delete pod <pod-name> -n development

# Developer có thể xem, tạo và xóa pods trong namespace development
kubectl --context=developer-context get pods -n development
kubectl --context=developer-context delete pod <pod-name> -n development

# Admin có toàn quyền trong namespace production
kubectl --context=admin-context get pods -n production
kubectl --context=admin-context create deployment test --image=nginx -n production
```
