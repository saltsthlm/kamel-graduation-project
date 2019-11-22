brew update
brew upgrade yarn
brew upgrade node
brew install kompose
brew install minikube
docker pull mongo

gcloud components install kubectl

cd backend
yarn install
cd ..

cd client
yarn install
cd ..

