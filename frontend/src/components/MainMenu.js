import React from "react";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const MainMenu = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          ChatBot Facil
        </Typography>
        <Button color="inherit" component={Link} to="/demo-cliente">
          Demo Cliente
        </Button>
        <Button color="inherit" component={Link} to="/demo-usuario">
          Demo Usuário
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default MainMenu;
