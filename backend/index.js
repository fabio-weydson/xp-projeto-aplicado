var http = require('http')
var express = require('express')
const multer = require("multer");


const { BlobServiceClient } = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");
require("dotenv").config();

var app = express()
const upload = multer({ storage: multer.memoryStorage() });

const port = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI
const STORAGE_ACCOUNT_NAME = process.env.STORAGE_ACCOUNT_NAME
const STORAGE_ACCOUNT_KEY = process.env.STORAGE_ACCOUNT_KEY
const STORAGE_CONTAINER_NAME = process.env.STORAGE_CONTAINER_NAME

const defaultAzureCredential = new DefaultAzureCredential();

const blobServiceClient = new BlobServiceClient(
    `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
    defaultAzureCredential
  );

app.get('/', function (req, res) {
    console.log('STORAGE_ACCOUNT_NAME:', STORAGE_ACCOUNT_NAME)
    res.send('Hello World!')
    }

)

// Listar arquivos no Azure Blob Storage
app.get('/files', function (req, res) {
    const files = []
    async function listFiles() {
        const containerClient = blobServiceClient.getContainerClient(STORAGE_CONTAINER_NAME);
        for await (const blob of containerClient.listBlobsFlat()) {
            files.push(blob.name)
        }
    }
    listFiles().then(() => {
        res.send(files)
    }).catch((error) => {
        res.send(error)
    })
}
)

// Realiza o upload do arquivo para o Azure Blob Storage
app.post('/files', upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No files were uploaded.');
    }
    const containerClient = blobServiceClient.getContainerClient(STORAGE_CONTAINER_NAME);
    const blobName = req.file.originalname;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
        await blockBlobClient.upload(req.file.buffer, req.file.size);
        res.status(200).send(`File "${blobName}" uploaded successfully.`);
    } catch (error) {
        res.status(500).send(`Error uploading file: ${blobName} \n ${error}`);
    }
})


var server = http.createServer(app)

server.listen(port, function () {
    console.log('Server is running on port', port)
    }
) 