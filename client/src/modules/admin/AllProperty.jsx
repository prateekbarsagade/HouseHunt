import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

const AllProperty = () => {
    const [properties, setProperties] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/admin/properties', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setProperties(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProperties();
    }, [user.token]);

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>All Properties in System</Typography>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Rent Amount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Owner</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {properties.map((p) => (
                            <TableRow key={p._id}>
                                <TableCell>{p.Title}</TableCell>
                                <TableCell>{p.Location}</TableCell>
                                <TableCell>${p.RentAmount}</TableCell>
                                <TableCell>{p.Status}</TableCell>
                                <TableCell>{p.OwnerID?.Name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
};

export default AllProperty;
