import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Dialog, DialogContent, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuctionForm from '../components/AuctionForm';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)({
  background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
  padding: '8px 16px',
});

const StyledButton = styled(Button)({
  borderRadius: '20px',
  margin: '0 10px',
  transition: '0.3s',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openAuctionForm, setOpenAuctionForm] = useState(false);

  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    if (authToken) {
      axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then(response => setUser(response.data))
      .catch(error => console.error('Error fetching user:', error));
    }
  }, [authToken]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login');
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Online Auction
        </Typography>
        <StyledButton color="inherit" onClick={() => navigate('/auctions')}>Auctions</StyledButton>
        <StyledButton color="inherit" onClick={() => navigate('/about-us')}>About Us</StyledButton>

        
        {user ? (
          <>
            <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
              <AccountCircleIcon fontSize="large" />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
              <MenuItem onClick={() => setOpenAuctionForm(true)}>Create Auction</MenuItem>
              <MenuItem onClick={() => navigate('/my-bids')}>My Bids</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <StyledButton color="inherit" onClick={() => navigate('/login')}>Login</StyledButton>
            <StyledButton color="inherit" variant="outlined" onClick={() => navigate('/signup')}>Signup</StyledButton>
          </>
        )}
      </Toolbar>

      {/* Auction Form Dialog */}
      <Dialog open={openAuctionForm} onClose={() => setOpenAuctionForm(false)} maxWidth="md" fullWidth>
        <DialogContent>
          <AuctionForm onAuctionCreated={() => setOpenAuctionForm(false)} />
        </DialogContent>
      </Dialog>
    </StyledAppBar>
  );
}

export default Navbar;