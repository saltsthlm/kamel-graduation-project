brew update
brew upgrade yarn
brew upgrade node
docker pull mongo

cd backend
yarn install
cd ..

cd client
yarn install
cd ..

