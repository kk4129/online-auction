import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          Online Auction
        </Typography>
        <Button color="inherit" onClick={() => navigate('/auctions')}>Auctions</Button>
        <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
        <Button color="inherit" onClick={() => navigate('/signup')}>Signup</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
