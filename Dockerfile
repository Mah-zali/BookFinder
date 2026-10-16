# BookFinder - Etapa 02
FROM nginx:alpine

COPY index.html style.css script.js ramo-bookfinder.png /usr/share/nginx/html/

# Verifica se o servidor Nginx está respondendo
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q --spider http://127.0.0.1/ || exit 1

EXPOSE 80