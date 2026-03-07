import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Paper } from '@mui/material';
import axios from 'axios';

const OwnerBookings = () => {
    const [bookings, setBookings] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchBookings = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/owners/bookings', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setBookings(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [user.token]);

    const handleUpdateStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:8000/api/owners/bookings/${id}`, { status }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchBookings(); // Refresh the list
        } catch (error) {
            alert('Failed to update status');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>Property Bookings</Typography>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Property Title</TableCell>
                            <TableCell>Tenant Name</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow key={booking._id}>
                                <TableCell>{booking.PropertyID?.Title}</TableCell>
                                <TableCell>{booking.TenantID?.Name}</TableCell>
                                <TableCell>{new Date(booking.StartDate).toLocaleDateString()}</TableCell>
                                <TableCell>{booking.Status}</TableCell>
                                <TableCell>
                                    {booking.Status === 'Pending' && (
                                        <>
                                            <Button size="small" variant="contained" color="success" sx={{ mr: 1 }} onClick={() => handleUpdateStatus(booking._id, 'Confirmed')}>Confirm</Button>
                                            <Button size="small" variant="outlined" color="error" onClick={() => handleUpdateStatus(booking._id, 'Cancelled')}>Cancel</Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
};

export default OwnerBookings;
