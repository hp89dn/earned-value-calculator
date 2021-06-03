import { AppBar, Toolbar, Container, Typography } from "@material-ui/core";
import React from "react";

export const Footer = () => {
  return (
    <AppBar position="sticky">
      <Container maxWidth="md">
        <Toolbar>
          <Typography variant="body1">
            <a className="text-white" href="https://www.facebook.com/huynhphuoc2000">Phuoc Huynh </a> ©
            2021 Da Nang
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
