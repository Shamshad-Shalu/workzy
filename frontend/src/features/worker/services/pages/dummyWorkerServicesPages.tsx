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
  X,
  Zap,
} from 'lucide-react';

// ============================================
// CONSTANTS
// ============================================
const SERVICE_TYPE = {
  SMALL_TASK: 'Small Task',
  MAJOR_PROJECT: 'Major Project',
  CONSULTATION: 'Consultation',
  REMOTE: 'Remote',
} as const;

const PRICING_MODE = {
  FIXED: 'fixed',
  PER_UNIT: 'per_unit',
  PER_DAY: 'per_day',
} as const;

const BULK_DISCOUNT = {
  MIN_COUNT: 2,
  MAX_COUNT: 10,
  MIN_PERCENT: 1,
  MAX_PERCENT: 50,
};

// ============================================
// API DATA STRUCTURE
// ============================================
const API_DATA = {
  // Category hierarchy: Level 1 → Level 2 → Level 3
  categoryHierarchy: [
    {
      id: 'home-appliance',
      name: 'Home & Appliance',
      level: 1,
      children: [
        {
          id: 'electrical',
          name: 'Electrical Work',
          level: 2,
          parentId: 'home-appliance',
          baseRate: 150,
          travelRatePerKM: 5,
          serviceType: SERVICE_TYPE.SMALL_TASK,
          pricingMode: PRICING_MODE.PER_UNIT,
          children: [
            { id: 'elec-1', name: 'AC Installation & Repair', level: 3, parentId: 'electrical' },
            { id: 'elec-2', name: 'Complete Home Wiring', level: 3, parentId: 'electrical' },
            { id: 'elec-3', name: 'Ceiling Fan Installation', level: 3, parentId: 'electrical' },
            { id: 'elec-4', name: 'Switchboard Repair', level: 3, parentId: 'electrical' },
          ],
        },
        {
          id: 'plumbing',
          name: 'Plumbing',
          level: 2,
          parentId: 'home-appliance',
          baseRate: 120,
          travelRatePerKM: 4,
          serviceType: SERVICE_TYPE.SMALL_TASK,
          pricingMode: PRICING_MODE.PER_UNIT,
          children: [
            {
              id: 'plumb-1',
              name: 'Bathroom & Kitchen Plumbing Fix',
              level: 3,
              parentId: 'plumbing',
            },
            { id: 'plumb-2', name: 'Water Heater Installation', level: 3, parentId: 'plumbing' },
            { id: 'plumb-3', name: 'Pipe Leakage Repair', level: 3, parentId: 'plumbing' },
          ],
        },
        {
          id: 'appliance',
          name: 'Appliance Repair',
          level: 2,
          parentId: 'home-appliance',
          baseRate: 180,
          travelRatePerKM: 6,
          serviceType: SERVICE_TYPE.SMALL_TASK,
          pricingMode: PRICING_MODE.FIXED,
          children: [
            { id: 'app-1', name: 'RO Water Purifier Service', level: 3, parentId: 'appliance' },
            { id: 'app-2', name: 'Washing Machine Repair', level: 3, parentId: 'appliance' },
          ],
        },
      ],
    },
    {
      id: 'construction',
      name: 'Construction & Renovation',
      level: 1,
      children: [
        {
          id: 'carpentry',
          name: 'Carpentry',
          level: 2,
          parentId: 'construction',
          baseRate: 200,
          travelRatePerKM: 7,
          serviceType: SERVICE_TYPE.MAJOR_PROJECT,
          pricingMode: PRICING_MODE.PER_DAY,
          children: [
            { id: 'carp-1', name: 'Modular Kitchen Installation', level: 3, parentId: 'carpentry' },
            { id: 'carp-2', name: 'Furniture Repair', level: 3, parentId: 'carpentry' },
          ],
        },
        {
          id: 'painting',
          name: 'Painting',
          level: 2,
          parentId: 'construction',
          baseRate: 100,
          travelRatePerKM: 3,
          serviceType: SERVICE_TYPE.MAJOR_PROJECT,
          pricingMode: PRICING_MODE.PER_DAY,
          children: [
            { id: 'paint-1', name: 'Interior Wall Painting', level: 3, parentId: 'painting' },
            { id: 'paint-2', name: 'Exterior Wall Painting', level: 3, parentId: 'painting' },
          ],
        },
      ],
    },
  ],

  services: [
    {
      _id: '1',
      workerId: 'worker-1',
      categoryId: 'elec-1',
      serviceName: 'AC Installation & Repair',
      serviceType: SERVICE_TYPE.SMALL_TASK,
      pricingMode: PRICING_MODE.PER_UNIT,
      imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80',
      rate: 250,
      description:
        'Expert AC installation, servicing, gas filling, and emergency repairs for all brands',
      experience: 12,
      estimatedDuration: 90,
      bufferTime: 15,
      maxTravelRadius: 20,
      isAvailable: true,
      allowSuddenBooking: true,
      maxTravelCost: 100,
      bulkDiscounts: [
        { count: 3, percent: 10 },
        { count: 5, percent: 15 },
      ],
      createdAt: new Date('2024-01-15T10:30:00Z'),
    },
    {
      _id: '2',
      workerId: 'worker-1',
      categoryId: 'elec-2',
      serviceName: 'Complete Home Wiring',
      serviceType: SERVICE_TYPE.MAJOR_PROJECT,
      pricingMode: PRICING_MODE.PER_DAY,
      imageUrl: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80',
      rate: 180,
      description: 'Safe and certified electrical wiring for new homes, rewiring old properties',
      experience: 15,
      estimatedDuration: 480,
      bufferTime: 30,
      maxTravelRadius: 15,
      isAvailable: true,
      allowSuddenBooking: false,
      maxTravelCost: null,
      bulkDiscounts: [],
      createdAt: new Date('2024-01-10T14:20:00Z'),
    },
    {
      _id: '3',
      workerId: 'worker-1',
      categoryId: 'plumb-1',
      serviceName: 'Bathroom & Kitchen Plumbing Fix',
      serviceType: SERVICE_TYPE.SMALL_TASK,
      pricingMode: PRICING_MODE.PER_UNIT,
      imageUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&q=80',
      rate: 150,
      description: 'Leaking taps, pipe repair, drain cleaning, complete bathroom/kitchen plumbing',
      experience: 8,
      estimatedDuration: 120,
      bufferTime: 20,
      maxTravelRadius: 25,
      isAvailable: false,
      allowSuddenBooking: true,
      maxTravelCost: 150,
      bulkDiscounts: [{ count: 2, percent: 5 }],
      createdAt: new Date('2024-01-08T09:15:00Z'),
    },
    {
      _id: '4',
      workerId: 'worker-1',
      categoryId: 'carp-1',
      serviceName: 'Modular Kitchen Installation',
      serviceType: SERVICE_TYPE.MAJOR_PROJECT,
      pricingMode: PRICING_MODE.PER_DAY,
      imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&q=80',
      rate: 300,
      description: 'Complete modular kitchen setup, cabinet installation, hardware fitting',
      experience: 14,
      estimatedDuration: 720,
      bufferTime: 60,
      maxTravelRadius: 12,
      isAvailable: true,
      allowSuddenBooking: false,
      maxTravelCost: null,
      bulkDiscounts: [],
      createdAt: new Date('2024-01-05T08:30:00Z'),
    },
  ],
};

