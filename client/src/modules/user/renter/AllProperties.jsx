import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, TextField, Button, InputAdornment, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';
import PropertyCard from '../../../components/PropertyCard';

const AllProperties = () => {
    const [properties, setProperties] = useState([]);
    const [filters, setFilters] = useState({ location: '', propertyType: '' });
    
    // Safety check for user in case they are not logged in but viewing the page
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const fetchProperties = async () => {
        try {
            const query = new URLSearchParams(filters).toString();
            // Optional: If you don't need auth to view, but only to book
            const res = await axios.get(`http://localhost:8000/api/users/properties?${query}`);
            setProperties(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const handleSearch = () => {
        fetchProperties();
    };

    const handleBook = async (property) => {
        if (!user) {
            alert('Please login to book a property.');
            return;
        }
        try {
            await axios.post('http://localhost:8000/api/users/book', 
                { propertyId: property._id, startDate: new Date() },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            alert('Booking requested successfully!');
        } catch (error) {
            alert('Failed to book property');
        }
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
                    Available Properties
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400 }}>
                    Find the perfect place that fits your lifestyle.
                </Typography>

                {/* Filter Section */}
                <Box 
                    sx={{ 
                        mb: 6, 
                        p: 3, 
                        bgcolor: 'background.paper', 
                        borderRadius: 3, 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' 
                    }}
                >
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <TextField 
                                fullWidth 
                                label="Location" 
                                placeholder="Enter city or neighborhood"
                                variant="outlined" 
                                value={filters.location} 
                                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationOnIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField 
                                fullWidth 
                                select
                                label="Property Type" 
                                variant="outlined" 
                                value={filters.propertyType} 
                                onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                            >
                                <MenuItem value="">All Types</MenuItem>
                                <MenuItem value="Apartment">Apartment</MenuItem>
                                <MenuItem value="House">House</MenuItem>
                                <MenuItem value="Condo">Condo</MenuItem>
                                <MenuItem value="Townhouse">Townhouse</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button 
                                fullWidth 
                                variant="contained" 
                                color="primary" 
                                onClick={handleSearch} 
                                sx={{ height: '56px', fontWeight: 600, fontSize: '1rem', borderRadius: 2 }}
                                startIcon={<SearchIcon />}
                            >
                                Search
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                {/* Properties Grid */}
                <Grid container spacing={4}>
                    {properties.length > 0 ? (
                        properties.map((property) => (
                            <Grid item key={property._id || property.id} xs={12} sm={6} md={4}>
                                <PropertyCard 
                                    property={property} 
                                    onActionClick={handleBook}
                                    actionLabel="Book Now"
                                />
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <Typography variant="h6" color="text.secondary">
                                    No properties found. Try adjusting your search filters.
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );
};

export default AllProperties;
