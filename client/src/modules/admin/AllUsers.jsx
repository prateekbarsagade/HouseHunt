import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Paper } from '@mui/material';
import axios from 'axios';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/admin/users', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setUsers(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [user.token]);

    const handleMakeOwner = async (id) => {
        try {
            await axios.put(`http://localhost:8000/api/admin/users/${id}/makeowner`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchUsers();
            alert('User is now a Landlord');
        } catch (error) {
            alert('Failed to update user role');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>All Users</Typography>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((u) => (
                            <TableRow key={u._id}>
                                <TableCell>{u.Name}</TableCell>
                                <TableCell>{u.Email}</TableCell>
                                <TableCell>{u.Phone}</TableCell>
                                <TableCell>{u.UserType}</TableCell>
                                <TableCell>
                                    {u.UserType === 'Tenant' && (
                                        <Button size="small" variant="contained" color="secondary" onClick={() => handleMakeOwner(u._id)}>
                                            Approve Landlord
                                        </Button>
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

export default AllUsers;
