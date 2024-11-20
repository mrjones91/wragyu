import { JsonLoader, RAGApplicationBuilder } from '@llm-tools/embedjs';
import { Ollama, OllamaEmbeddings } from '@llm-tools/embedjs-ollama';
import { WebLoader } from '@llm-tools/embedjs-loader-web';
import { PdfLoader } from '@llm-tools/embedjs-loader-pdf';
import { CsvLoader } from '@llm-tools/embedjs-loader-csv';
import { MongoDb } from '@llm-tools/embedjs-mongodb';

import express, { Request, Response} from "express";

import { MongoClient } from 'mongodb';

import dotenv from 'dotenv';

dotenv.config();

const dbuser = process.env.dbUsername;
const dbpwd = process.env.dbPwd;
const dbconn = process.env.dbConnection || "";

// console.log(`debug\n${dbuser}\n${dbpwd}\n${dbconn}`);

const app = express();
const port = 3000;

app.use(express.json());

/*
if 
GET
docker Deploy api/tags
.length == 0

POST 
docker Deploy /api/pull
{
  "model": "llama3.2"
}'

docker Deploy /api/pull
{
  "model": "nomic-embed-text"
}'

*/

const ragApplication = await new RAGApplicationBuilder()
.setModel(new Ollama({ modelName: "llama3.2", baseUrl: 'https://llama.delightfulwater-6fda5743.centralus.azurecontainerapps.io/' }))
.setEmbeddingModel(new OllamaEmbeddings({ model: 'nomic-embed-text', baseUrl: 'https://llama.delightfulwater-6fda5743.centralus.azurecontainerapps.io/' }))
.setVectorDatabase(new MongoDb({
    connectionString: `mongodb+srv://${dbuser}:${dbpwd}@cluster0.zep0qmk.mongodb.net/BlightBounties`,
}))
.build();



const Loaders = { 
    'pdf': [PdfLoader, 'filePathOrUrl'],
    'web': [WebLoader, 'urlOrContent'],
    'csv': [CsvLoader, 'filePathOrUrl']
}
const contentName = {

}
// let pdf = await ragApplication.addLoader(new PdfLoader({ filePathOrUrl: 'https://bitcoin.org/bitcoin.pdf' }))
// let web = await ragApplication.addLoader(new WebLoader({ urlOrContent: 'https://bitcoin.org/bitcoin.pdf' }))
// let csv = await ragApplication.addLoader(new CsvLoader({ filePathOrUrl: './Service_Requests_since_2016_20241116.csv' }))

const greetings = "Hello via Bun!";

console.log(greetings);

app.get("/", async (req: Request, res: Response) => {
    res.send(greetings);
  });

app.post('/ask', async (req: Request, res: Response) => {
    console.log(req.body);
    console.log('thank you, let me review the resources you provided');
    req.body.sources.forEach(async (source: { type: string, link: string; }) => {
        if (source.type == 'pdf') {
            await ragApplication.addLoader(new PdfLoader({ filePathOrUrl: source.link }))
            
        } else if (source.type == 'web') {
            await ragApplication.addLoader(new WebLoader({ urlOrContent: source.link }))

        } else if (source.type == 'csv') {
            await ragApplication.addLoader(new CsvLoader({ filePathOrUrl: source.link }))
        } else if (source.type == 'json') {
            let client = new MongoClient(dbconn);
            await client.connect();
            console.log('Connected successfully to server');
            const db = client.db('BlightBounties');
            const collection = db.collection('blight');
            const results = await collection.aggregate([{$sort: { CREATION_DATE: -1 }}]).limit(20).toArray();
            await ragApplication.addLoader(new JsonLoader({object: results}));
            console.log('resource loaded: ');
            console.log(results);
        }
        console.log('now let me process this, one moment please...');
    });
    const result = await ragApplication.query(req.body.query);

    res.send(result);
})
  
  app.listen(port, () => {
    console.log(`Listening @ http://localhost:3000 ...`);
  });

// const server = Bun.serve({
//     async fetch(req, server) {
//         const path = new URL(req.url).pathname;
//         // if (path == "/") {

//         // }
//          // receive POST data from a form
//     // if (req.method === "POST" && path === "/ask") {
//     //     const data = await req;
//     //     if (!data) {
//     //         return new Response("Send Data");
//     //     } else {
//     //         console.log(data.get('id'));
//     //         console.log(data.get('query'));
//     //         console.log(data.get('sources'));
//     //         return new Response("Success");
//     //     }
//     //   }
      
//       console.log(req);
//       return new Response(greetings + " api");
//     //   req.sources.forEach(source => {
//     //     await ragApplication.addLoader( new Loaders[source.key][0]({ }))
//     //   });
//     },
//     port: process.env.PORT || 3000
// });

/*
Bun.serve({
  static: {
    // health-check endpoint
    "/api/health-check": new Response("All good!"),

    // redirect from /old-link to /new-link
    "/old-link": Response.redirect("/new-link", 301),

    // serve static text
    "/": new Response("Hello World"),

    // serve a file by buffering it in memory
    "/index.html": new Response(await Bun.file("./index.html").bytes(), {
      headers: {
        "Content-Type": "text/html",
      },
    }),
    "/favicon.ico": new Response(await Bun.file("./favicon.ico").bytes(), {
      headers: {
        "Content-Type": "image/x-icon",
      },
    }),

    // serve JSON
    "/api/version.json": Response.json({ version: "1.0.0" }),
  },

  fetch(req) {
    return new Response("404!");
  },
});
*/