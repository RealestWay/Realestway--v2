'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { NIGERIAN_LOCATIONS, NIGERIAN_STATES, PROPERTY_TYPES } from '../../data/mockData';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ApiService from '@/src/services/api';
import { toast } from 'react-hot-toast';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import VideocamIcon from '@mui/icons-material/Videocam';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useRef, useEffect } from 'react';
import { useAuth } from '@/src/context/AuthContext';

interface MediaUpload {
  id?: number;
  url: string;
  status: 'uploading' | 'success' | 'error';
  file?: File;
  error?: string;
}

const steps = ['Basic Details', 'Location', 'Media', 'Pricing', 'Features', 'Review'];

const PREDEFINED_FEATURES = ['Swimming Pool', 'Fitted Kitchen', 'BQ', 'Security', 'Gym', 'Parking Space', 'Borehole', 'Elevator', 'CCTV'];
const PREDEFINED_FEE_NAMES = ['Service Charge', 'Development Levy', 'Waste Management', 'Security Levy'];

export default function AddListingPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'agent')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const [loading, setLoading] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('draft');
  const [coords, setCoords] = useState<{lat: number | null, lng: number | null}>({lat: null, lng: null});
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completedStep, setCompletedStep] = useState(0);
  const [cameraDialogOpen, setCameraDialogOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const isSaving = useRef(false);

  // Camera UI State
  const [cameraMode, setCameraMode] = useState<'photo' | 'video'>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<{blob: Blob, url: string, type: 'image' | 'video'} | null>(null);

  const MAX_MEDIA = 20;
  const CAPTURE_HINTS = ['Living Room', 'Bedrooms', 'Bathrooms', 'Kitchen', 'Compound', 'Street View'];
  const PRIORITY_FEE_NAMES = ['Agency Fee', 'Caution Fee', 'Legal Fee'];

  // Payload State
  const [category, setCategory] = useState<'sale' | 'rent' | 'shortlet'>('rent');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propType, setPropType] = useState('');
  const [rentalDuration, setRentalDuration] = useState('per year');
  
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  
  const [bedrooms, setBedrooms] = useState<number | ''>('');
  const [bathrooms, setBathrooms] = useState<number | ''>('');
  
  const [mediaLinks, setMediaLinks] = useState<MediaUpload[]>([]);
  
  const [price, setPrice] = useState('');
  const [agencyFee, setAgencyFee] = useState('');
  const [cautionFee, setCautionFee] = useState('');
  const [legalFee, setLegalFee] = useState('');
  const [inspectionFee, setInspectionFee] = useState('');
  const [totalPackage, setTotalPackage] = useState('');
  
  const [otherFees, setOtherFees] = useState<{name: string, amount: string}[]>([]);
  const [features, setFeatures] = useState<string[]>([]);

  // Helpers for Arrays
  const removeMediaLink = async (i: number) => {
    const item = mediaLinks[i];
    if (!item) return;

    if (item.status === 'success' && item.url.startsWith('http')) {
      const toastId = toast.loading('Deleting media...');
      try {
        await ApiService.media.delete(item.url);
        toast.success('Media removed', { id: toastId });
      } catch (err) {
        console.error('Delete error', err);
        toast.error('Removed from list (server deletion failed)', { id: toastId });
      }
    }
    setMediaLinks(prev => prev.filter((_, idx) => idx !== i));
  };

  const addOtherFee = () => setOtherFees([...otherFees, { name: '', amount: '' }]);
  const updateFee = (i: number, key: 'name' | 'amount', val: string) => {
    const updated = [...otherFees];
    updated[i][key] = val;
    setOtherFees(updated);
  };
  const removeFee = (i: number) => setOtherFees(otherFees.filter((_, idx) => idx !== i));

  const toggleFeature = (feat: string) => {
    if (features.includes(feat)) {
      setFeatures(features.filter(f => f !== feat));
    } else {
      setFeatures([...features, feat]);
    }
  };

  const [customFeature, setCustomFeature] = useState('');
  const addCustomFeature = () => {
    if (customFeature.trim() && !features.includes(customFeature.trim())) {
      setFeatures([...features, customFeature.trim()]);
      setCustomFeature('');
    }
  };

  const searchParams = useSearchParams();
  const editId = searchParams ? searchParams.get('edit') : null;

  useEffect(() => {
    if (editId) {
      const loadProperty = async () => {
        try {
          // Check session storage first for immediate load
          const cached = sessionStorage.getItem('editProperty');
          if (cached) {
            const p = JSON.parse(cached);
            if (p.uuid === editId || p.id === editId) {
              prefillData(p);
              // Still fetch from BE in background to ensure data is fresh
              fetchProperty(true); 
              return;
            }
          }
          
          await fetchProperty(false);
        } catch (err) {
          console.error('Failed to load property', err);
        }
      };

      const fetchProperty = async (silent = false) => {
        try {
          if (!silent) setLoading(true);
          const res: any = await ApiService.properties.getOne(editId);
          if (res.success && res.data) {
            prefillData(res.data);
          }
        } catch (err) {
          if (!silent) toast.error('Failed to load property details');
        } finally {
          if (!silent) setLoading(false);
        }
      };

      const prefillData = (p: any) => {
        setDraftId(p.uuid || p.id);
        setStatus(p.status || 'draft');
        setCategory(p.property_category === 'sale' ? 'sale' : 'rent');
        setRentalDuration(p.rental_duration || 'per year');
        setTitle(p.title || '');
        setDescription(p.description || '');
        setPropType(p.house_type || '');
        setAddress(p.address || '');
        setCity(p.city || '');
        setState(p.state || '');
        setBedrooms(p.bedrooms || '');
        setBathrooms(p.bathrooms || '');
        setPrice(String(p.basic_rent || p.price || ''));
        setAgencyFee(String(p.agency_fee || ''));
        setCautionFee(String(p.caution_fee || ''));
        setLegalFee(String(p.legal_fee || ''));
        setInspectionFee(String(p.inspection_fee || ''));
        setTotalPackage(String(p.total_package || ''));
        setFeatures(p.features || []);
        setCoords({ lat: p.latitude ? parseFloat(p.latitude) : null, lng: p.longitude ? parseFloat(p.longitude) : null });
        
        if (p.media && Array.isArray(p.media)) {
          setMediaLinks(p.media.map((m: any) => ({ 
            id: m.id, 
            url: m.file_url, 
            status: 'success' 
          })));
        } else if (p.media_urls) {
          // Fallback for legacy data
          setMediaLinks(p.media_urls.map((url: string) => ({ url, status: 'success' })));
        }
        
        if (p.other_fees) {
          setOtherFees(p.other_fees.map((f: any) => ({ name: f.name || f.tag, amount: String(f.amount) })));
        }
      };

      loadProperty();
      
      // Cleanup sessionStorage to avoid prefilling on next "New Listing"
      return () => {
        sessionStorage.removeItem('editProperty');
      };
    }
  }, [editId]);

  // Auto-calculate Total Package
  useEffect(() => {
    const p = parseFloat(price) || 0;
    const af = parseFloat(agencyFee) || 0;
    const cf = parseFloat(cautionFee) || 0;
    const lf = parseFloat(legalFee) || 0;
    const inf = parseFloat(inspectionFee) || 0;
    const ofs = otherFees.reduce((acc, fee) => acc + (parseFloat(fee.amount) || 0), 0);
    
    setTotalPackage(String(p + af + cf + lf + inf + ofs));
  }, [price, agencyFee, cautionFee, legalFee, inspectionFee, otherFees]);

  // Default duration based on category
  useEffect(() => {
    if (category === 'shortlet') {
      setRentalDuration('per night');
    } else if (category === 'rent') {
      setRentalDuration('per year'); 
    } else {
      setRentalDuration('');
    }
  }, [category]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | File[]) => {
    let files: File[] = [];
    if (Array.isArray(e)) {
      files = e;
    } else {
      files = Array.from(e.target.files || []);
    }

    if (files.length === 0) return;

    const validFiles = files.filter(file => {
      const isLarge = file.size > 50 * 1024 * 1024;
      if (isLarge) toast.error(`${file.name} is too large (max 50MB)`);
      return !isLarge;
    });

    if (validFiles.length === 0) return;

    if (mediaLinks.length + validFiles.length > MAX_MEDIA) {
      toast.error(`You can only upload up to ${MAX_MEDIA} files.`);
      return;
    }

    // Add files to state with 'uploading' status
    const newItems: MediaUpload[] = validFiles.map(file => ({
      url: URL.createObjectURL(file), // Local preview
      status: 'uploading',
      file
    }));
    
    setMediaLinks(prev => [...prev, ...newItems]);

    // Upload files sequentially
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const currentIndex = mediaLinks.length + i;
      
      const formData = new FormData();
      formData.append('file', file);
      if (draftId) {
        formData.append('prefix', `properties/${draftId}`);
      }

      try {
        const res: any = await ApiService.media.upload(formData);
        if (res.success && res.data && res.data.length > 0) {
          const remoteUrl = res.data[0].url || res.data[0].path;
          const remoteId = res.data[0].id;
          setMediaLinks(prev => {
            const updated = [...prev];
            updated[currentIndex] = { 
              ...updated[currentIndex], 
              url: remoteUrl, 
              id: remoteId,
              status: 'success' 
            };
            return updated;
          });
          toast.success(`${file.name} uploaded!`);
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (err: any) {
        const errMsg = err.message || `Failed to upload ${file.name}`;
        console.error('Upload error', err);
        setMediaLinks(prev => {
          const updated = [...prev];
          updated[currentIndex] = { ...updated[currentIndex], status: 'error', error: errMsg };
          return updated;
        });
        toast.error(errMsg);
      }
    }
  };

  const startCamera = async () => {
    try {
      const constraints = {
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false 
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setCameraDialogOpen(true);
      
      // We need a small timeout to ensure the dialog and video ref are rendered
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.error("Video play failed", e));
        }
      }, 100);
    } catch (err) {
      console.error('Camera error', err);
      toast.error('Could not access camera. Please check permissions and ensure you are on HTTPS.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
    setCapturedMedia(null);
    setCameraDialogOpen(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            setCapturedMedia({
              blob,
              url: URL.createObjectURL(blob),
              type: 'image'
            });
          }
        }, 'image/jpeg', 0.95);
      }
    } else {
      toast.error('Camera not ready. Please wait a moment.');
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    recordedChunksRef.current = [];
    const options = { mimeType: 'video/webm;codecs=vp9,opus' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      delete (options as any).mimeType;
    }
    
    try {
      const recorder = new MediaRecorder(streamRef.current, options);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        setCapturedMedia({
          blob,
          url: URL.createObjectURL(blob),
          type: 'video'
        });
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      toast.success('Recording started');
    } catch (err) {
      console.error("Failed to start recorder", err);
      toast.error("Failed to start recording");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const addCapturedMedia = async () => {
    if (!capturedMedia) return;
    
    const file = new File(
      [capturedMedia.blob], 
      `capture_${Date.now()}.${capturedMedia.type === 'image' ? 'jpg' : 'webm'}`, 
      { type: capturedMedia.type === 'image' ? 'image/jpeg' : 'video/webm' }
    );
    
    // Check size again just in case
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Captured file is too large (>50MB)");
      return;
    }

    setCapturedMedia(null); // Clear preview
    await handleFileUpload([file]);
    toast.success(`${capturedMedia.type === 'image' ? 'Photo' : 'Video'} added!`);
  };

  const handleAutoSave = async () => {
    // Only auto-save if we have at least a title or category
    // And don't save on the first step (Basic Details)
    if (activeStep === 0) return;
    if (!title && !category) return;
    if (isSaving.current) return;
    
    isSaving.current = true;
    try {
      const payload = await buildPayload();
      if (draftId) {
        await ApiService.properties.update(draftId, payload);
      } else {
        const res: any = await ApiService.properties.create(payload);
        const id = res.data?.uuid || res.data?.id || res.uuid || res.id;
        if (id) setDraftId(id);
      }
    } catch (err) {
      console.error('Auto-save failed', err);
    } finally {
      isSaving.current = false;
    }
  };

  const handleNext = async () => {
    // Only save if we are leaving a step that is NOT the first one
    // or if we already have a draftId
    if (activeStep > 0 || draftId) {
      await handleAutoSave();
    }
    
    const nextStep = activeStep + 1;
    setActiveStep(nextStep);
    if (nextStep > completedStep) {
      setCompletedStep(nextStep);
    }
  };
  const handleBack = () => setActiveStep((s) => Math.max(s - 0, 0) ? s - 1 : 0);

  const handleStepClick = (index: number) => {
    if (index <= completedStep) {
      setActiveStep(index);
    }
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLocationDialogOpen(true);
  };

  const confirmCapture = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        toast.success('Current location captured!');
        setLocationDialogOpen(false);
      },
      (error) => {
        toast.error('Failed to get location. Please ensure permissions are granted.');
        setLocationDialogOpen(false);
      }
    );
  };

  // Geocoding Helper
  const geocodeAddress = async () => {
    const fullAddress = `${address}, ${city}, ${state}, Nigeria`;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
    } catch (err) {
      console.warn("Geocoding failed, falling back to null coordinates", err);
    }
    return { lat: null, lng: null };
  };

  const buildPayload = async () => {
    const result = await geocodeAddress();
    
    // Convert arrays correctly
    const finalMedia = mediaLinks
      .filter(item => item.status === 'success' && item.url.trim() !== '')
      .map(item => item.url);
    const finalFees = otherFees.filter(fee => fee.name.trim() !== '' && fee.amount.trim() !== '').map(fee => ({
      name: fee.name,
      amount: parseFloat(fee.amount)
    }));

    return {
      title,
      description,
      address,
      city,
      state,
      property_category: category,
      rental_duration: category === 'sale' ? null : rentalDuration,
      house_type: propType,
      bedrooms: bedrooms ? Number(bedrooms) : 0,
      bathrooms: bathrooms ? Number(bathrooms) : 0,
      basic_rent: parseFloat(price) || 0,
      agency_fee: parseFloat(agencyFee) || 0,
      caution_fee: parseFloat(cautionFee) || 0,
      legal_fee: parseFloat(legalFee) || 0,
      inspection_fee: parseFloat(inspectionFee) || 0,
      total_package: parseFloat(totalPackage) || parseFloat(price) || 0,
      other_fees: finalFees,
      features: features,
      media_ids: mediaLinks
        .filter(item => item.status === 'success' && item.id)
        .map(item => item.id),
      latitude: coords.lat || result.lat,
      longitude: coords.lng || result.lng
    };
  };

  const handleSaveDraft = async () => {
    if (!title || !price || !city || !state) {
      toast.error('Title, Price, City, and State are required to save a draft.');
      return;
    }
    setLoading(true);
    try {
      const payload = await buildPayload();
      await ApiService.properties.create(payload);
      toast.success('Draft saved successfully!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save draft');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !price || !city || !state || !address) {
      toast.error('Please fill in all required fields.');
      return;
    }
    
    setLoading(true);
    try {
      const payload = await buildPayload();
      let propertyUuid = draftId;

      // 1. If we have a draft, update it. If not, create it.
      if (propertyUuid) {
        await ApiService.properties.update(propertyUuid, payload);
      } else {
        const createRes: any = await ApiService.properties.create(payload);
        propertyUuid = createRes.data?.uuid || createRes.uuid;
      }
      
      if (propertyUuid) {
        // 2. Publish it if not already published
        if (status !== 'active') {
          await ApiService.properties.publish(propertyUuid);
          toast.success('Property published successfully!');
        } else {
          toast.success('Property updated successfully!');
        }
        router.push('/dashboard');
      } else {
        toast.error('Failed to get property ID for publishing.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to publish listing');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user || user.role !== 'agent') {
    return (
      <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 8 }}>
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider', py: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={() => router.push('/dashboard')} size="small" disabled={loading}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="subtitle1" fontWeight={700}>
                {activeStep === 0 ? 'New Listing' : steps[activeStep]}
              </Typography>
            </Box>
            <Button
              startIcon={<SaveOutlinedIcon />}
              onClick={handleSaveDraft}
              disabled={loading}
              sx={{ color: 'text.secondary', border: '1px solid', borderColor: 'divider' }}
              size="small"
            >
              Save Draft
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
          {steps.map((label, index) => (
            <Step key={label} completed={index < activeStep || index <= completedStep}>
              <StepLabel
                onClick={() => handleStepClick(index)}
                sx={{
                  cursor: index <= completedStep ? 'pointer' : 'default',
                  '& .MuiStepLabel-label': { 
                    fontFamily: '"Poppins", sans-serif', 
                    fontSize: '0.78rem', 
                    fontWeight: index === activeStep ? 700 : 500,
                    color: index <= completedStep ? 'text.primary' : 'text.disabled'
                  },
                  '& .MuiStepIcon-root.Mui-active': { color: 'primary.main' },
                  '& .MuiStepIcon-root.Mui-completed': { color: 'primary.main' },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" fontWeight={700} mb={3}>Basic Details</Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" fontWeight={700} mb={1.5}>Property Category</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {(['rent', 'sale', 'shortlet'] as const).map((c) => (
                      <Paper
                        key={c}
                        onClick={() => setCategory(c)}
                        elevation={0}
                        sx={{
                          px: 4,
                          py: 2,
                          cursor: 'pointer',
                          border: '2px solid',
                          borderColor: category === c ? 'primary.main' : 'divider',
                          borderRadius: 2.5,
                          bgcolor: category === c ? 'rgba(0,162,85,0.06)' : 'transparent',
                          transition: 'all 0.15s ease',
                          textAlign: 'center',
                        }}
                      >
                        <Typography fontWeight={700} color={category === c ? 'primary.main' : 'text.secondary'}>
                          {c === 'rent' ? 'For Rent' : c === 'sale' ? 'For Sale' : 'Shortlet'}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Listing Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    required
                    placeholder="e.g. Luxury 4-Bedroom Duplex in Lekki Phase 1"
                    helperText="Make it specific and descriptive"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Property Type</InputLabel>
                    <Select value={propType} onChange={(e) => setPropType(e.target.value)} label="Property Type">
                      {PROPERTY_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label="Bedrooms"
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value ? Number(e.target.value) : '')}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label="Bathrooms"
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value ? Number(e.target.value) : '')}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Describe the property, surrounding area, and what makes it unique..."
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" fontWeight={700} mb={3}>Location Details</Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Street Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    fullWidth
                    required
                    placeholder="e.g. 15 Admiralty Way, Lekki Phase 1"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth required>
                    <InputLabel>State</InputLabel>
                    <Select 
                      value={state} 
                      onChange={(e) => {
                        setState(e.target.value);
                        setCity(''); // Reset city when state changes
                      }} 
                      label="State"
                    >
                      {NIGERIAN_STATES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth required disabled={!state}>
                    <InputLabel>City / LGA</InputLabel>
                    <Select 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)} 
                      label="City / LGA"
                    >
                      {state && NIGERIAN_LOCATIONS[state]?.map((c) => (
                        <MenuItem key={c} value={c}>{c}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<MyLocationIcon />}
                  onClick={captureLocation}
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                  Capture Current GPS Location
                </Button>
                {coords.lat && (
                  <Chip 
                    label={`GPS: ${coords.lat.toFixed(4)}, ${coords.lng?.toFixed(4)}`} 
                    onDelete={() => setCoords({lat: null, lng: null})}
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>

              <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                Pinpointing the exact location helps agents and buyers find the property faster. 
                You can capture your current location if you are at the property now, or we'll use geocoding based on the address.
              </Alert>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" fontWeight={700} mb={1}>Media</Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Upload pictures and videos of the property (Max {MAX_MEDIA})
              </Typography>

              {/* Media Preview Grid */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
                {mediaLinks.map((item, i) => {
                  const mediaUrl = item.status === 'success' ? ApiService.getMediaUrl(item.url) : item.url;
                  const isVideo = item.url.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) || item.url.includes('video') || (item.file?.type.startsWith('video'));
                  
                  return (
                    <Paper
                      key={i}
                      elevation={0}
                      sx={{
                        position: 'relative',
                        aspectRatio: '4/3',
                        borderRadius: 2,
                        overflow: 'hidden',
                        bgcolor: 'grey.100',
                        border: '2px solid',
                        borderColor: item.status === 'success' ? 'success.main' : item.status === 'error' ? 'error.main' : 'divider',
                        '&:hover .delete-btn': { opacity: 1 },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {item.status === 'uploading' && (
                        <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(255,255,255,0.7)', zindex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CircularProgress size={24} color="primary" />
                        </Box>
                      )}

                      {isVideo ? (
                        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'black' }}>
                          <video src={mediaUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <PlayCircleOutlineIcon sx={{ position: 'absolute', color: 'white', fontSize: 40, opacity: 0.8 }} />
                        </Box>
                      ) : (
                        <img
                          src={mediaUrl}
                          alt={`Property ${i + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                      
                      {item.status === 'error' && (
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            bottom: 0, 
                            left: 0, 
                            right: 0, 
                            bgcolor: 'rgba(211, 47, 47, 0.85)', 
                            color: 'white', 
                            p: 0.5, 
                            textAlign: 'center',
                            cursor: 'pointer'
                          }}
                          onClick={() => toast.error(item.error || 'Upload failed')}
                        >
                          <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: 600 }}>Failed (Click for info)</Typography>
                        </Box>
                      )}

                      <IconButton
                        size="small"
                        className="delete-btn"
                        onClick={() => removeMediaLink(i)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'rgba(255,255,255,0.9)',
                          opacity: { xs: 1, md: 0 },
                          '&:hover': { bgcolor: 'error.main', color: 'white' },
                          transition: 'all 0.2s',
                          zindex: 3
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Paper>
                  );
                })}
                
                {mediaLinks.length < MAX_MEDIA && (
                  <Box
                    sx={{
                      aspectRatio: '4/3',
                      borderRadius: 2,
                      border: '2px dashed',
                      borderColor: 'divider',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(0,162,85,0.02)' },
                      position: 'relative'
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleFileUpload}
                      style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                    />
                    <CloudUploadIcon sx={{ color: 'text.secondary', mb: 1 }} />
                    <Typography variant="caption" fontWeight={600} color="text.secondary">Add Media</Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                <input
                  type="file"
                  accept="image/*,video/*"
                  id="media-upload"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
                <label htmlFor="media-upload">
                  <Button component="span" startIcon={<CloudUploadIcon />} variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                    Upload Files
                  </Button>
                </label>

                <Button 
                  startIcon={<PhotoCameraIcon />} 
                  variant="outlined" 
                  size="small" 
                  onClick={startCamera}
                  sx={{ borderRadius: 2, color: 'secondary.main', borderColor: 'secondary.main' }}
                >
                  Live Capture
                </Button>
              </Box>

              <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} mb={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  💡 Capture Hints
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {CAPTURE_HINTS.map(hint => (
                    <Chip key={hint} label={hint} size="small" variant="outlined" sx={{ bgcolor: 'white' }} />
                  ))}
                </Box>
              </Box>
            </Box>
          )}

          {activeStep === 3 && (
            <Box>
              <Typography variant="h6" fontWeight={700} mb={3}>Pricing & Fees</Typography>
              <Grid container spacing={3}>
                {category !== 'sale' && (
                  <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth sx={{ maxWidth: 300, mb: 1 }}>
                      <InputLabel>Rental Duration</InputLabel>
                      <Select
                        value={rentalDuration}
                        onChange={(e) => setRentalDuration(e.target.value)}
                        label="Rental Duration"
                        size="small"
                      >
                        <MenuItem value="">Not Specified</MenuItem>
                        <MenuItem value="per year">Per Year</MenuItem>
                        <MenuItem value="per month">Per Month</MenuItem>
                        <MenuItem value="per week">Per Week</MenuItem>
                        <MenuItem value="per night">Per Night</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label={category === 'rent' ? 'Basic Rent (₦)' : 'Sale Price (₦)'}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    fullWidth
                    required
                    type="number"
                    InputProps={{ startAdornment: <InputAdornment position="start">₦</InputAdornment> }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label="Inspection Fee (₦)"
                    value={inspectionFee}
                    onChange={(e) => setInspectionFee(e.target.value)}
                    fullWidth
                    type="number"
                    InputProps={{ startAdornment: <InputAdornment position="start">₦</InputAdornment> }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label="Total Package (₦)"
                    value={totalPackage}
                    fullWidth
                    disabled
                    helperText="Auto-calculated total cost"
                    InputProps={{ 
                      startAdornment: <InputAdornment position="start">₦</InputAdornment>,
                      sx: { fontWeight: 800, color: 'primary.main', bgcolor: 'rgba(0,162,85,0.05)' }
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} mb={1.5}>Priority Fees (Optional)</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                  {PRIORITY_FEE_NAMES.map((feeName) => {
                    const isAdded = (feeName === 'Agency Fee' && agencyFee !== '') || 
                                    (feeName === 'Caution Fee' && cautionFee !== '') || 
                                    (feeName === 'Legal Fee' && legalFee !== '');
                    if (isAdded) return null;
                    return (
                      <Chip
                        key={feeName}
                        label={`+ ${feeName}`}
                        size="small"
                        clickable
                        onClick={() => {
                          if (feeName === 'Agency Fee') setAgencyFee('0');
                          if (feeName === 'Caution Fee') setCautionFee('0');
                          if (feeName === 'Legal Fee') setLegalFee('0');
                        }}
                        sx={{ bgcolor: 'primary.50', color: 'primary.main', border: '1px dashed', borderColor: 'primary.main' }}
                      />
                    );
                  })}
                </Box>

                <Grid container spacing={2}>
                  {agencyFee !== '' && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextField
                          label="Agency Fee (₦)"
                          value={agencyFee}
                          onChange={(e) => setAgencyFee(e.target.value)}
                          fullWidth
                          size="small"
                          type="number"
                          InputProps={{ startAdornment: <InputAdornment position="start">₦</InputAdornment> }}
                        />
                        <IconButton size="small" onClick={() => setAgencyFee('')} color="error"><DeleteOutlineIcon fontSize="small" /></IconButton>
                      </Box>
                    </Grid>
                  )}
                  {cautionFee !== '' && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextField
                          label="Caution Fee (₦)"
                          value={cautionFee}
                          onChange={(e) => setCautionFee(e.target.value)}
                          fullWidth
                          size="small"
                          type="number"
                          InputProps={{ startAdornment: <InputAdornment position="start">₦</InputAdornment> }}
                        />
                        <IconButton size="small" onClick={() => setCautionFee('')} color="error"><DeleteOutlineIcon fontSize="small" /></IconButton>
                      </Box>
                    </Grid>
                  )}
                  {legalFee !== '' && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextField
                          label="Legal Fee (₦)"
                          value={legalFee}
                          onChange={(e) => setLegalFee(e.target.value)}
                          fullWidth
                          size="small"
                          type="number"
                          InputProps={{ startAdornment: <InputAdornment position="start">₦</InputAdornment> }}
                        />
                        <IconButton size="small" onClick={() => setLegalFee('')} color="error"><DeleteOutlineIcon fontSize="small" /></IconButton>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={700}>Other Fees & Charges</Typography>
                <Button startIcon={<AddIcon />} onClick={addOtherFee} size="small" sx={{ color: 'primary.main' }}>
                  Add Fee
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {PREDEFINED_FEE_NAMES.map((feeName) => (
                  <Chip
                    key={feeName}
                    label={`+ ${feeName}`}
                    size="small"
                    clickable
                    onClick={() => setOtherFees([...otherFees, { name: feeName, amount: '' }])}
                    sx={{ bgcolor: 'grey.50', border: '1px dashed #ccc', '&:hover': { bgcolor: 'primary.main', color: 'white', border: '1px solid primary.main' }, transition: 'all 0.15s ease' }}
                  />
                ))}
              </Box>

              {otherFees.map((fee, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: 2, alignItems: 'center', animation: 'fadeIn 0.3s ease' }}>
                  <TextField
                    label="Fee Name"
                    value={fee.name}
                    onChange={(e) => updateFee(i, 'name', e.target.value)}
                    sx={{ flex: 1 }}
                    size="small"
                  />
                  <TextField
                    label="Amount (₦)"
                    value={fee.amount}
                    onChange={(e) => updateFee(i, 'amount', e.target.value)}
                    type="number"
                    sx={{ flex: 1 }}
                    size="small"
                    InputProps={{ startAdornment: <InputAdornment position="start">₦</InputAdornment> }}
                  />
                  <IconButton onClick={() => removeFee(i)} color="error" size="small">
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}

          {activeStep === 4 && (
            <Box>
              <Typography variant="h6" fontWeight={700} mb={2}>Property Features</Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Select the amenities and features available in this property.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 4 }}>
                {PREDEFINED_FEATURES.map((feat) => {
                  const isSelected = features.includes(feat);
                  return (
                    <Chip
                      key={feat}
                      label={feat}
                      clickable
                      onClick={() => toggleFeature(feat)}
                      color={isSelected ? 'primary' : 'default'}
                      variant={isSelected ? 'filled' : 'outlined'}
                      sx={{ 
                        fontWeight: isSelected ? 600 : 400,
                        transition: 'all 0.2s ease',
                        borderWidth: isSelected ? 0 : 1
                      }}
                    />
                  );
                })}
                {features.filter(f => !PREDEFINED_FEATURES.includes(f)).map((feat) => (
                  <Chip
                    key={feat}
                    label={feat}
                    clickable
                    onDelete={() => toggleFeature(feat)}
                    color="primary"
                    variant="filled"
                    sx={{ fontWeight: 600 }}
                  />
                ))}
              </Box>

              <Divider sx={{ my: 3 }} />
              
              <Typography variant="subtitle2" fontWeight={700} mb={1.5}>Add Custom Feature</Typography>
              <Box sx={{ display: 'flex', gap: 1.5, maxWidth: 400 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="e.g. Solar Panels"
                  value={customFeature}
                  onChange={(e) => setCustomFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomFeature()}
                />
                <Button variant="contained" onClick={addCustomFeature} sx={{ flexShrink: 0 }}>
                  Add
                </Button>
              </Box>

              <Alert severity="success" sx={{ mt: 5 }}>
                Features added! Proceed to the next step to review your listing.
              </Alert>
            </Box>
          )}

          {activeStep === 5 && (
            <Box>
              <Typography variant="h6" fontWeight={700} mb={3}>Review Listing</Typography>
              
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 7 }}>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="overline" color="text.secondary" fontWeight={700}>Basic Info</Typography>
                    <Typography variant="h5" fontWeight={800} sx={{ color: 'primary.main', mb: 1 }}>{title || 'Untitled Listing'}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip label={category === 'rent' ? 'For Rent' : 'For Sale'} size="small" color="secondary" />
                      <Chip label={propType} size="small" variant="outlined" />
                      {bedrooms && <Chip label={`${bedrooms} Bedrooms`} size="small" variant="outlined" />}
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>{description}</Typography>
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Typography variant="overline" color="text.secondary" fontWeight={700}>Location</Typography>
                    <Typography variant="subtitle1" fontWeight={700}>{address}</Typography>
                    <Typography variant="body2" color="text.secondary">{city}, {state}</Typography>
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Typography variant="overline" color="text.secondary" fontWeight={700}>Features</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {features.map(f => <Chip key={f} label={f} size="small" sx={{ bgcolor: 'rgba(0,162,85,0.05)', color: 'primary.main', fontWeight: 600 }} />)}
                      {features.length === 0 && <Typography variant="body2" color="text.secondary">No features added</Typography>}
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                  <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle1" fontWeight={800} mb={2}>Price Summary</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="text.secondary">Basic {category === 'rent' ? 'Rent' : 'Price'}</Typography>
                        <Typography fontWeight={700}>₦{Number(price).toLocaleString()}</Typography>
                      </Box>
                      {agencyFee && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography color="text.secondary">Agency Fee</Typography>
                          <Typography fontWeight={700}>₦{Number(agencyFee).toLocaleString()}</Typography>
                        </Box>
                      )}
                      {cautionFee && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography color="text.secondary">Caution Fee</Typography>
                          <Typography fontWeight={700}>₦{Number(cautionFee).toLocaleString()}</Typography>
                        </Box>
                      )}
                      {legalFee && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography color="text.secondary">Legal Fee</Typography>
                          <Typography fontWeight={700}>₦{Number(legalFee).toLocaleString()}</Typography>
                        </Box>
                      )}
                      {inspectionFee && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography color="text.secondary">Inspection Fee</Typography>
                          <Typography fontWeight={700}>₦{Number(inspectionFee).toLocaleString()}</Typography>
                        </Box>
                      )}
                      {otherFees.map((f, i) => (
                        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography color="text.secondary">{f.name}</Typography>
                          <Typography fontWeight={700}>₦{Number(f.amount).toLocaleString()}</Typography>
                        </Box>
                      ))}
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography fontWeight={800} color="primary.main">Total Package</Typography>
                        <Typography fontWeight={800} color="primary.main" variant="h6">₦{Number(totalPackage || price).toLocaleString()}</Typography>
                      </Box>
                    </Box>
                  </Paper>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="overline" color="text.secondary" fontWeight={700}>Media ({mediaLinks.length})</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mt: 1 }}>
                      {mediaLinks.filter(m => m.status === 'success').slice(0, 6).map((item, i) => (
                        <Box 
                          key={i} 
                          sx={{ 
                            aspectRatio: '1', 
                            borderRadius: 1, 
                            overflow: 'hidden', 
                            bgcolor: 'grey.200',
                            position: 'relative'
                          }}
                        >
                          <img src={ApiService.getMediaUrl(item.url)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {i === 5 && mediaLinks.filter(m => m.status === 'success').length > 6 && (
                            <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                              <Typography variant="subtitle2">+{mediaLinks.filter(m => m.status === 'success').length - 6}</Typography>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Alert severity="success" sx={{ mt: 5, borderRadius: 2 }}>
                Everything looks good! Click <strong>Publish Listing</strong> to make it live.
              </Alert>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0 || loading}
              variant="outlined"
              sx={{ borderColor: 'divider', color: 'text.secondary', px: 4 }}
            >
              Back
            </Button>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                variant="contained"
                onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                disabled={loading}
                sx={{
                  bgcolor: activeStep === steps.length - 1 ? 'primary.main' : 'secondary.main',
                  px: 4,
                  minWidth: 140,
                  '&:hover': { bgcolor: activeStep === steps.length - 1 ? 'primary.dark' : 'secondary.dark' },
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : activeStep === steps.length - 1 ? (
                  status === 'active' ? 'Update Listing' : 'Publish Listing'
                ) : (
                  'Continue'
                )}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>

      <Dialog open={cameraDialogOpen} onClose={stopCamera} maxWidth="sm" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: 3, overflow: 'hidden' } }}>
        <Box sx={{ position: 'relative', bgcolor: 'black', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {capturedMedia ? (
            capturedMedia.type === 'image' ? (
              <img src={capturedMedia.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <video src={capturedMedia.url} controls autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )
          ) : (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          )}
          
          <IconButton onClick={stopCamera} sx={{ position: 'absolute', top: 12, right: 12, color: 'white', bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}>
            <CloseIcon />
          </IconButton>

          {!capturedMedia && (
            <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 1, bgcolor: 'rgba(0,0,0,0.5)', p: 0.5, borderRadius: 2 }}>
              <Button 
                size="small" 
                onClick={() => setCameraMode('photo')}
                sx={{ color: cameraMode === 'photo' ? 'primary.main' : 'white', fontWeight: 700 }}
              >
                Photo
              </Button>
              <Button 
                size="small" 
                onClick={() => setCameraMode('video')}
                sx={{ color: cameraMode === 'video' ? 'primary.main' : 'white', fontWeight: 700 }}
              >
                Video
              </Button>
            </Box>
          )}

          <Box sx={{ position: 'absolute', bottom: 24, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 2 }}>
            {capturedMedia ? (
              <>
                <Button 
                  variant="contained" 
                  onClick={() => setCapturedMedia(null)}
                  sx={{ bgcolor: 'white', color: 'text.primary', '&:hover': { bgcolor: 'grey.200' }, fontWeight: 700 }}
                >
                  Retake
                </Button>
                <Button 
                  variant="contained" 
                  onClick={addCapturedMedia}
                  sx={{ fontWeight: 700 }}
                >
                  Add Media
                </Button>
              </>
            ) : (
              cameraMode === 'photo' ? (
                <Button 
                  variant="contained" 
                  onClick={capturePhoto}
                  sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'white', color: 'primary.main', border: '4px solid', borderColor: 'rgba(255,255,255,0.3)', '&:hover': { bgcolor: 'grey.200' } }}
                >
                  <PhotoCameraIcon />
                </Button>
              ) : (
                <Button 
                  variant="contained" 
                  onClick={isRecording ? stopRecording : startRecording}
                  sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: isRecording ? 'error.main' : 'white', color: isRecording ? 'white' : 'error.main', border: '4px solid', borderColor: 'rgba(255,255,255,0.3)', '&:hover': { bgcolor: isRecording ? 'error.dark' : 'grey.200' } }}
                >
                  {isRecording ? <RadioButtonCheckedIcon /> : <FiberManualRecordIcon />}
                </Button>
              )
            )}
          </Box>
        </Box>
        <Box sx={{ p: 2, bgcolor: 'white', textAlign: 'center' }}>
          <Typography variant="subtitle2" fontWeight={700}>
            {capturedMedia ? 'Review Media' : cameraMode === 'photo' ? 'Live Photo Capture' : 'Live Video Capture'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {capturedMedia ? 'Confirm to add this to your listing' : isRecording ? 'Recording in progress...' : `Switch modes above for photos or short videos (max 50MB)`}
          </Typography>
        </Box>
      </Dialog>
      
      <Dialog open={locationDialogOpen} onClose={() => setLocationDialogOpen(false)} sx={{ '& .MuiDialog-paper': { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Record Current Location?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This will record your current GPS coordinates (Latitude & Longitude) as the exact location of this property. 
            Only use this if you are currently physically present at the property.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setLocationDialogOpen(false)} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
          <Button onClick={confirmCapture} variant="contained" sx={{ borderRadius: 2, fontWeight: 700 }}>Confirm & Capture</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
