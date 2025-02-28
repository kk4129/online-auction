import React from 'react';
import { Card, CardContent,Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ProductCard({ auction }) {
  const navigate = useNavigate();

  return (
    <Card>
      
      <CardContent>
        <Typography variant="h6">{auction.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          Starting Bid: ${auction.startingBid}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate(`/auction/${auction._id}`)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
