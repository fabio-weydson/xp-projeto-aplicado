var http = require('http')
var express = require('express')
const multer = require("multer");
const axios = require("axios");
const cors = require("cors");

const { BlobServiceClient } = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");


require("dotenv").config();

const app = express()
app.use(express.json());
app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });
const port = process.env.PORT || 3000
const server = http.createServer(app)

server.listen(port, function () {
    console.log('Server is running on port', port)
    }
) 

const {
    // Database variables
    MONGODB_URI = 'mongodb://localhost:27017/chatbot',
    // Azure Storage Account variables
    STORAGE_ACCOUNT_NAME,
    STORAGE_CONTAINER_NAME,
    // Azure OpenAI API variables
    AZURE_OPENAI_MODEL_VERSION = '2024-08-01-preview',
    AZURE_OPENAI_API_KEY,
    AZURE_OPENAI_ENDPOINT,
    AZURE_OPENAI_DEPLOYMENT,
} = process.env;


app.get('/', function (req, res) {
      res.send('API Chat Bot Facil')
    })

// Listar arquivos no Azure Blob Storage
app.get('/files', function (req, res) {

    const defaultAzureCredential = new DefaultAzureCredential();
    const blobServiceClient = new BlobServiceClient(
        `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
        defaultAzureCredential
    );

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
})

// Realiza o upload do arquivo para o Azure Blob Storage
app.post('/files', upload.single("file"), async (req, res) => {
    const { client_id } = req.body;
    if (!req.file) {
        return res.status(400).send('No files were uploaded.');
    }
    const containerClient = blobServiceClient.getContainerClient(STORAGE_CONTAINER_NAME);
    const blobName = `${client_id}/${req.file.originalname};`
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
        await blockBlobClient.upload(req.file.buffer, req.file.size);
        res.status(200).send(`File "${blobName}" uploaded successfully.`);
    } catch (error) {
        res.status(500).send(`Error uploading file: ${blobName} \n ${error}`);
    }
})


// Rota para conversar com agente de IA
app.post('/chat', async (req, res) => {
    const { prompt, debug, client_id } = req.body;
    //debug mode via query param
    console.log('Prompt:', prompt, 'Debug:', debug);
    if (debug) { 
        console.log('Prompt:', prompt);
        //retrun a fake conversation for debug

        return res.json({
            "bot": "Olá! Sou o assistente virtual da Empresa de Exemplo. Como posso ajudá-lo(a) hoje?"
        });
    }

    const defaultAzureCredential = new DefaultAzureCredential();
    const blobServiceClient = new BlobServiceClient(
        `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
        defaultAzureCredential
    );

    const containerClient = blobServiceClient.getContainerClient(STORAGE_CONTAINER_NAME);
    const blobName = `${client_id}/prompt.txt`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
        const downloadBlockBlobResponse = await blockBlobClient.download(0);
        const downloaded = await streamToString(downloadBlockBlobResponse.readableStreamBody);
        prompt = downloaded;
    } catch (error) {
        return res.status(500).send(`Error downloading file: ${blobName} \n ${error}`);
    }

    async function streamToString(readableStream) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            readableStream.on("data", (data) => {
                chunks.push(data.toString());
            });
            readableStream.on("end", () => {
                resolve(chunks.join(""));
            });
            readableStream.on("error", reject);
        });
    }
    const requestBody = {
        
      messages: [
        { role: 'system', content: `Saudação e Introdução
                Quando o cliente enviar uma mensagem, comece com uma saudação e uma breve introdução:
                "Olá! Sou o assistente virtual da Pousada Brisa do Mar, no lindo litoral do Ceará. Como posso ajudá-lo(a) hoje?"

                Respostas para Perguntas Frequentes (FAQ)
                1. Sobre a Pousada e Preços
                Se perguntarem sobre as acomodações ou faixa de preços, responda:
                "Temos quartos aconchegantes com preços variando de R$180 a R$450 por noite, dependendo da categoria. Todos incluem café da manhã e Wi-Fi gratuito!"

                2. Horário de Funcionamento
                Se perguntarem sobre o horário de funcionamento, responda:
                "Estamos abertos 24 horas para receber você! Nosso atendimento por WhatsApp está disponível das 8h às 20h."

                3. Reservas e Disponibilidade
                Se perguntarem sobre reservas, responda:
                "Para reservar, basta informar a data da sua estadia e a quantidade de hóspedes. Posso verificar a disponibilidade para você agora!"

                4. Serviços Oferecidos
                Se perguntarem sobre os serviços, responda:
                "Oferecemos piscina, estacionamento gratuito, serviço de quarto e opções de passeios turísticos na região. Precisa de algo específico?"

                5. Localização e Atrações Próximas
                Se perguntarem sobre a localização ou atrações, responda:
                "Estamos localizados na Praia do Sol, Ceará, a apenas 5 minutos a pé da praia. Próximo à pousada, você encontra restaurantes típicos e passeios de buggy pelas dunas!"

                6. Envio de Arquivos ou Informações Adicionais
                Se precisarem enviar documentos ou informações, diga:
                "Você pode enviar arquivos em PDF, DOC ou TXT contendo suas informações ou necessidades. Estarei aqui para ajudar no que for preciso!"

                Finalização e Agradecimento
                Após resolver a dúvida ou finalizar o atendimento, sempre finalize com:
                "Há algo mais em que eu possa ajudar? Agradecemos por escolher a Pousada Brisa do Mar para sua estadia! Estamos ansiosos para recebê-lo(a)."

                Encaminhamento para Atendimento Humano
                Se a IA não conseguir responder a uma pergunta, encaminhe para atendimento humano:
                "Parece que essa é uma questão específica. Vou transferir você para um de nossos atendentes. Um momento, por favor!"

                Personalização e Empatia
                Adicione empatia às respostas quando possível, como:
                "Estamos aqui para tornar sua experiência no Ceará inesquecível. Conte conosco para o que precisar!"` 

},
        { role: 'user', content: prompt }
      ],
      max_tokens: 100, // Limit the response length
      temperature: 0.6 // Adjust creativity level
    };
    
  
    const headers = {
      'Content-Type': 'application/json',
      'api-key': `${AZURE_OPENAI_API_KEY}`
    };
  
    try {
      const response = await axios.post(
        `${AZURE_OPENAI_ENDPOINT}?api-version=${AZURE_OPENAI_MODEL_VERSION}`, 
        requestBody, 
        { headers }
      );
  
      const botMessage = response.data.choices[0].message.content;
      res.json({ bot: botMessage });
    } catch (error) {
      res.status(500).json({ error: error.response?.data || error.message });
    }
  });