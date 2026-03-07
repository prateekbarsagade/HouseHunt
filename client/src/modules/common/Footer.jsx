import React from 'react';
import { Box, Container, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <Box 
            component="footer" 
            sx={{ 
                bgcolor: '#1f2937', 
                color: '#f9fafb', 
                py: 6,
                mt: 'auto'
            }}
        >
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'center', md: 'flex-start' } }}>
                    <Box sx={{ mb: { xs: 4, md: 0 }, textAlign: { xs: 'center', md: 'left' } }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            HouseRent
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#9ca3af', maxWidth: 300 }}>
                            Making property rentals simple, secure, and hassle-free for everyone. Find your next home with us.
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 4, textAlign: { xs: 'center', md: 'left' } }}>
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Platform</Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}><MuiLink component={Link} to="/renter/properties" color="inherit" underline="hover">Browse Properties</MuiLink></Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}><MuiLink component={Link} to="/owner/add-property" color="inherit" underline="hover">List Your Property</MuiLink></Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Support</Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}><MuiLink href="#" color="inherit" underline="hover">Help Center</MuiLink></Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}><MuiLink href="#" color="inherit" underline="hover">Terms of Service</MuiLink></Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}><MuiLink href="#" color="inherit" underline="hover">Privacy Policy</MuiLink></Typography>
                        </Box>
                    </Box>
                </Box>
                
                <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid #374151', textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                        &copy; {new Date().getFullYear()} HouseRent. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
