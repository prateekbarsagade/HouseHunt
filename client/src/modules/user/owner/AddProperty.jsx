import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Grid } from '@mui/material';
import AddHomeIcon from '@mui/icons-material/AddHome';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProperty = () => {
    const [formData, setFormData] = useState({
        Title: '', Description: '', Location: '', RentAmount: '', PropertyType: '', FurnishingStatus: ''
    });
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/owners/properties', formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            alert('Property added successfully');
            navigate('/owner/properties');
        } catch (error) {
            alert('Failed to add property');
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 6, mb: 10 }}>
            <Box sx={{ 
                p: { xs: 3, md: 6 }, 
                bgcolor: 'background.paper',
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)', 
                borderRadius: 3,
                border: '1px solid #f3f4f6'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <AddHomeIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                            List Your Property
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Fill out the details below to add a new property to your portfolio.
                        </Typography>
                    </Box>
                </Box>
                
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField 
                                fullWidth 
                                label="Property Title" 
                                name="Title" 
                                onChange={handleChange} 
                                required 
                                placeholder="e.g. Modern Downtown Apartment"
                                variant="outlined"
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                fullWidth 
                                label="Location" 
                                name="Location" 
                                onChange={handleChange} 
                                required 
                                placeholder="Full address or neighborhood"
                                variant="outlined"
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                fullWidth 
                                label="Rent Amount ($/month)" 
                                name="RentAmount" 
                                type="number" 
                                onChange={handleChange} 
                                required 
                                placeholder="e.g. 2500"
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField 
                                fullWidth 
                                label="Property Type" 
                                name="PropertyType" 
                                onChange={handleChange} 
                                required 
                                placeholder="e.g. Apartment, House, Condo"
                                variant="outlined"
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                fullWidth 
                                label="Furnishing Status" 
                                name="FurnishingStatus" 
                                onChange={handleChange} 
                                required 
                                placeholder="e.g. Fully Furnished, Unfurnished"
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField 
                                fullWidth 
                                label="Detailed Description" 
                                name="Description" 
                                onChange={handleChange} 
                                multiline 
                                rows={4} 
                                required 
                                placeholder="Describe the key features, amenities, and terms."
                                variant="outlined"
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                type="submit" 
                                size="large"
                                sx={{ mt: 2, py: 1.5, px: 4, fontWeight: 600, borderRadius: 2 }}
                            >
                                Publish Listing
                            </Button>
                            <Button 
                                variant="text" 
                                color="inherit" 
                                onClick={() => navigate('/owner')}
                                size="large"
                                sx={{ mt: 2, ml: 2, py: 1.5, fontWeight: 500 }}
                            >
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Container>
    );
};

export default AddProperty;
