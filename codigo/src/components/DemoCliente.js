import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";

const DemoCliente = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados enviados!");
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" marginTop="20px" gutterBottom>
        Informações da Empresa
      </Typography>
      <Typography variant="body1" marginBottom="20px" color="textSecondary">
        Preencha os campos abaixo com as informações da sua empresa. Recomenda-se utilizar linguagem natural.
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField fullWidth label="Nome Fantasia" margin="normal" required />
        <TextField fullWidth label="Endereço Completo" margin="normal" 
          placeholder="Ex: Rua, Número, Bairro, Cidade, Estado"
        required />
        <TextField fullWidth label="Horário de Funcionamento" margin="normal" 
          placeholder="Ex: Segunda a Sexta, das 8h às 18h" required
        />
        <TextField fullWidth label="Telefone" margin="normal"
          placeholder="Ex: (11) 888888-888888 e (11) 99999-9999" required
        />
        <TextField fullWidth label="Email" margin="normal" type="email" required />
        <Button variant="outlined" component="label" fullWidth margin="normal">
          Enviar Arquivo
          <input type="file" hidden accept=".pdf,.doc,.txt" onChange={handleFileChange} />
        </Button>
        {file && <Typography 
          variant="body2" 
          marginTop="10px" 
          marginBottom="10px" 
          color="textSecondary"
        >Arquivo selecionado: {file.name}</Typography>}
        <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
          Enviar
        </Button>
      </Box>
    </Container>
  );
};

export default DemoCliente;
