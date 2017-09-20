FROM mhart/alpine-node:8

RUN mkdir -p /moolah

WORKDIR /moolah

ADD package.json /tmp/

RUN cd /tmp/ \
	&& npm install --no-color --no-optional \
	&& cp -a /tmp/node_modules /moolah \
	&& rm -rf *

COPY . /moolah

RUN npm run build
