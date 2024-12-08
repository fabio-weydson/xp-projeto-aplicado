import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

const DemoUsuario = () => {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setResponses([...responses, { user: message, bot: "Resposta simulada" }]);
    setMessage("");
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" marginTop="20px" gutterBottom>
        Você está em contato com o ChatBot Facil
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
