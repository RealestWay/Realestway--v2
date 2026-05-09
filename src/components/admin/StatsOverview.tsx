'use client';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
interface StatsOverviewProps {
  stats: any;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  if (!stats) return null;

  const counters = [
    { label: 'Total Users', value: stats.counters.total_users, icon: <PeopleAltOutlinedIcon />, color: '#1B4FD8', trend: '+12.5%' },
    { label: 'Active Listings', value: stats.counters.active_listings, icon: <HomeWorkOutlinedIcon />, color: '#059669', trend: '+5.2%' },
    { label: 'Subscribers', value: stats.counters.newsletter_subscribers, icon: <MarkEmailReadOutlinedIcon />, color: '#EA580C', trend: '+8.1%' },
    { label: 'Blog Posts', value: stats.counters.total_blogs, icon: <DescriptionOutlinedIcon />, color: '#7C3AED', trend: '+2' },
  ];

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {counters.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.label}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: '1px solid rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 3,
                    bgcolor: `${item.color}12`,
                    color: item.color,
                    display: 'flex',
                  }}
                >
                  {item.icon}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 1,
                    py: 0.5,
                    borderRadius: '100px',
                    bgcolor: '#f0fdf4',
                    color: '#166534',
                  }}
                >
                  <TrendingUpIcon sx={{ fontSize: 14 }} />
                  <Typography variant="caption" fontWeight={700}>{item.trend}</Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {item.label}
              </Typography>
              <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>
                {item.value.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid  size={{ xs: 12, lg: 8 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', minHeight: 400 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
              <Box>
                <Typography variant="h6" fontWeight={800}>User Registration Growth</Typography>
                <Typography variant="body2" color="text.secondary">Real-time tracking of new user signups</Typography>
              </Box>
            </Box>
            
            {/* Simple Visual Chart Representation */}
            <Box sx={{ height: 250, display: 'flex', alignItems: 'flex-end', gap: { xs: 1, md: 3 }, px: 2, mb: 4 }}>
              {stats.growth_trend.map((day: any, i: number) => (
                <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Tooltip title={`${day.total} signups`}>
                    <Box 
                      sx={{ 
                        width: '100%', 
                        height: `${Math.max((day.total / 20) * 100, 10)}%`, 
                        bgcolor: 'primary.main', 
                        borderRadius: '6px 6px 0 0',
                        transition: 'height 1s ease-out',
                        opacity: 0.85 + (i * 0.02),
                        '&:hover': { opacity: 1, filter: 'brightness(1.1)' }
                      }} 
                    />
                  </Tooltip>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', whiteSpace: 'nowrap' }}>
                    {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid  size={{ xs: 12, lg: 4 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', height: '100%' }}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>User Roles</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {Object.entries(stats.user_breakdown).map(([role, count]: [any, any]) => {
                const percentage = (count / stats.counters.total_users) * 100;
                return (
                  <Box key={role}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                        {role}s
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {count} ({percentage.toFixed(0)}%)
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={percentage} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4, 
                        bgcolor: 'rgba(0,0,0,0.04)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          bgcolor: role === 'agent' ? '#059669' : role === 'admin' ? '#7C3AED' : '#1B4FD8'
                        }
                      }} 
                    />
                  </Box>
                );
              })}
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Property Status</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {Object.entries(stats.property_breakdown).map(([status, count]: [any, any]) => (
                <Chip
                  key={status}
                  label={`${status}: ${count}`}
                  size="small"
                  sx={{ 
                    fontWeight: 700, 
                    px: 1,
                    bgcolor: status === 'active' ? '#f0fdf4' : '#fef2f2',
                    color: status === 'active' ? '#166534' : '#991b1b',
                    border: '1px solid',
                    borderColor: status === 'active' ? '#bcf0da' : '#fecaca'
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', mt: 4 }}>
        <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Recent Activity</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {stats.recent_activity && stats.recent_activity.length > 0 ? (
            stats.recent_activity.map((activity: any, i: number) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 3, bgcolor: '#f8fafc', border: '1px solid rgba(0,0,0,0.02)' }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: '0.75rem' }}>
                  {activity.event_type?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                    {activity.event_type?.replace('_', ' ')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {activity.metadata?.action || 'System event'} • {activity.metadata?.platform || 'Unknown'}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {new Date(activity.created_at * 1000).toLocaleString()}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
              No recent activity found.
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

