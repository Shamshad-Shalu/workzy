import { useState } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  MapPin,
  Clock,
  Award,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Zap,
} from 'lucide-react';

// ============================================
// API DATA STRUCTURE (Replace with actual API calls)
// ============================================
const API_DATA = {
  services: [
    {
      id: '1',
      title: 'AC Installation & Repair',
      categoryId: 'electrical',
      categoryName: 'Electrical Work',
      categoryImage: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80',
      description:
        'Expert AC installation, servicing, gas filling, and emergency repairs for all brands',
      rate: 250,
      experience: 12,
      estimatedDuration: 90,
      maxTravelRadius: 20,
      isAvailable: true,
      allowSuddenBooking: true,
      bulkDiscounts: [{ count: 3, percent: 10 }],
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      title: 'Complete Home Wiring & Rewiring',
      categoryId: 'electrical',
      categoryName: 'Electrical Work',
      categoryImage: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80',
      description:
        'Safe and certified electrical wiring for new homes, rewiring old properties with quality materials',
      rate: 180,
      experience: 15,
      estimatedDuration: 480,
      maxTravelRadius: 15,
      isAvailable: true,
      allowSuddenBooking: false,
      bulkDiscounts: [],
      createdAt: '2024-01-10T14:20:00Z',
    },
    {
      id: '3',
      title: 'Bathroom & Kitchen Plumbing Fix',
      categoryId: 'plumbing',
      categoryName: 'Plumbing',
      categoryImage: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&q=80',
      description:
        'Leaking taps, pipe repair, drain cleaning, and complete bathroom/kitchen plumbing solutions',
      rate: 150,
      experience: 8,
      estimatedDuration: 120,
      maxTravelRadius: 25,
      isAvailable: false,
      allowSuddenBooking: true,
      bulkDiscounts: [{ count: 2, percent: 5 }],
      createdAt: '2024-01-08T09:15:00Z',
    },
    {
      id: '4',
      title: 'Water Heater Installation & Repair',
      categoryId: 'plumbing',
      categoryName: 'Plumbing',
      categoryImage: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&q=80',
      description:
        'Geyser installation, repair, element replacement for all brands (Racold, AO Smith, Bajaj)',
      rate: 200,
      experience: 10,
      estimatedDuration: 60,
      maxTravelRadius: 18,
      isAvailable: true,
      allowSuddenBooking: true,
      bulkDiscounts: [],
      createdAt: '2024-01-12T11:45:00Z',
    },
    {
      id: '5',
      title: 'Ceiling Fan Installation & Repair',
      categoryId: 'electrical',
      categoryName: 'Electrical Work',
      categoryImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
      description:
        'Fan installation, regulator repair, noise fixing, blade balancing for all fan types',
      rate: 120,
      experience: 6,
      estimatedDuration: 45,
      maxTravelRadius: 30,
      isAvailable: true,
      allowSuddenBooking: true,
      bulkDiscounts: [{ count: 5, percent: 15 }],
      createdAt: '2024-01-20T16:00:00Z',
    },
    {
      id: '6',
      title: 'Modular Kitchen Installation',
      categoryId: 'carpentry',
      categoryName: 'Carpentry',
      categoryImage: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&q=80',
      description:
        'Complete modular kitchen setup, cabinet installation, hardware fitting with precision',
      rate: 300,
      experience: 14,
      estimatedDuration: 720,
      maxTravelRadius: 12,
      isAvailable: true,
      allowSuddenBooking: false,
      bulkDiscounts: [],
      createdAt: '2024-01-05T08:30:00Z',
    },
    {
      id: '7',
      title: 'Interior Wall Painting',
      categoryId: 'painting',
      categoryName: 'Painting',
      categoryImage: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&q=80',
      description:
        'Professional interior painting with Asian Paints, Berger - smooth finish guaranteed',
      rate: 100,
      experience: 9,
      estimatedDuration: 480,
      maxTravelRadius: 20,
      isAvailable: true,
      allowSuddenBooking: false,
      bulkDiscounts: [{ count: 2, percent: 8 }],
      createdAt: '2024-01-18T13:20:00Z',
    },
    {
      id: '8',
      title: 'RO Water Purifier Service',
      categoryId: 'appliance',
      categoryName: 'Appliance Repair',
      categoryImage: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&q=80',
      description:
        'RO filter replacement, membrane cleaning, installation for Kent, Aquaguard, Pureit',
      rate: 180,
      experience: 7,
      estimatedDuration: 90,
      maxTravelRadius: 22,
      isAvailable: true,
      allowSuddenBooking: true,
      bulkDiscounts: [],
      createdAt: '2024-01-22T10:10:00Z',
    },
  ],

  categories: [
    { id: 'all', name: 'All Categories' },
    { id: 'electrical', name: 'Electrical Work' },
    { id: 'plumbing', name: 'Plumbing' },
    { id: 'carpentry', name: 'Carpentry' },
    { id: 'painting', name: 'Painting' },
    { id: 'appliance', name: 'Appliance Repair' },
  ],
};

