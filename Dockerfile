# use ollama docker image as base
FROM ollama/ollama

WORKDIR /app
COPY . /app/
# pull llama3.2
# install bun
RUN ollama
RUN ollama pull llama3.2
RUN curl -fsSL https://bun.sh/install | bash
RUN bun /app/index.ts