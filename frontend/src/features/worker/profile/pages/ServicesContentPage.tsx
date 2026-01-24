// export default function WorkerServicesContentPage() {
//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">Worker Services Page</h2>
//       <p>This is where workers can manage their services.</p>
//     </div>
//   );
// }

import { useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Power,
  MapPin,
  Clock,
  Award,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
} from 'lucide-react';

// Mock Data
const MOCK_CATEGORIES = [
  { id: 'plumbing', name: 'Plumbing', icon: '🔧' },
  { id: 'electrical', name: 'Electrical Work', icon: '⚡' },
  { id: 'carpentry', name: 'Carpentry', icon: '🪵' },
  { id: 'painting', name: 'Painting', icon: '🎨' },
  { id: 'appliance', name: 'Appliance Repair', icon: '🔌' },
];

const MOCK_SERVICES = [
  {
    id: '1',
    categoryId: 'plumbing',
    categoryName: 'Plumbing',
    categoryIcon: '🔧',
    description: 'Pipe repair, leak fixing, and bathroom fitting services',
    rate: 150,
    experience: 8,
    estimatedDuration: 120,
    maxTravelRadius: 15,
    isAvailable: true,
    bulkDiscounts: [{ count: 3, percent: 10 }],
  },
  {
    id: '2',
    categoryId: 'electrical',
    categoryName: 'Electrical Work',
    categoryIcon: '⚡',
    description: 'Complete wiring, switchboard installation, and electrical repairs',
    rate: 200,
    experience: 12,
    estimatedDuration: 180,
    maxTravelRadius: 20,
    isAvailable: true,
    bulkDiscounts: [],
  },
  {
    id: '3',
    categoryId: 'carpentry',
    categoryName: 'Carpentry',
    categoryIcon: '🪵',
    description: 'Furniture repair, custom woodwork, and cabinet installation',
    rate: 180,
    experience: 10,
    estimatedDuration: 240,
    maxTravelRadius: 12,
    isAvailable: false,
    bulkDiscounts: [{ count: 2, percent: 5 }],
  },
  {
    id: '4',
    categoryId: 'painting',
    categoryName: 'Painting',
    categoryIcon: '🎨',
    description: 'Interior and exterior wall painting with premium finishes',
    rate: 120,
    experience: 6,
    estimatedDuration: 480,
    maxTravelRadius: 10,
    isAvailable: true,
    bulkDiscounts: [],
  },
  {
    id: '5',
    categoryId: 'appliance',
    categoryName: 'Appliance Repair',
    categoryIcon: '🔌',
    description: 'AC, refrigerator, washing machine repair and maintenance',
    rate: 250,
    experience: 15,
    estimatedDuration: 90,
    maxTravelRadius: 25,
    isAvailable: true,
    bulkDiscounts: [{ count: 2, percent: 8 }],
  },
  {
    id: '6',
    categoryId: 'plumbing',
    categoryName: 'Plumbing',
    categoryIcon: '🔧',
    description: 'Emergency plumbing services available 24/7',
    rate: 300,
    experience: 5,
    estimatedDuration: 60,
    maxTravelRadius: 30,
    isAvailable: true,
    bulkDiscounts: [],
  },
];

export default function WorkerServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Filter and sort logic
  const filteredServices = MOCK_SERVICES.filter(service => {
    const matchesSearch =
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && service.isAvailable) ||
      (statusFilter === 'inactive' && !service.isAvailable);
    const matchesCategory = categoryFilter === 'all' || service.categoryId === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'rate-high') {
      return b.rate - a.rate;
    }
    if (sortBy === 'rate-low') {
      return a.rate - b.rate;
    }
    return 0; // newest
  });

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeCount = MOCK_SERVICES.filter(s => s.isAvailable).length;
  const inactiveCount = MOCK_SERVICES.filter(s => !s.isAvailable).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
              <p className="text-gray-600 mt-1">
                {filteredServices.length} total • {activeCount} active • {inactiveCount} inactive
              </p>
            </div>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Service
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search services or categories..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="md:col-span-2 relative">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Category Filter */}
            <div className="md:col-span-2 relative">
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white"
              >
                <option value="all">All Categories</option>
                {MOCK_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="md:col-span-2 relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="rate-high">Rate: High to Low</option>
                <option value="rate-low">Rate: Low to High</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* View Toggle */}
            <div className="md:col-span-1 flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 p-2.5 rounded-xl transition-all ${
                  viewMode === 'grid'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <LayoutGrid className="w-5 h-5 mx-auto" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 p-2.5 rounded-xl transition-all ${
                  viewMode === 'list'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-5 h-5 mx-auto" />
              </button>
            </div>
          </div>
        </div>

        {/* Services Grid/List */}
        {paginatedServices.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or add a new service</p>
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
              Add Your First Service
            </button>
          </div>
        ) : (
          <>
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {paginatedServices.map(service => (
                <ServiceCard key={service.id} service={service} viewMode={viewMode} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Show</span>
                  <select
                    value={itemsPerPage}
                    onChange={e => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value={6}>6</option>
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                  </select>
                  <span className="text-sm text-gray-600">per page</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(idx + 1)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                          currentPage === idx + 1
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * itemsPerPage + 1} -{' '}
                  {Math.min(currentPage * itemsPerPage, filteredServices.length)} of{' '}
                  {filteredServices.length}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ServiceCard({ service, viewMode }: { service: any; viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="text-4xl">{service.categoryIcon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-gray-900">{service.categoryName}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    service.isAvailable
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {service.isAvailable ? 'Active' : 'Inactive'}
                </span>
                {service.bulkDiscounts.length > 0 && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    Bulk Discount
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-4">{service.description}</p>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  <span>{service.experience}y exp</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{service.estimatedDuration}min</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{service.maxTravelRadius}km</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">₹{service.rate}</div>
              <div className="text-sm text-gray-500">per hour</div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                className={`p-2 rounded-lg transition-colors ${
                  service.isAvailable
                    ? 'text-green-600 hover:bg-green-50'
                    : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                <Power className="w-5 h-5" />
              </button>
              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all group">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 text-center relative">
        <div className="text-6xl mb-3">{service.categoryIcon}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">{service.categoryName}</h3>
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            service.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {service.isAvailable ? 'Active' : 'Inactive'}
        </span>
        {service.bulkDiscounts.length > 0 && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-orange-500 text-white rounded-full text-xs font-semibold">
            Bulk
          </div>
        )}
      </div>

      <div className="p-6">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Award className="w-4 h-4" />
              <span>Experience</span>
            </div>
            <span className="font-semibold text-gray-900">{service.experience} years</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Duration</span>
            </div>
            <span className="font-semibold text-gray-900">{service.estimatedDuration} min</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Travel Radius</span>
            </div>
            <span className="font-semibold text-gray-900">{service.maxTravelRadius} km</span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl font-bold text-gray-900">₹{service.rate}</span>
            <span className="text-gray-500">/ hour</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl transition-colors ${
              service.isAvailable
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Power className="w-5 h-5" />
          </button>
          <button className="px-4 py-2.5 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
