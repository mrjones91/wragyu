# wRAGyu v5
## RAG API app

## Quickstart

### Install Ollama 
Go to [Ollama.com](https://ollama.com) and install for your OS.

```bash
ollama pull nomic-embed-text
```

```bash
ollama pull llama3.2
```

##### NOTE: if you experience severe performance issues with the app, run the following commands to use Llama 3.2:1B

```bash
ollama remove llama3.2
ollama pull llama3.2:1B
```

### Start the App

Get the .env values from an instructor and run the app via:

```bash
npm install
```

```bash
npm run start
```

## Additional Docs
Docs for the EmbedJS library are available @ https://llm-tools.mintlify.app/components/data-sources/overview

The code is commented to aid in understanding, but don't hesitate to ask questions!

















### TODO

JS app listening for endpoint connections
Will optomize for load later
Going to dockerize and have API listen for POST calls that will be input to the RAG app and output

POST

{
    id: 'username - will become an authenticated username',
    query: 'query text to be asked of bot',
    sources: [{ 'type': 'address'}] : sources will be sent in an array of key: value pairs. key can be 'pdf', 'web', 'etc'. value can be a web link to find the resource or the raw text of the resource.
}

### To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.34. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
