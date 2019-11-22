FROM nginx:1.17.6-alpine
COPY ./build /var/www
EXPOSE 80
CMD ["nginx","-g","daemon off;"]