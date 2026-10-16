# BookFinder - Etapa 02
FROM nginx:alpine

# Copia os arquivos necessários para o servidor
COPY index.html style.css script.js ramo-bookfinder.png /usr/share/nginx/html/

EXPOSE 80