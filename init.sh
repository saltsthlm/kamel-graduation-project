rm -f ./init_errors.log
touch ./init_errors.log

brew update 2>>init_errors.log

brew install node 2>>init_errors.log
brew upgrade node 2>>init_errors.log

brew install yarn 2>>init_errors.log
brew upgrade yarn 2>>init_errors.log

brew install kompose 2>>init_errors.log
brew upgrade kompose 2>>init_errors.log

brew install minikube 2>>init_errors.log
brew upgrade minikube 2>>init_errors.log

brew install docker 2>>init_errors.log
brew upgrade docker 2>>init_errors.log
brew link docker 2>>init_errors.log

docker pull mongo 2>>init_errors.log

gcloud components install kubectl 2>>init_errors.log

cd backend
yarn install
cd ..

cd client
yarn install
cd ..
