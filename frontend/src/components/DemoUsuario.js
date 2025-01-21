import React, { useEffect, useState } from "react";
import { Container, TextField, Button, Typography, Box, Checkbox } from "@mui/material";
import { StyledButton, StyledBox, StyledForm, StyledMessageBox, UserMessage, BotMessage } from "./DemoUsuario.styles";


const dummyClients = [
  { id: 1, name: "Pousada Brisa do Mar", slug: "brisa-do-mar" },
  { id: 2, name: "Pousada Vento Costeiro", slug: "vento-costeiro" },
];

const DemoUsuario = () => {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState(1);
  const [clientData, setClientData] = useState(null);
  const [debugMode, setDebugMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = message;
    setMessage("");

  fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        debug: debugMode,
        prompt: userMessage
       }),
  })
      .then((response) => response.json())
      .then((data) => {
          setResponses((prev) => [
              ...prev,
              { user: userMessage, bot: data.bot },
          ]);
      })
      .catch((error) => {
          console.error('Error:', error);
      });      
  };

  useEffect(() => {
    const client = dummyClients.find((client) => client.id === selectedClient);
    setResponses([]);
    setClientData(client);
  }, [selectedClient]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" marginTop="20px" gutterBottom>
        Selecione um cliente
      </Typography>
      <StyledBox>
        {dummyClients.map((client) => (
          <StyledButton
            key={client.id}
            variant={selectedClient === client.id ? "contained" : "outlined"}
            onClick={() => setSelectedClient(client.id)}
          >
            {client.name}
          </StyledButton>
        ))}
        <>
          <Checkbox checked={debugMode} onChange={(e) => setDebugMode(e.target.checked)} /> 
          <Typography variant="body1" marginTop="10px" gutterBottom>
            Modo de teste
          </Typography>
        </>
      </StyledBox>
      <>
        <Typography variant="h5" marginTop="20px" gutterBottom>
            Você está em contato com o ChatBot Facil de {clientData?.name}
        </Typography>
      </>
      <Box sx={{ mt: 3 }}>
        {responses.map((res, index) => (
          <StyledMessageBox key={index} alignEnd={!!res.user}>
            {res.user && (
              <UserMessage>
                <Typography>
                  <strong>Você:</strong> {res.user}
                </Typography>
              </UserMessage>
            )}
            {res.bot && (
              <BotMessage>
                <Typography>
                  <strong>Bot:</strong> {res.bot}
                </Typography>
              </BotMessage>
            )}
          </StyledMessageBox>
        ))}
      </Box>
      {clientData && (
        <>
          
          <StyledForm component="form" onSubmit={handleSubmit} key="form">
            <TextField
              key="message"
              fullWidth
              label="Digite sua mensagem para iniciar a conversa"
              value={message}
              autoFocus="autoFocus"
              onChange={(e) => setMessage(e.target.value)}
              margin="normal"
              rows="4"
            />
            <Button variant="contained" type="submit" fullWidth>
              Enviar
            </Button>
          </StyledForm>
        </>
      )}
      
    </Container>
  );
};

export default DemoUsuario;
