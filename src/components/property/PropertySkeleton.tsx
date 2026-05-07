import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';

interface PropertySkeletonProps {
  compact?: boolean;
}

export default function PropertySkeleton({ compact = false }: PropertySkeletonProps) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      }}
    >
      {/* Image Skeleton */}
      <Skeleton 
        variant="rectangular" 
        animation="wave"
        sx={{ 
          pt: compact ? '52%' : '64%', 
          width: '100%' 
        }} 
      />

      <CardContent sx={{ p: compact ? 2 : 2.5, flexGrow: 1 }}>
        {/* Title Skeleton */}
        <Skeleton variant="text" width="90%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1.5 }} />

        {/* Location Skeleton */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
          <Skeleton variant="circular" width={14} height={14} />
          <Skeleton variant="text" width="40%" />
        </Box>

        {/* Features Skeleton */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Skeleton variant="rectangular" width={40} height={20} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={40} height={20} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={40} height={20} sx={{ borderRadius: 1 }} />
        </Box>

        {/* Price & Agent Skeleton */}
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mt: 'auto' }}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="30%" height={16} />
            <Skeleton variant="text" width="60%" height={32} />
          </Box>
          <Skeleton variant="circular" width={26} height={26} />
        </Box>
      </CardContent>

      {/* Button Skeleton */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: 2 }} />
      </Box>
    </Card>
  );
}
