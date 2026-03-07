import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../../../components/PropertyCard';
import AddIcon from '@mui/icons-material/Add';

const OwnerProperties = () => {
    const [properties, setProperties] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/owners/properties', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setProperties(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProperties();
    }, [user?.token]);

    const handleDelete = async (property) => {
        if (!window.confirm(`Are you sure you want to delete "${property.Title}"?`)) return;
        
        try {
            await axios.delete(`http://localhost:8000/api/owners/properties/${property._id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setProperties(properties.filter(p => p._id !== property._id));
        } catch (error) {
            alert('Failed to delete property');
        }
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 5 }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 5 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
                            My Properties
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Manage your listed properties and their availability.
                        </Typography>
                    </Box>
                    <Button 
                        variant="contained" 
                        color="secondary" 
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/owner/add-property')}
                        sx={{ fontWeight: 600, borderRadius: 2 }}
                    >
                        Add New Property
                    </Button>
                </Box>

                <Grid container spacing={4}>
                    {properties.length > 0 ? (
                        properties.map(property => (
                            <Grid item key={property._id} xs={12} sm={6} md={4}>
                                <PropertyCard 
                                    property={property}
                                    onActionClick={handleDelete}
                                    actionLabel="Delete Listing"
                                    actionColor="error"
                                />
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'background.paper', borderRadius: 3, border: '1px dashed #e5e7eb' }}>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    You haven't listed any properties yet.
                                </Typography>
                                <Button 
                                    variant="outlined" 
                                    color="primary" 
                                    sx={{ mt: 2 }}
                                    onClick={() => navigate('/owner/add-property')}
                                >
                                    Create Your First Listing
                                </Button>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );
};

export default OwnerProperties;