export default function DummyWorkerServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter and sort
  const filteredServices = API_DATA.services
    .filter(service => {
      const matchesSearch =
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && service.isAvailable) ||
        (statusFilter === 'inactive' && !service.isAvailable);
      const matchesCategory = categoryFilter === 'all' || service.categoryId === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'rate-high') {
        return b.rate - a.rate;
      }
      if (sortBy === 'rate-low') {
        return a.rate - b.rate;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: API_DATA.services.length,
    active: API_DATA.services.filter(s => s.isAvailable).length,
    inactive: API_DATA.services.filter(s => !s.isAvailable).length,
    avgRate: Math.round(
      API_DATA.services.reduce((sum, s) => sum + s.rate, 0) / API_DATA.services.length
    ),
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="section-container py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Services</h1>
              <p className="text-muted-foreground">
                Manage your service offerings and availability
              </p>
            </div>
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
              <Plus className="w-5 h-5" />
              Add New Service
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-section-blue border border-section-blue-border rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-fine-blue/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-fine-blue" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Services</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-section-green border border-section-green-border rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-500/10 rounded-lg">
                  <Zap className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-foreground">{stats.active}</p>
                </div>
              </div>
            </div>

            <div className="bg-section-red border border-section-red-border rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-500/10 rounded-lg">
                  <Clock className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold text-foreground">{stats.inactive}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-golden/10 rounded-lg">
                  <DollarSign className="w-5 h-5 text-golden" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Rate</p>
                  <p className="text-2xl font-bold text-foreground">₹{stats.avgRate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-container py-8">
        {/* Filters */}
        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by service name or description..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Status */}
            <div className="md:col-span-2 relative">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full h-10 pl-3 pr-10 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Category */}
            <div className="md:col-span-3 relative">
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="w-full h-10 pl-3 pr-10 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
              >
                {API_DATA.categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="md:col-span-2 relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="w-full h-10 pl-3 pr-10 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
              >
                <option value="newest">Newest</option>
                <option value="rate-high">Rate ↓</option>
                <option value="rate-low">Rate ↑</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {paginatedServices.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-16 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No services found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or add a new service
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
              <Plus className="w-5 h-5" />
              Add Your First Service
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} -{' '}
                  {Math.min(currentPage * itemsPerPage, filteredServices.length)} of{' '}
                  {filteredServices.length}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === idx + 1
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ServiceCard({ service }: { service: any }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={service.categoryImage}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              service.isAvailable ? 'bg-green-500/90 text-white' : 'bg-gray-500/90 text-white'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${service.isAvailable ? 'bg-white' : 'bg-gray-300'}`}
            />
            {service.isAvailable ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {service.allowSuddenBooking && (
            <span className="px-2.5 py-1 bg-orange-500/90 text-white rounded-full text-xs font-semibold">
              Instant
            </span>
          )}
          {service.bulkDiscounts.length > 0 && (
            <span className="px-2.5 py-1 bg-blue-500/90 text-white rounded-full text-xs font-semibold">
              Bulk
            </span>
          )}
        </div>

        {/* Category */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-medium text-gray-900">
            {service.categoryName}
          </span>
        </div>

        {/* Menu */}
        <div className="absolute bottom-3 right-3">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 bg-white/95 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-700" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-32 z-10">
              <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">{service.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{service.description}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Award className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs text-muted-foreground">Experience</p>
            <p className="text-sm font-semibold text-foreground">{service.experience}y</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="text-sm font-semibold text-foreground">{service.estimatedDuration}m</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs text-muted-foreground">Radius</p>
            <p className="text-sm font-semibold text-foreground">{service.maxTravelRadius}km</p>
          </div>
        </div>

        {/* Rate */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">₹{service.rate}</p>
            <p className="text-xs text-muted-foreground">per hour</p>
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
            Edit Service
          </button>
        </div>
      </div>
    </div>
  );
}
