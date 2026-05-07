'use client';

import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ApiService from '../../services/api';
import toast from 'react-hot-toast';
import { getCache, setCache, clearCache } from '../../utils/cache';

export default function BlogManager() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    excerpt: '',
    content: '',
    featured_image: '',
    status: 'published'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBlogs = async () => {
    const cacheKey = 'admin_blogs';
    const cached = getCache(cacheKey);

    if (cached) {
      setBlogs(cached);
      if (blogs.length === 0) setLoading(false);
    } else {
      if (blogs.length === 0) setLoading(true);
    }

    try {
      const res: any = await ApiService.blogs.getAll();
      const data = res.data || res;
      setBlogs(data);
      setCache(cacheKey, data);
    } catch (err) {
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleOpenModal = (blog: any = null) => {
    if (blog) {
      setEditingId(blog.id);
      setFormData({
        title: blog.title || '',
        category: blog.category || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        featured_image: blog.featured_image || '',
        status: blog.status || 'published'
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        category: '',
        excerpt: '',
        content: '',
        featured_image: '',
        status: 'published'
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('folder', 'blogs');

    setUploadingImage(true);
    try {
      const res: any = await ApiService.media.upload(uploadData);
      setFormData(prev => ({ ...prev, featured_image: res.data.path || res.path || res.url }));
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await ApiService.admin.updateBlog(editingId, formData);
        toast.success('Article updated successfully');
      } else {
        await ApiService.admin.createBlog(formData);
        toast.success('Article created successfully');
      }
      clearCache('admin_blogs');
      handleCloseModal();
      fetchBlogs();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Delete this article permanently?')) return;
    try {
      await ApiService.admin.deleteBlog(id);
      toast.success('Article deleted');
      clearCache('admin_blogs');
      fetchBlogs();
    } catch (err: any) {
      toast.error(err.message || 'Deletion failed');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6" fontWeight={800}>Platform Articles</Typography>
          <Typography variant="body2" color="text.secondary">Manage blog posts, news, and insights.</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => handleOpenModal()}
          sx={{ 
            borderRadius: 3, 
            textTransform: 'none', 
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(27, 79, 216, 0.2)',
            px: 3
          }}
        >
          Create Article
        </Button>
      </Box>

      <Paper elevation={0} sx={{ p: 0, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Title & Cover</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : blogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ p: 3, borderRadius: '50%', bgcolor: '#f1f5f9' }}>
                        <ArticleOutlinedIcon sx={{ fontSize: 48, color: '#94a3b8' }} />
                      </Box>
                      <Typography variant="subtitle1" fontWeight={700}>No articles published yet</Typography>
                      <Typography variant="body2" color="text.secondary" maxWidth={300} textAlign="center">
                        Start sharing insights, news, and updates with your audience.
                      </Typography>
                      <Button variant="outlined" onClick={() => handleOpenModal()} sx={{ mt: 1, borderRadius: 3, textTransform: 'none' }}>
                        Write your first post
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                blogs.map((blog) => (
                  <TableRow key={blog.id} hover sx={{ '&:last-child td': { border: 0 }, transition: 'background-color 0.2s' }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          component="img"
                          src={blog.featured_image ? ApiService.getMediaUrl(blog.featured_image) : '/Asset_8.png'}
                          sx={{ width: 60, height: 48, objectFit: 'cover', borderRadius: 2, bgcolor: '#f1f5f9' }}
                        />
                        <Box>
                          <Typography variant="body2" fontWeight={700} sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {blog.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: 300 }}>
                            {blog.excerpt || 'No excerpt provided'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={blog.category || 'General'} size="small" sx={{ fontWeight: 600, bgcolor: '#e0e7ff', color: '#4338ca' }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        {new Date(blog.created_at * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="Edit Article">
                          <IconButton size="small" color="primary" onClick={() => handleOpenModal(blog)} sx={{ bgcolor: 'rgba(27,79,216,0.05)', '&:hover': { bgcolor: 'rgba(27,79,216,0.1)' }}}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Article">
                          <IconButton size="small" color="error" onClick={() => handleDelete(blog.id)} sx={{ bgcolor: 'rgba(220,38,38,0.05)', '&:hover': { bgcolor: 'rgba(220,38,38,0.1)' }}}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create / Edit Modal */}
      <Dialog 
        open={modalOpen} 
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, m: 2 } }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 800, borderBottom: '1px solid rgba(0,0,0,0.05)', pb: 2 }}>
            {editingId ? 'Edit Article' : 'Create New Article'}
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid  size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Article Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Grid>
              <Grid  size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Grid>
              <Grid  size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: '100%' }}>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                  <Button
                    variant="outlined"
                    startIcon={uploadingImage ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    fullWidth
                    sx={{ height: 56, borderRadius: 3, textTransform: 'none', borderStyle: 'dashed' }}
                  >
                    {uploadingImage ? 'Uploading...' : 'Upload Cover Image'}
                  </Button>
                  {formData.featured_image && (
                    <Box
                      component="img"
                      src={ApiService.getMediaUrl(formData.featured_image)}
                      sx={{ width: 56, height: 56, borderRadius: 2, objectFit: 'cover', border: '1px solid #e2e8f0' }}
                    />
                  )}
                </Box>
              </Grid>
              <Grid  size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Short Excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  multiline
                  rows={2}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  helperText="A brief summary of the article for the list view."
                />
              </Grid>
              <Grid  size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Full Content (Markdown/HTML supported)"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  multiline
                  rows={10}
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, fontFamily: 'monospace' } }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
            <Button onClick={handleCloseModal} sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={submitting || uploadingImage}
              sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700, px: 4 }}
            >
              {submitting ? 'Saving...' : (editingId ? 'Update Article' : 'Publish Article')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

