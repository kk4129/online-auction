import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Dialog, DialogContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuctionForm from '../components/AuctionForm'; // ✅ Import Auction Form

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openAuctionForm, setOpenAuctionForm] = useState(false); // ✅ State for Auction Form Dialog

  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    if (authToken) {
      axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` } // ✅ Send auth token
      })
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error('Error fetching user:', error);
      });
    }
  }, [authToken]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login');
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          Online Auction
        </Typography>
        <Button color="inherit" onClick={() => navigate('/auctions')}>Auctions</Button>

        {user ? (
          <>
            <Button color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
              {user.username} ▼
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
              <MenuItem onClick={() => setOpenAuctionForm(true)}>Create Auction</MenuItem> {/* ✅ Open Auction Form Dialog */}
              <MenuItem onClick={() => navigate('/my-bids')}>My Bids</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
            <Button color="inherit" onClick={() => navigate('/signup')}>Signup</Button>
          </>
        )}
      </Toolbar>

      {/* ✅ Auction Form Dialog with Increased Width */}
      <Dialog 
        open={openAuctionForm} 
        onClose={() => setOpenAuctionForm(false)}
        maxWidth="md" // ✅ Set max width to 'md' (medium) or 'lg' (large)
        fullWidth // ✅ Make it take full width up to maxWidth
      >
        <DialogContent>
          <AuctionForm onAuctionCreated={() => setOpenAuctionForm(false)} /> {/* ✅ Close Dialog After Submission */}
        </DialogContent>
      </Dialog>
    </AppBar>
  );
}

export default Navbar;
