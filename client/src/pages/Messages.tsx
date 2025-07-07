import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Message as MessageIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import api from '../api';
import axios from 'axios';

interface Chat {
  _id: string;
  post: {
    _id: string;
    title: string;
    photo: string;
  };
  users: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  }>;
  messages: Array<{
    sender: {
      _id: string;
      firstName: string;
      lastName: string;
    };
    text: string;
    createdAt: string;
  }>;
}

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportMessage, setReportMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Debug info
  console.log('🔍 Messages component - User:', user);
  console.log('🔍 Messages component - Token:', localStorage.getItem('token'));
  console.log('🔍 Messages component - API URL:', process.env.REACT_APP_API_URL);
  console.log('🔍 Messages component - Current URL:', window.location.href);

  useEffect(() => {
    const fetchChats = async () => {
      if (!user || !user._id) {
        console.log('⚠️ No user or user ID found');
        return;
      }
      try {
        setLoading(true);
        setError(null);
        console.log('🔍 Fetching chats for user:', user._id);
        console.log('🔍 API base URL:', api.defaults.baseURL);
        const response = await api.get('/api/chat/user/chats');
        console.log('✅ Chats response:', response.data);
        setChats(response.data);
      } catch (err: any) {
        console.error('❌ Error fetching chats:', err);
        console.error('❌ Error details:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          config: err.config
        });
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || 'Failed to load conversations. Please try again later.');
        } else {
          setError('Failed to load conversations. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user]);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat || !user?._id) return;

    setSending(true);
    try {
      const otherUser = selectedChat.users.find(u => u._id !== user._id);
      if (!otherUser) {
        console.error('Could not find other user in chat');
        setError('Could not find the other user in this conversation.');
        return;
      }

      await api.post('/api/chat/' + selectedChat.post._id + '/message', {
        sender: user._id,
        receiver: otherUser._id,
        text: message
      });

      const chatResponse = await api.get('/api/chat/' + selectedChat.post._id + '/' + user._id + '/' + otherUser._id);
      const updatedChat = { ...selectedChat, messages: chatResponse.data };
      setSelectedChat(updatedChat);

      setChats(chats.map(chat =>
        chat._id === selectedChat._id ? updatedChat : chat
      ));

      setMessage('');
    } catch (err: any) {
      console.error('Failed to send message:', err);
      if (axios.isAxiosError(err)) {
        setActionError(err.response?.data?.error || 'Failed to send message.');
      } else {
        setActionError('Failed to send message.');
      }
    } finally {
      setSending(false);
    }
  };

  const getOtherUser = (chat: Chat) => {
    return chat.users.find(u => u._id !== user?._id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDeleteConversation = async () => {
    if (!selectedChat) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await api.delete('/api/chat/' + selectedChat._id);
      setChats(chats.filter(chat => chat._id !== selectedChat._id));
      setSelectedChat(null);
      setActionSuccess('Conversation deleted successfully.');
    } catch (err) {
      setActionError('Failed to delete conversation.');
    } finally {
      setActionLoading(false);
      handleMenuClose();
    }
  };

  const handleBlockUser = async () => {
    if (!user?._id || !selectedChat) return;
    const otherUser = getOtherUser(selectedChat);
    if (!otherUser) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await api.post('/users/' + user._id + '/block', { blockedUserId: otherUser._id });
      setActionSuccess('User blocked successfully.');
    } catch (err) {
      setActionError('Failed to block user.');
    } finally {
      setActionLoading(false);
      setBlockDialogOpen(false);
      handleMenuClose();
    }
  };

  const handleReport = async () => {
    if (!user?._id || !selectedChat) return;
    const otherUser = getOtherUser(selectedChat);
    if (!otherUser) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await api.post('/api/chat/' + selectedChat._id + '/report', {
        reporterId: user._id,
        reportedUserId: otherUser._id,
        message: reportMessage
      });
      setActionSuccess('Report submitted successfully.');
      setReportMessage('');
    } catch (err) {
      setActionError('Failed to submit report.');
    } finally {
      setActionLoading(false);
      setReportDialogOpen(false);
      handleMenuClose();
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 3, py: 1, border: '2px solid #e0e0e0', borderRadius: 3, bgcolor: '#fff', boxShadow: 1 }}>
          <MessageIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight={700} color="primary">
            Messages
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '70vh', overflow: 'auto' }}>
            <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              Conversations ({chats.length})
            </Typography>
            {chats.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  No conversations yet. Start by contacting a post publisher!
                </Typography>
              </Box>
            ) : (
              <List>
                {chats.map((chat) => {
                  const otherUser = getOtherUser(chat);
                  return (
                    <React.Fragment key={chat._id}>
                      <ListItem
                        button
                        selected={selectedChat?._id === chat._id}
                        onClick={() => setSelectedChat(chat)}
                        alignItems="flex-start"
                      >
                        <ListItemAvatar>
                          <Avatar src={otherUser?.avatar} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography fontWeight={600}>{otherUser?.firstName} {otherUser?.lastName}</Typography>
                            </Box>
                          }
                          secondary={
                            chat.messages.length > 0
                              ? chat.messages[chat.messages.length - 1].text
                              : 'No messages yet.'
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  );
                })}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
            {selectedChat && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={getOtherUser(selectedChat)?.avatar} />
                  <Typography variant="h6">
                    {getOtherUser(selectedChat)?.firstName} {getOtherUser(selectedChat)?.lastName}
                  </Typography>
                </Box>
                <IconButton onClick={handleMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
                <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
                  <MenuItem onClick={handleDeleteConversation}>Delete Conversation</MenuItem>
                  <MenuItem onClick={() => { setBlockDialogOpen(true); handleMenuClose(); }}>Block User</MenuItem>
                  <MenuItem onClick={() => { setReportDialogOpen(true); handleMenuClose(); }}>Report</MenuItem>
                </Menu>
              </Box>
            )}

            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              {selectedChat ? (
                <>
                  {selectedChat.messages.length === 0 ? (
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                      <Typography color="text.secondary">
                        No messages yet. Start the conversation!
                      </Typography>
                    </Box>
                  ) : (
                    <Box display="flex" flexDirection="column" gap={1}>
                      {selectedChat.messages.map((msg, index) => {
                        const senderId = typeof msg.sender === 'string' ? msg.sender : msg.sender._id;
                        const isSent = String(senderId) === String(user?._id);
                        return (
                          <Box
                            key={index}
                            sx={{
                              alignSelf: isSent ? 'flex-end' : 'flex-start',
                              maxWidth: '70%',
                              mb: 1
                            }}
                          >
                            <Paper
                              sx={{
                                p: 1.5,
                                borderRadius: 3,
                                boxShadow: 2,
                                backgroundColor: isSent ? 'primary.main' : 'grey.200',
                                color: isSent ? 'white' : 'text.primary',
                                borderTopRightRadius: isSent ? 0 : 12,
                                borderTopLeftRadius: isSent ? 12 : 0,
                              }}
                            >
                              {isSent && (
                                <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.7 }}>
                                  You
                                </Typography>
                              )}
                              <Typography variant="body2">{msg.text}</Typography>
                              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                {formatDate(msg.createdAt)}
                              </Typography>
                            </Paper>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Typography color="text.secondary">
                    Select a conversation to start messaging
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Box display="flex" gap={1}>
                <TextField
                  fullWidth
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={sending}
                />
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sending}
                >
                  {sending ? <CircularProgress size={20} /> : 'Send'}
                </Button>
              </Box>
            </Box>

            <Dialog open={blockDialogOpen} onClose={() => setBlockDialogOpen(false)}>
              <DialogTitle>Block User</DialogTitle>
              <DialogContent>
                <Typography>Are you sure you want to block this user? You will not receive messages from them.</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setBlockDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleBlockUser} color="error" disabled={actionLoading}>Block</Button>
              </DialogActions>
            </Dialog>
            <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)}>
              <DialogTitle>Report User</DialogTitle>
              <DialogContent>
                <Typography sx={{ mb: 2 }}>Describe the issue or misbehavior:</Typography>
                <TextField
                  multiline
                  minRows={3}
                  fullWidth
                  value={reportMessage}
                  onChange={e => setReportMessage(e.target.value)}
                  placeholder="Write your report here..."
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setReportDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleReport} color="error" disabled={actionLoading || !reportMessage.trim()}>Submit Report</Button>
              </DialogActions>
            </Dialog>
            {actionSuccess && <Alert severity="success" sx={{ mt: 2 }}>{actionSuccess}</Alert>}
            {actionError && <Alert severity="error" sx={{ mt: 2 }}>{actionError}</Alert>}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Messages;