export default function WorkerServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rate-high');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter and sort
  const filteredServices = API_DATA.services
    .filter(service => {
      const matchesSearch =
        service.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && service.isAvailable) ||
        (statusFilter === 'inactive' && !service.isAvailable);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'rate-high') {
        return b.rate - a.rate;
      }
      if (sortBy === 'rate-low') {
        return a.rate - b.rate;
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              Add New Service
            </button>
          </div>
        </div>
      </div>

      <div className="section-container py-8">
        {/* Filters */}
        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-10 gap-3">
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

            {/* Sort */}
            <div className="md:col-span-3 relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="w-full h-10 pl-3 pr-10 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
              >
                <option value="rate-high">Rate: High to Low</option>
                <option value="rate-low">Rate: Low to High</option>
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
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              Add Your First Service
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedServices.map(service => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-card rounded-xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Show</span>
                  <select
                    value={itemsPerPage}
                    onChange={e => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="h-9 pl-3 pr-8 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                  >
                    <option value={6}>6</option>
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-muted-foreground">
                    of {filteredServices.length} services
                  </span>
                </div>

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

      {/* Add Service Modal */}
      {showAddModal && <AddServiceModal onClose={() => setShowAddModal(false)} />}
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
          src={service.imageUrl}
          alt={service.serviceName}
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
          <span className="px-2.5 py-1 bg-purple-500/90 text-white rounded-full text-xs font-semibold">
            {service.serviceType}
          </span>
          {service.allowSuddenBooking && (
            <span className="px-2.5 py-1 bg-orange-500/90 text-white rounded-full text-xs font-semibold">
              Instant
            </span>
          )}
          {service.bulkDiscounts.length > 0 && (
            <span className="px-2.5 py-1 bg-blue-500/90 text-white rounded-full text-xs font-semibold">
              Bulk {service.bulkDiscounts[0].percent}%
            </span>
          )}
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
            <div className="absolute right-0 bottom-full mb-1 bg-card rounded-lg shadow-lg border border-border py-1 w-32 z-10">
              <button className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2 text-foreground">
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2 text-red-600">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">
          {service.serviceName}
        </h3>
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
            <p className="text-xs text-muted-foreground capitalize">
              {service.pricingMode.replace('_', ' ')}
            </p>
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

function AddServiceModal({ onClose }: { onClose: () => void }) {
  const [level1, setLevel1] = useState('');
  const [level2, setLevel2] = useState('');
  const [level3, setLevel3] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [bulkDiscounts, setBulkDiscounts] = useState<Array<{ count: number; percent: number }>>([]);

  const [formData, setFormData] = useState({
    rate: '',
    description: '',
    estimatedDuration: '',
    bufferTime: '',
    maxTravelRadius: '',
    allowSuddenBooking: false,
    isActive: true,
    experience: '',
    maxTravelCost: '',
  });

  const level1Categories = API_DATA.categoryHierarchy;
  const level2Categories = level1
    ? level1Categories.find(c => c.id === level1)?.children || []
    : [];
  const level3Categories = level2
    ? level2Categories.find((c: any) => c.id === level2)?.children || []
    : [];

  const handleLevel2Change = (value: string) => {
    setLevel2(value);
    setLevel3('');
    const cat = level2Categories.find((c: any) => c.id === value);
    setSelectedCategory(cat);
  };

  const handleLevel3Change = (value: string) => {
    setLevel3(value);
  };

  const addBulkDiscount = () => {
    if (bulkDiscounts.length < 5) {
      setBulkDiscounts([
        ...bulkDiscounts,
        { count: BULK_DISCOUNT.MIN_COUNT, percent: BULK_DISCOUNT.MIN_PERCENT },
      ]);
    }
  };

  const removeBulkDiscount = (index: number) => {
    setBulkDiscounts(bulkDiscounts.filter((_, i) => i !== index));
  };

  const updateBulkDiscount = (index: number, field: 'count' | 'percent', value: number) => {
    const updated = [...bulkDiscounts];
    updated[index][field] = value;
    setBulkDiscounts(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Add New Service</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Fill in the details to create your service
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Category Selection */}
          <div className="bg-section-blue border border-section-blue-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Select Service Category
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              {/* Level 1 */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">
                  Main Category
                </label>
                <select
                  value={level1}
                  onChange={e => {
                    setLevel1(e.target.value);
                    setLevel2('');
                    setLevel3('');
                    setSelectedCategory(null);
                  }}
                  className="w-full h-10 px-3 bg-background border border-input rounded-lg text-sm focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select...</option>
                  {level1Categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level 2 */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">
                  Sub Category
                </label>
                <select
                  value={level2}
                  onChange={e => handleLevel2Change(e.target.value)}
                  disabled={!level1}
                  className="w-full h-10 px-3 bg-background border border-input rounded-lg text-sm focus:ring-2 focus:ring-ring disabled:opacity-50"
                >
                  <option value="">Select...</option>
                  {level2Categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level 3 */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">
                  Service Type
                </label>
                <select
                  value={level3}
                  onChange={e => handleLevel3Change(e.target.value)}
                  disabled={!level2}
                  className="w-full h-10 px-3 bg-background border border-input rounded-lg text-sm focus:ring-2 focus:ring-ring disabled:opacity-50"
                >
                  <option value="">Select...</option>
                  {level2Categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
