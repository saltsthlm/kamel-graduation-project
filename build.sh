# cd client
# yarn build

# cd ..
# # docker-compose  up --build

# kompose convert
# kubectl apply -f backend-deployment.yaml, database-claim0-persistentvolumeclaim.yaml, database-deployment.yaml, frontend-claim0-persistentvolumeclaim.yaml, frontend-deployment.yaml, frontend-service.yaml
# minikube service frontend

gcloud config set project my-project-1574063061768
gcloud config set compute/zone europe-west3-a
gcloud config set container/cluster kamel
# gcloud container clusters get-credentials kamel
# kubectl create deployment kamel-server --image=