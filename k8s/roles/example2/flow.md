## Start minikube

```bash
minikube start --extra-config=apiserver.authorization-mode=RBAC
minikube addons enable dashboard
```

## Create namespace

```bash
kubectl create namespace development
kubectl create namespace production
```

## Create Role

Copy from _roles.yaml_ and **kubectl apply -f roles.yaml**

## Create Service Accounts

```bash
kubectl create serviceaccount viewer-sa -n development
kubectl create serviceaccount developer-sa -n development
kubectl create serviceaccount admin-sa -n default
```

## Create RoleBindings

Copy from _rolebindings.yaml_ and **kubectl apply -f rolebindings.yaml**

## Create token

```bash
kubectl create token viewer-sa -n development > viewer-token.txt
kubectl create token developer-sa -n development > developer-token.txt
kubectl create token admin-sa -n default > admin-token.txt
```

## Config for each role

### Example with viewer

```bash
kubectl config view --raw > kubeconfig-viewer.yaml
```

Edit file

```yaml
#...
contexts:
  - context:
      cluster: minikube
      extensions:
        - extension:
            last-update: Tue, 02 Jul 2024 12:30:00 +07
            provider: minikube.sigs.k8s.io
            version: v1.32.0
          name: context_info
      namespace: development
      user: viewer
    name: viewer@minikube
#...
current-context: viewer@minikube
#...
users:
  - name: viewer
    user:
      token: <paste-viewer-token-here>
```

## Check

```bash
kubectl --kubeconfig=kubeconfig-viewer.yaml get pods -n development
kubectl --kubeconfig=kubeconfig-developer.yaml create deployment nginx --image=nginx -n development
kubectl --kubeconfig=kubeconfig-admin.yaml get pods --all-namespaces
```

## Dashboard

```bash
minikube dashboard
```

Provide token
