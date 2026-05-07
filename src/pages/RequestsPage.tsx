import React, { useEffect, useState } from 'react';
import { requestService } from '../services/requestService';
import { PropertyRequest } from '../types/propertyRequest';
import { Search, MapPin, Clock, Phone, User, Home, Tag, Home as HomeIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';

const RequestsPage: React.FC = () => {
    const [requests, setRequests] = useState<PropertyRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [draftFilters, setDraftFilters] = useState({ category: 'all', house_type: '', city: '', state: '' });
    const [appliedFilters, setAppliedFilters] = useState({ category: 'all', house_type: '', city: '', state: '' });

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await requestService.getRequests({
                category: appliedFilters.category === 'all' ? undefined : appliedFilters.category,
                house_type: appliedFilters.house_type,
                city: appliedFilters.city,
                state: appliedFilters.state,
                page
            });
            setRequests(data.data);
            setTotalPages(data.last_page);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [page, appliedFilters]);

    const handleSearch = () => {
        setAppliedFilters(draftFilters);
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-12 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">
                            House <span className="text-blue-600">Requests</span>
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl">
                            Browse what people are looking for. If you have a matching property, 
                            reach out and close the deal.
                        </p>
                    </div>
                    <button
                        onClick={() => toast.info('Submit Request feature is coming soon!')}
                        className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-sm whitespace-nowrap"
                    >
                        Submit Request
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-10">
                    {/* Category Toggle */}
                    <div className="flex justify-center md:justify-start gap-2 mb-6">
                        {['all', 'rent', 'sale'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setDraftFilters({ ...draftFilters, category: cat })}
                                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                                    draftFilters.category === cat
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {cat === 'all' ? 'All Requests' : cat === 'rent' ? 'For Rent' : 'For Sale'}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div className="relative">
                            <HomeIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="House Type (e.g. Duplex)"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                value={draftFilters.house_type}
                                onChange={(e) => setDraftFilters({ ...draftFilters, house_type: e.target.value })}
                            />
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="City"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                value={draftFilters.city}
                                onChange={(e) => setDraftFilters({ ...draftFilters, city: e.target.value })}
                            />
                        </div>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="State"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                value={draftFilters.state}
                                onChange={(e) => setDraftFilters({ ...draftFilters, state: e.target.value })}
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm flex justify-center items-center gap-2"
                        >
                            <Search className="w-5 h-5" /> Search Requests
                        </button>
                    </div>
                </div>

                {/* Requests List */}
                {loading && page === 1 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-2xl h-48 animate-pulse shadow-sm border border-slate-100"></div>
                        ))}
                    </div>
                ) : requests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {requests.map((request) => (
                            <div key={request.uuid} className="group bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-blue-200 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2 text-xs font-medium px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                                        <Tag className="w-3 h-3" />
                                        {request.house_type || 'General Request'}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-slate-400">
                                        <Clock className="w-3 h-3" />
                                        {formatDistanceToNow(new Date(request.updated_at), { addSuffix: true })}
                                    </div>
                                </div>

                                <p className="text-slate-800 text-lg font-medium mb-4 line-clamp-3 leading-relaxed">
                                    "{request.message_text}"
                                </p>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        <span className="truncate">{request.city || 'Anywhere'}, {request.state || 'NG'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <User className="w-4 h-4 text-slate-400" />
                                        <span className="truncate">{request.requester_name || 'Anonymous'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Tag className="w-4 h-4 text-slate-400" />
                                        <span>Budget: {request.budget || 'Negotiable'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                                        <Phone className="w-4 h-4" />
                                        <a href={`tel:${request.requester_phone}`} className="hover:underline">
                                            Contact Now
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <Home className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900">No requests found</h3>
                        <p className="text-slate-500">Try adjusting your filters or check back later.</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-12 flex justify-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-10 h-10 rounded-lg font-medium transition-all ${
                                    page === p 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestsPage;
