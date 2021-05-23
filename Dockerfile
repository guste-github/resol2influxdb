FROM node:10
WORKDIR /src
RUN chown node:node /src
RUN usermod -a -G dialout node
USER node
COPY ./src/package.json ./src/package-lock.json /src/
RUN npm i
COPY ./src/config.js ./src/index.js /src/
COPY ./entrypoint.sh /
ENTRYPOINT ["/bin/bash", "/entrypoint.sh"]
CMD ["node", "/src/index.js"]
