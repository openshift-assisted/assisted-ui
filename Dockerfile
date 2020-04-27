FROM nginx:1.17

COPY build/ /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf