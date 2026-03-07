import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

const AllBookings = () => {
    const [bookings, setBookings] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/admin/bookings', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setBookings(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchBookings();
    }, [user.token]);

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>All System Bookings</Typography>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Property</TableCell>
                            <TableCell>Tenant</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.map((b) => (
                            <TableRow key={b._id}>
                                <TableCell>{b.PropertyID?.Title}</TableCell>
                                <TableCell>{b.TenantID?.Name}</TableCell>
                                <TableCell>{new Date(b.StartDate).toLocaleDateString()}</TableCell>
                                <TableCell>{b.Status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
};

export default AllBookings;
