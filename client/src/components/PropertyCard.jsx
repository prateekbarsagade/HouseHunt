import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Button, Chip, Rating } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import KingBedIcon from '@mui/icons-material/KingBed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import { useNavigate } from 'react-router-dom';

const PropertyCard = ({ property, onActionClick, actionLabel, actionColor }) => {
    const navigate = useNavigate();

    // Map real backend data or fallback to dummy/passed data
    const image = (property?.Images && property.Images[0]) || property?.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800';
    const title = property?.Title || property?.title || 'Modern Luxury Apartment';
    const location = property?.Location || property?.location || '123 Main St, New York, NY';
    const price = property?.RentAmount || property?.price || '2,500';
    
    // Properties might not have beds/baths from backend depending on schema, mock for UI if missing
    const beds = property?.beds || Math.floor(Math.random() * 3) + 1;
    const baths = property?.baths || Math.floor(Math.random() * 2) + 1;
    const area = property?.area || (Math.floor(Math.random() * 8) + 8) * 100;
    const rating = property?.rating || 4.5;
    const isAvailable = property?.status !== 'Rented';

    const handleAction = () => {
        if (onActionClick) {
            onActionClick(property);
        } else {
            navigate(isAvailable ? '/login' : '#');
        }
    };

    return (
        <Card 
            sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 2,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                }
            }}
        >
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="200"
                    image={image}
                    alt={title}
                    sx={{ objectFit: 'cover' }}
                />
                <Chip 
                    label={isAvailable ? 'Available' : 'Rented'} 
                    color={isAvailable ? 'success' : 'error'} 
                    size="small"
                    sx={{ 
                        position: 'absolute', 
                        top: 12, 
                        right: 12, 
                        fontWeight: 'bold',
                        boxShadow: 2
                    }} 
                />
            </Box>
            
            <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600, lineHeight: 1.2, mb: 1, color: 'text.primary' }}>
                        {title}
                    </Typography>
                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                        ${price}<Typography component="span" variant="body2" color="text.secondary">/mo</Typography>
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'text.secondary' }}>
                    <LocationOnIcon sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" sx={{ noWrap: true }}>
                        {location}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={rating} precision={0.5} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                        ({Math.floor(Math.random() * 50) + 10} reviews)
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e5e7eb', pt: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <KingBedIcon sx={{ fontSize: 20, mr: 0.5 }} />
                        <Typography variant="body2" fontWeight="500">{beds} Beds</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <BathtubIcon sx={{ fontSize: 20, mr: 0.5 }} />
                        <Typography variant="body2" fontWeight="500">{baths} Baths</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <SquareFootIcon sx={{ fontSize: 20, mr: 0.5 }} />
                        <Typography variant="body2" fontWeight="500">{area} sqft</Typography>
                    </Box>
                </Box>

                <Button 
                    variant="contained" 
                    fullWidth 
                    disableElevation
                    color={actionColor || 'primary'}
                    sx={{ 
                        mt: 'auto', 
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: 1.5
                    }}
                    onClick={handleAction}
                    disabled={!isAvailable}
                >
                    {actionLabel || (isAvailable ? 'View Details & Book' : 'Currently Unavailable')}
                </Button>
            </CardContent>
        </Card>
    );
};

export default PropertyCard;
