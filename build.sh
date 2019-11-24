cd client
yarn build
cd ..

gcloud config set project my-project-1574063061768
gcloud config set compute/zone europe-west3-a
gcloud builds submit --config cloudbuild.yml .