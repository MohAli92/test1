import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import type { GridProps } from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import { Restaurant } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface Post {
  _id: string;
  photo: string;
  ingredients: string[];
  allergies: string[];
  city: string;
  address: string;
  time: string;
  description: string;
  reserved: boolean;
  user?: {
    _id: string;
    firstName?: string;
    lastName?: string;
  };
}

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuPostId, setMenuPostId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/api/posts');
        console.log('Fetched posts:', response.data);
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete('/api/posts/' + postId);
      setPosts(posts.filter(p => p._id !== postId));
    } catch (err) {
      alert('Failed to delete post.');
    }
  };

  const handleReserve = async (postId: string) => {
    try {
      const response = await api.patch('/api/posts/' + postId + '/reserve');
      setPosts(posts.map(p => p._id === postId ? { ...p, reserved: true } : p));
    } catch (err) {
      alert('Failed to mark as reserved.');
    }
  };

  const handleViewAndChat = (postId: string) => {
    navigate('/post/' + postId);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, postId: string) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuPostId(postId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuPostId(null);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 3, py: 1, border: '2px solid #e0e0e0', borderRadius: 3, bgcolor: '#fff', boxShadow: 1 }}>
          <Restaurant sx={{ fontSize: 24, color: 'primary.main' }} />
          <Typography variant="h5" fontWeight={700} color="primary">
            Meals Near You
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {loading ? (
          // Loading skeletons
          Array.from({ length: 4 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton />
                  <Skeleton width="60%" />
                  <Skeleton width="40%" />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : posts.length === 0 ? (
          // No posts message
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No meals found. Be the first to share!
              </Typography>
            </Box>
          </Grid>
        ) : (
          // Posts grid
          posts.map((post: Post) => (
            <Grid item xs={12} sm={6} md={4} key={post._id}>
              <Box sx={{ position: 'relative', height: '100%' }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    '&:hover .edit-pen-icon': { opacity: 1 },
                  }}
                >
                  {user && post.user && user._id === post.user._id && (
                    <>
                      <IconButton
                        aria-label="more"
                        onClick={e => handleMenuOpen(e, post._id)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          zIndex: 2,
                          bgcolor: 'white',
                          boxShadow: 1,
                          transition: 'opacity 0.2s',
                          '&:hover': { bgcolor: 'primary.light' },
                          pointerEvents: 'auto',
                        }}
                      >
                        <MoreVertIcon color="primary" />
                      </IconButton>
                      <Menu
                        anchorEl={menuAnchorEl}
                        open={menuPostId === post._id}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      >
                        <MenuItem onClick={() => { handleMenuClose(); navigate('/edit/' + post._id); }}>
                          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                        </MenuItem>
                        <MenuItem onClick={() => { handleMenuClose(); handleReserve(post._id); }} disabled={post.reserved}>
                          {post.reserved ? 'Reserved' : 'Mark as Reserved'}
                        </MenuItem>
                        <MenuItem onClick={() => { handleMenuClose(); handleDelete(post._id); }}>
                          <span style={{ color: '#d32f2f', fontWeight: 600 }}>Delete</span>
                        </MenuItem>
                      </Menu>
                    </>
                  )}

                  <CardMedia
                    component="img"
                    height="200"
                    image={post.photo}
                    alt="Food"
                    sx={{ objectFit: 'cover' }}
                  />

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {post.ingredients.join(', ')}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      📍 {post.city}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      🕒 {formatDate(post.time)}
                    </Typography>
                    
                    {post.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {post.description}
                      </Typography>
                    )}

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {post.allergies.length > 0 && (
                        <Chip
                          label={`Allergies: ${post.allergies.join(', ')}`}
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      )}
                      {post.reserved && (
                        <Chip
                          label="Reserved"
                          size="small"
                          color="success"
                        />
                      )}
                    </Box>

                    {post.user && (
                      <Typography variant="caption" color="text.secondary">
                        Shared by: {post.user.firstName} {post.user.lastName}
                      </Typography>
                    )}
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleViewAndChat(post._id)}
                      fullWidth
                    >
                      View & Chat
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default Home;