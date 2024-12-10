import React, { useEffect, useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { AzureOpenAI } from "openai"; 

const dummyClients = [
  { id: 1, name: "Empresa 1" },
  { id: 2, name: "Empresa 2" },
];

const DemoUsuario = () => {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState(1);
  const [clientData, setClientData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = message;
    setMessage("");

    try {
      // TODO: Mover para o backend
      const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] || `https://${process.env.AZURE_OPENAI_SERVICE}.openai.azure.com/`;  
      const apiKey = process.env["AZURE_OPENAI_API_KEY"] || `${process.env.AZURE_OPENAI_API_KEY}`;  
      const apiVersion = `${process.env.AZURE_OPENAI_API_VERSION}`;  
      const deployment = `${process.env.AZURE_OPENAI_DEPLOYMENT}`;
      
      const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment, dangerouslyAllowBrowser: true });  
      
      const result = await client.chat.completions.create({  
        messages: [  
          { role: "system", content: `Você é um assistente de IA da ${clientData.name}` }, 
        ],  
        max_tokens: 800,  
        temperature: 0.7,  
        top_p: 0.95,  
        frequency_penalty: 0,  
        presence_penalty: 0,  
        stop: null  
      })
      
      for (const choice of result.choices) {  
        setResponses((prev) => [  
          ...prev,  
          { user: userMessage, bot: choice.message.content }  
        ]); 
      } 
    } catch (error) {
      console.error(error);
      setResponses((prev) => [
        ...prev,
        { user: userMessage, bot: "Desculpe, não consigo responder no momento"},
      ]);
    }
  };

  useEffect(() => {
    const client = dummyClients.find((client) => client.id === selectedClient);
    setResponses([]);
    setClientData(client);
  }, [selectedClient]);

  return (
    <Container maxWidth="sm" >
      <Typography variant="h5" marginTop="20px" gutterBottom>
        Selecione um cliente
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        {dummyClients.map((client) => (
          <Button
            key={client.id}
            variant={selectedClient === client.id ? "contained" : "outlined"}
            onClick={() => setSelectedClient(client.id)}
          >
            {client.name}
          </Button>
        ))}
      </Box>
      {clientData && 
      <> 
        <Typography variant="h5" marginTop="20px" gutterBottom>
          Você está em contato com o ChatBot Facil de {clientData?.name}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Digite sua mensagem para iniciar a conversa"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            margin="normal"
            rows="4"
          />
          <Button variant="contained" type="submit" fullWidth>
            Enviar
          </Button>
        </Box>
      </> 
      }
      <Box sx={{ mt: 3 }}>
        {responses.map((res, index) => (
          <Typography key={index}>
            <strong>Você:</strong> {res.user} <br />
            <strong>Bot:</strong> {res.bot}
          </Typography>
        ))}
      </Box>
    </Container>
  );
};

export default DemoUsuario;
