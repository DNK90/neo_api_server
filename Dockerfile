FROM ubuntu:17.10

# Install dependencies
RUN apt-get update && apt-get install -y curl && \
    curl --silent --location https://deb.nodesource.com/setup_9.x | bash - && \
    apt-get install -y \
    wget \
    git-core \
    python3.6 \
    python3.6-dev \
    python3.6-venv \
    python3-pip \
    nodejs \
    build-essential \
    libleveldb-dev \
    libssl-dev \
    vim \
    man

# APT cleanup to reduce image size
RUN rm -rf /var/lib/apt/lists/*

# Branch can be overwritten with --build-arg, eg: `--build-arg branch=development`
ARG branch=master

# Clone and setup
RUN git clone https://github.com/DNK90/neo_api_server.git
WORKDIR neo_api_server
RUN git checkout $branch
CMD git pull && pip3 install -r requirements.txt && cd node && npm install && cd .. && PYTHONPATH='.' python3 src/api.py --config=src/data/protocol.privnet.docker.json --port-rpc=5000 --port-rest=8080 --logfile=log.txt
# Example run command
#CMD PYTHONPATH='.' python3 src/api.py --config="src/data/protocol.privnet.docker.json" --port-rpc=5000 --port-rest=8080 --logfile=$log
