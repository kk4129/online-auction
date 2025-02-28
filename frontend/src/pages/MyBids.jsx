import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Container,Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

function MyBids() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:5000/api/bids/my-bids", {
          headers: { Authorization: `Bearer ${authToken}` },
          withCredentials: true,
        });
        setBids(response.data);
      } catch (error) {
        console.error("Error fetching bids:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, []);

  return (
    <Container>
            <Typography variant="h5">My Bids</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Auction</TableCell>
                        <TableCell>Bid Amount</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bids.map((bid) => (
                        <TableRow key={bid._id}>
                            <TableCell>{bid.auctionTitle}</TableCell>
                            <TableCell>${bid.amount}</TableCell>
                            <TableCell 
                                style={{ color: bid.status === "Won" ? "green" : "red", fontWeight: "bold" }}
                            >
                                {bid.status}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
  );
}

export default MyBids;
