import React, { useState } from 'react';
import {
  Clock,
  Plus,
  X,
  Trash2,
  Upload,
  MapPin,
  Search,
  CheckCircle,
  DollarSign,
  Calendar,
  FileText,
} from 'lucide-react';

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface AvailabilitySlots {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

interface WorkerProfessionalData {
  displayName: string;
  displayImage: string;
  aboutMe: string;
  rate: {
    amount: number;
    type: 'hourly' | 'fixed';
  };
  skills: string[];
  cities: string[];
  availability: AvailabilitySlots;
}

const WorkerProfessionalSections: React.FC = () => {
  const [isEditingProfessional, setIsEditingProfessional] = useState(false);
  const [isEditingAvailability, setIsEditingAvailability] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [skillInput, setSkillInput] = useState('');

  const [professionalData, setProfessionalData] = useState<WorkerProfessionalData>({
    displayName: 'Mike Johnson - Professional Plumber',
    displayImage: '',
    aboutMe:
      'Professional contractor with over 15 years of experience in high-end kitchen and bathroom renovations. Specializing in custom cabinetry, modern designs, and complete home transformations. Licensed, insured, and committed to exceptional craftsmanship.',
    rate: {
      amount: 150,
      type: 'hourly',
    },
    skills: [
      'Plumbing',
      'Pipe Installation',
      'Water Heater Repair',
      'Drainage Systems',
      'Emergency Repairs',
    ],
    cities: ['Calicut', 'Malappuram', 'Kannur', 'Wayanad'],
    availability: {
      monday: [{ startTime: '09:00', endTime: '17:00' }],
      tuesday: [{ startTime: '09:00', endTime: '17:00' }],
      wednesday: [{ startTime: '09:00', endTime: '17:00' }],
      thursday: [{ startTime: '09:00', endTime: '17:00' }],
      friday: [{ startTime: '09:00', endTime: '17:00' }],
      saturday: [{ startTime: '10:00', endTime: '14:00' }],
      sunday: [],
    },
  });

  const [editData, setEditData] = useState<WorkerProfessionalData>({ ...professionalData });

  // Dummy city suggestions
  const citySuggestions = [
    'Calicut',
    'Malappuram',
    'Kannur',
    'Wayanad',
    'Thrissur',
    'Palakkad',
    'Kozhikode',
    'Kochi',
    'Thiruvananthapuram',
    'Kollam',
  ];

  const filteredCities = citySuggestions.filter(
    city => city.toLowerCase().includes(citySearch.toLowerCase()) && !editData.cities.includes(city)
  );

  const daysOfWeek: (keyof AvailabilitySlots)[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  const handleAddCity = (city: string) => {
    if (!editData.cities.includes(city)) {
      setEditData(prev => ({
        ...prev,
        cities: [...prev.cities, city],
      }));
      setCitySearch('');
    }
  };

  const handleRemoveCity = (city: string) => {
    setEditData(prev => ({
      ...prev,
      cities: prev.cities.filter(c => c !== city),
    }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !editData.skills.includes(skillInput.trim())) {
      setEditData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };

  const handleAddTimeSlot = (day: keyof AvailabilitySlots) => {
    setEditData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: [...prev.availability[day], { startTime: '09:00', endTime: '17:00' }],
      },
    }));
  };

  const handleRemoveTimeSlot = (day: keyof AvailabilitySlots, index: number) => {
    setEditData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: prev.availability[day].filter((_, i) => i !== index),
      },
    }));
  };

  const handleTimeSlotChange = (
    day: keyof AvailabilitySlots,
    index: number,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    setEditData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: prev.availability[day].map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot
        ),
      },
    }));
  };

  const handleSaveProfessional = () => {
    setProfessionalData({ ...editData });
    setIsEditingProfessional(false);
  };

  const handleSaveAvailability = () => {
    setProfessionalData(prev => ({
      ...prev,
      availability: editData.availability,
    }));
    setIsEditingAvailability(false);
  };

  return (
    <div className="space-y-6">
      {/* Professional Information Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xl font-bold text-gray-900">Professional Information</h3>
          </div>
          {!isEditingProfessional ? (
            <button
              onClick={() => {
                setEditData({ ...professionalData });
                setIsEditingProfessional(true);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditData({ ...professionalData });
                  setIsEditingProfessional(false);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfessional}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
              >
                Save
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name <span className="text-red-500">*</span>
            </label>
            {isEditingProfessional ? (
              <input
                type="text"
                value={editData.displayName}
                onChange={e => setEditData(prev => ({ ...prev, displayName: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="Your professional display name"
              />
            ) : (
              <div className="text-gray-900 py-2">{professionalData.displayName}</div>
            )}
            <p className="text-xs text-gray-500 mt-1">This is how clients will see your name</p>
          </div>

          {/* Display Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Professional Display Image
            </label>
            {isEditingProfessional ? (
              <div className="flex items-center gap-4">
                <div className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden">
                  {editData.displayImage ? (
                    <img
                      src={editData.displayImage}
                      alt="Display"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Image
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                {professionalData.displayImage ? (
                  <img
                    src={professionalData.displayImage}
                    alt="Display"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">No image</span>
                )}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">Showcase your work or professional setup</p>
          </div>

          {/* About Me */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About Me <span className="text-red-500">*</span>
            </label>
            {isEditingProfessional ? (
              <textarea
                value={editData.aboutMe}
                onChange={e => setEditData(prev => ({ ...prev, aboutMe: e.target.value }))}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                placeholder="Tell clients about your experience, specialties, and what makes you unique..."
              />
            ) : (
              <div className="text-gray-900 py-2 whitespace-pre-wrap">
                {professionalData.aboutMe}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">Describe your experience and expertise</p>
          </div>

          {/* Rate Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Rate <span className="text-red-500">*</span>
            </label>
            {isEditingProfessional ? (
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Amount (₹)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={editData.rate.amount}
                      onChange={e =>
                        setEditData(prev => ({
                          ...prev,
                          rate: { ...prev.rate, amount: Number(e.target.value) },
                        }))
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Rate Type</label>
                  <select
                    value={editData.rate.type}
                    onChange={e =>
                      setEditData(prev => ({
                        ...prev,
                        rate: { ...prev.rate, type: e.target.value as 'hourly' | 'fixed' },
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="hourly">Per Hour</option>
                    <option value="fixed">Fixed Rate</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 py-2">
                <span className="text-2xl font-bold text-gray-900">
                  ₹{professionalData.rate.amount}
                </span>
                <span className="text-gray-500">
                  / {professionalData.rate.type === 'hourly' ? 'hour' : 'fixed'}
                </span>
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills & Expertise <span className="text-red-500">*</span>
            </label>
            {isEditingProfessional ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="Add a skill..."
                  />
                  <button
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-2"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-indigo-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {professionalData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Add skills that best describe your expertise
            </p>
          </div>

          {/* Service Cities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Cities <span className="text-red-500">*</span>
            </label>
            {isEditingProfessional ? (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={citySearch}
                    onChange={e => setCitySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="Search cities/towns/villages..."
                  />
                  {citySearch && filteredCities.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                      {filteredCities.map((city, index) => (
                        <button
                          key={index}
                          onClick={() => handleAddCity(city)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {editData.cities.map((city, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-2"
                    >
                      <MapPin className="w-3 h-3" />
                      {city}
                      <button
                        onClick={() => handleRemoveCity(city)}
                        className="hover:text-green-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-500 flex items-start gap-2">
                  <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>
                    Powered by Google - Search and select cities where you provide services
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {professionalData.cities.map((city, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3" />
                    {city}
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">Cities where you offer your services</p>
          </div>
        </div>
      </div>

      {/* Availability Schedule Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xl font-bold text-gray-900">Availability Schedule</h3>
          </div>
          {!isEditingAvailability ? (
            <button
              onClick={() => {
                setEditData({ ...professionalData });
                setIsEditingAvailability(true);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
            >
              Edit Schedule
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditData({ ...professionalData });
                  setIsEditingAvailability(false);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAvailability}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
              >
                Save Schedule
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {daysOfWeek.map(day => {
            const dayName = day.charAt(0).toUpperCase() + day.slice(1);
            const slots = isEditingAvailability
              ? editData.availability[day]
              : professionalData.availability[day];
            const isAvailable = slots.length > 0;

            return (
              <div key={day} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isAvailable ? 'bg-green-100' : 'bg-gray-100'
                      }`}
                    >
                      {isAvailable ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{dayName}</h4>
                      <p className="text-xs text-gray-500">
                        {isAvailable
                          ? `${slots.length} slot${slots.length > 1 ? 's' : ''}`
                          : 'Unavailable'}
                      </p>
                    </div>
                  </div>
                  {isEditingAvailability && (
                    <button
                      onClick={() => handleAddTimeSlot(day)}
                      className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add Slot
                    </button>
                  )}
                </div>

                {slots.length > 0 && (
                  <div className="space-y-2 ml-13">
                    {slots.map((slot, index) => (
                      <div key={index} className="flex items-center gap-3">
                        {isEditingAvailability ? (
                          <>
                            <Clock className="w-4 h-4 text-gray-400" />
                            <input
                              type="time"
                              value={slot.startTime}
                              onChange={e =>
                                handleTimeSlotChange(day, index, 'startTime', e.target.value)
                              }
                              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                            />
                            <span className="text-gray-400">to</span>
                            <input
                              type="time"
                              value={slot.endTime}
                              onChange={e =>
                                handleTimeSlotChange(day, index, 'endTime', e.target.value)
                              }
                              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                            />
                            <button
                              onClick={() => handleRemoveTimeSlot(day, index)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorkerProfessionalSections;
