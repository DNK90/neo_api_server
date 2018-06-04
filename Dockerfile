FROM ubuntu:17.10

# Install dependencies
RUN apt-get update && apt-get install -y \
    wget \
    git-core \
    python3.6 \
    python3.6-dev \
    python3.6-venv \
    python3-pip \
    libleveldb-dev \
    libssl-dev \
    vim \
    man

# APT cleanup to reduce image size
RUN rm -rf /var/lib/apt/lists/*

# Branch can be overwritten with --build-arg, eg: `--build-arg branch=development`
ARG branch=master
ARG rpc=5000
ARG rest=8080
ARG log=log.txt

# Clone and setup
RUN git clone https://github.com/DNK90/neo_api_server.git
WORKDIR neo_api_server
RUN git checkout $branch

# Install the dependencies
RUN pip3 install -r requirements.txt

# Example run command
CMD python3 src/api.py --privnet --port-rpc=$rpc --port-rest=$rest --logfile=$log
