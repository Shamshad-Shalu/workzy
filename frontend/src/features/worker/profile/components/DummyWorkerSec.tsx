// import React, { useState } from 'react';
// import { Clock, Plus, X, Upload, MapPin, Search, CheckCircle, DollarSign, Calendar, Tag, FileText, ChevronRight } from 'lucide-react';

// interface TimeSlot {
//   startTime: string;
//   endTime: string;
// }

// interface AvailabilitySlots {
//   [key: string]: TimeSlot[];
// }

// interface WorkerProfessionalData {
//   displayName: string;
//   displayImage: string;
//   aboutMe: string;
//   rate: {
//     amount: number;
//     type: 'hourly' | 'fixed';
//   };
//   skills: string[];
//   cities: string[];
//   availability: AvailabilitySlots;
// }

// const WorkerProfessionalSections: React.FC = () => {
//   const [isEditingProfessional, setIsEditingProfessional] = useState(false);
//   const [isEditingAvailability, setIsEditingAvailability] = useState(false);
//   const [showSkillModal, setShowSkillModal] = useState(false);
//   const [showCityModal, setShowCityModal] = useState(false);
//   const [searchInput, setSearchInput] = useState('');

//   const [professionalData, setProfessionalData] = useState<WorkerProfessionalData>({
//     displayName: 'Mike Johnson - Professional Plumber',
//     displayImage: '',
//     aboutMe: 'Professional contractor with over 15 years of experience in high-end kitchen and bathroom renovations. Specializing in custom cabinetry, modern designs, and complete home transformations. Licensed, insured, and committed to exceptional craftsmanship.',
//     rate: {
//       amount: 150,
//       type: 'hourly'
//     },
//     skills: ['Plumbing', 'Pipe Installation', 'Water Heater Repair'],
//     cities: ['Calicut', 'Malappuram', 'Kannur'],
//     availability: {
//       monday: [{ startTime: '09:00', endTime: '17:00' }],
//       tuesday: [{ startTime: '09:00', endTime: '17:00' }],
//       wednesday: [{ startTime: '09:00', endTime: '17:00' }],
//       thursday: [{ startTime: '09:00', endTime: '17:00' }],
//       friday: [{ startTime: '09:00', endTime: '17:00' }],
//       saturday: [{ startTime: '10:00', endTime: '14:00' }],
//       sunday: []
//     }
//   });

//   const [editData, setEditData] = useState<WorkerProfessionalData>({ ...professionalData });

//   const allSkills = [
//     'Plumbing', 'Pipe Installation', 'Water Heater Repair', 'Drainage Systems',
//     'Emergency Repairs', 'Kitchen Remodel', 'Bathroom Remodel', 'Leak Detection',
//     'Gas Fitting', 'Fixture Installation', 'Caulking', 'Hydro Jetting'
//   ];

//   const citySuggestions = [
//     'Calicut', 'Malappuram', 'Kannur', 'Wayanad', 'Thrissur', 'Palakkad',
//     'Kozhikode', 'Kochi', 'Thiruvananthapuram', 'Kollam', 'Ernakulam', 'Pathanamthitta'
//   ];

//   const daysOfWeek: string[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

//   const filteredSkills = allSkills.filter(skill =>
//     !editData.skills.includes(skill) &&
//     skill.toLowerCase().includes(searchInput.toLowerCase())
//   );

//   const filteredCities = citySuggestions.filter(city =>
//     !editData.cities.includes(city) &&
//     city.toLowerCase().includes(searchInput.toLowerCase())
//   );

//   const handleAddSkill = (skill: string): void => {
//     if (!editData.skills.includes(skill) && editData.skills.length < 10) {
//       setEditData(prev => ({
//         ...prev,
//         skills: [...prev.skills, skill]
//       }));
//     }
//   };

//   const handleRemoveSkill = (skill: string): void => {
//     setEditData(prev => ({
//       ...prev,
//       skills: prev.skills.filter(s => s !== skill)
//     }));
//   };

//   const handleAddCity = (city: string): void => {
//     if (!editData.cities.includes(city)) {
//       setEditData(prev => ({
//         ...prev,
//         cities: [...prev.cities, city]
//       }));
//     }
//   };

//   const handleRemoveCity = (city: string): void => {
//     setEditData(prev => ({
//       ...prev,
//       cities: prev.cities.filter(c => c !== city)
//     }));
//   };

//   const handleAddTimeSlot = (day: string): void => {
//     const currentSlots = editData.availability[day];
//     if (currentSlots && currentSlots.length < 3) {
//       setEditData(prev => ({
//         ...prev,
//         availability: {
//           ...prev.availability,
//           [day]: [...currentSlots, { startTime: '09:00', endTime: '17:00' }]
//         }
//       }));
//     }
//   };

//   const handleRemoveTimeSlot = (day: string, index: number): void => {
//     setEditData(prev => ({
//       ...prev,
//       availability: {
//         ...prev.availability,
//         [day]: prev.availability[day].filter((_, i) => i !== index)
//       }
//     }));
//   };

//   const handleTimeSlotChange = (day: string, index: number, field: 'startTime' | 'endTime', value: string): void => {
//     setEditData(prev => ({
//       ...prev,
//       availability: {
//         ...prev.availability,
//         [day]: prev.availability[day].map((slot, i) =>
//           i === index ? { ...slot, [field]: value } : slot
//         )
//       }
//     }));
//   };

//   const handleSaveProfessional = (): void => {
//     setProfessionalData({ ...editData });
//     setIsEditingProfessional(false);
//   };

//   const handleSaveAvailability = (): void => {
//     setProfessionalData(prev => ({
//       ...prev,
//       availability: editData.availability
//     }));
//     setIsEditingAvailability(false);
//   };

//   // Modal Component
//   interface SearchModalProps {
//     title: string;
//     isOpen: boolean;
//     onClose: () => void;
//     items: string[];
//     onSelect: (item: string) => void;
//     searchValue: string;
//     onSearchChange: (value: string) => void;
//   }

//   const SearchModal: React.FC<SearchModalProps> = ({ title, isOpen, onClose, items, onSelect, searchValue, onSearchChange }) => {
//     if (!isOpen) return null;
//     return (
//       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
//           <div className="p-6 border-b">
//             <h2 className="text-lg font-semibold">{title}</h2>
//           </div>

//           <div className="p-4 border-b">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder={`Search ${title.toLowerCase()}...`}
//                 value={searchValue}
//                 onChange={(e) => onSearchChange(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
//                 autoFocus
//               />
//             </div>
//           </div>

//           <div className="max-h-96 overflow-y-auto">
//             {items.length > 0 ? (
//               items.map((item, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => {
//                     onSelect(item);
//                     onSearchChange('');
//                   }}
//                   className="w-full px-6 py-3 text-left hover:bg-indigo-50 transition-colors flex items-center justify-between border-b last:border-b-0"
//                 >
//                   <span className="text-sm">{item}</span>
//                   <ChevronRight className="w-4 h-4 text-gray-400" />
//                 </button>
//               ))
//             ) : (
//               <div className="px-6 py-8 text-center text-gray-500 text-sm">
//                 No items found
//               </div>
//             )}
//           </div>

//           <div className="p-4 border-t">
//             <button
//               onClick={onClose}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
//       <div className="max-w-6xl mx-auto space-y-6">
//         {/* Professional Information Section */}
//         <div className="bg-white rounded-2xl shadow-sm p-8">
//           <div className="flex items-center justify-between mb-8">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-indigo-100 rounded-lg">
//                 <FileText className="w-6 h-6 text-indigo-600" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900">Professional Profile</h3>
//             </div>
//             {!isEditingProfessional ? (
//               <button
//                 onClick={() => {
//                   setEditData({ ...professionalData });
//                   setIsEditingProfessional(true);
//                 }}
//                 className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
//               >
//                 Edit Profile
//               </button>
//             ) : (
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => {
//                     setEditData({ ...professionalData });
//                     setIsEditingProfessional(false);
//                   }}
//                   className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSaveProfessional}
//                   className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
//                 >
//                   Save
//                 </button>
//               </div>
//             )}
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {/* Left Column - Image & Basic Info */}
//             <div className="space-y-6">
//               {/* Display Image */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-3">
//                   Professional Image
//                 </label>
//                 <div className="w-full aspect-square rounded-xl bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden">
//                   {editData.displayImage ? (
//                     <img src={editData.displayImage} alt="Display" className="w-full h-full object-cover" />
//                   ) : (
//                     <Upload className="w-12 h-12 text-gray-400" />
//                   )}
//                 </div>
//                 {isEditingProfessional && (
//                   <button className="w-full mt-3 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm flex items-center justify-center gap-2">
//                     <Upload className="w-4 h-4" />
//                     Upload Image
//                   </button>
//                 )}
//               </div>

//               {/* Rate Card */}
//               <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4">
//                 <label className="block text-sm font-semibold text-gray-700 mb-3">Service Rate</label>
//                 {isEditingProfessional ? (
//                   <div className="space-y-3">
//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1">Amount (₹)</label>
//                       <div className="relative">
//                         <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                         <input
//                           type="number"
//                           value={editData.rate.amount}
//                           onChange={(e) => setEditData(prev => ({
//                             ...prev,
//                             rate: { ...prev.rate, amount: Number(e.target.value) }
//                           }))}
//                           className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1">Rate Type</label>
//                       <select
//                         value={editData.rate.type}
//                         onChange={(e) => setEditData(prev => ({
//                           ...prev,
//                           rate: { ...prev.rate, type: e.target.value as 'hourly' | 'fixed' }
//                         }))}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
//                       >
//                         <option value="hourly">Per Hour</option>
//                         <option value="fixed">Fixed Rate</option>
//                       </select>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="text-center">
//                     <div className="text-3xl font-bold text-indigo-600">₹{professionalData.rate.amount}</div>
//                     <div className="text-xs text-gray-600 mt-1">
//                       per {professionalData.rate.type === 'hourly' ? 'hour' : 'project'}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Right Column - Name & Details */}
//             <div className="md:col-span-2 space-y-6">
//               {/* Display Name */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Display Name <span className="text-red-500">*</span>
//                 </label>
//                 {isEditingProfessional ? (
//                   <input
//                     type="text"
//                     value={editData.displayName}
//                     onChange={(e) => setEditData(prev => ({ ...prev, displayName: e.target.value }))}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
//                     placeholder="Your professional display name"
//                   />
//                 ) : (
//                   <div className="text-lg font-semibold text-gray-900 py-2">{professionalData.displayName}</div>
//                 )}
//               </div>

//               {/* About Me - Section Card */}
//               <div className="border-l-4 border-indigo-600 pl-4 bg-indigo-50 rounded-lg p-4">
//                 <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                   <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
//                   About You <span className="text-red-500">*</span>
//                 </label>
//                 {isEditingProfessional ? (
//                   <textarea
//                     value={editData.aboutMe}
//                     onChange={(e) => setEditData(prev => ({ ...prev, aboutMe: e.target.value }))}
//                     rows={4}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-sm"
//                     placeholder="Tell clients about your experience, specialties, and what makes you unique..."
//                   />
//                 ) : (
//                   <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{professionalData.aboutMe}</div>
//                 )}
//               </div>

//               {/* Specialties Section */}
//               <div className="border-l-4 border-purple-600 pl-4 bg-purple-50 rounded-lg p-4">
//                 <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                   <Tag className="w-4 h-4" />
//                   Specialties <span className="text-red-500">*</span>
//                 </label>
//                 {isEditingProfessional ? (
//                   <div className="space-y-3">
//                     <button
//                       onClick={() => {
//                         setSearchInput('');
//                         setShowSkillModal(true);
//                       }}
//                       className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
//                     >
//                       <Plus className="w-4 h-4" />
//                       Add Specialty
//                     </button>
//                     <div className="flex flex-wrap gap-2">
//                       {editData.skills.map((skill, idx) => (
//                         <span
//                           key={idx}
//                           className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-200 text-purple-800 rounded-full text-sm font-medium"
//                         >
//                           {skill}
//                           <button
//                             onClick={() => handleRemoveSkill(skill)}
//                             className="hover:text-purple-900"
//                           >
//                             <X className="w-3 h-3" />
//                           </button>
//                         </span>
//                       ))}
//                     </div>
//                     {editData.skills.length >= 10 && (
//                       <p className="text-xs text-red-600">Maximum 10 specialties allowed</p>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="flex flex-wrap gap-2">
//                     {professionalData.skills.map((skill, idx) => (
//                       <span
//                         key={idx}
//                         className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-200 text-purple-800 rounded-full text-sm font-medium"
//                       >
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Service Cities Section */}
//               <div className="border-l-4 border-green-600 pl-4 bg-green-50 rounded-lg p-4">
//                 <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                   <MapPin className="w-4 h-4" />
//                   Service Cities <span className="text-red-500">*</span>
//                 </label>
//                 {isEditingProfessional ? (
//                   <div className="space-y-3">
//                     <button
//                       onClick={() => {
//                         setSearchInput('');
//                         setShowCityModal(true);
//                       }}
//                       className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
//                     >
//                       <Plus className="w-4 h-4" />
//                       Add City
//                     </button>
//                     <div className="flex flex-wrap gap-2">
//                       {editData.cities.map((city, idx) => (
//                         <span
//                           key={idx}
//                           className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-200 text-green-800 rounded-full text-sm font-medium"
//                         >
//                           <MapPin className="w-3 h-3" />
//                           {city}
//                           <button
//                             onClick={() => handleRemoveCity(city)}
//                             className="hover:text-green-900"
//                           >
//                             <X className="w-3 h-3" />
//                           </button>
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="flex flex-wrap gap-2">
//                     {professionalData.cities.map((city, idx) => (
//                       <span
//                         key={idx}
//                         className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-200 text-green-800 rounded-full text-sm font-medium"
//                       >
//                         <MapPin className="w-3 h-3" />
//                         {city}
//                       </span>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Availability Schedule Section */}
//         <div className="bg-white rounded-2xl shadow-sm p-8">
//           <div className="flex items-center justify-between mb-8">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-indigo-100 rounded-lg">
//                 <Calendar className="w-6 h-6 text-indigo-600" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900">Availability Schedule</h3>
//             </div>
//             {!isEditingAvailability ? (
//               <button
//                 onClick={() => {
//                   setEditData({ ...professionalData });
//                   setIsEditingAvailability(true);
//                 }}
//                 className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
//               >
//                 Edit Schedule
//               </button>
//             ) : (
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => {
//                     setEditData({ ...professionalData });
//                     setIsEditingAvailability(false);
//                   }}
//                   className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSaveAvailability}
//                   className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
//                 >
//                   Save Schedule
//                 </button>
//               </div>
//             )}
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {daysOfWeek.map((day) => {
//               const dayName = day.charAt(0).toUpperCase() + day.slice(1);
//               const slots = isEditingAvailability ? editData.availability[day] : professionalData.availability[day];
//               const isAvailable = slots && slots.length > 0;

//               return (
//                 <div key={day} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
//                       isAvailable ? 'bg-green-100' : 'bg-gray-100'
//                     }`}>
//                       {isAvailable ? (
//                         <CheckCircle className="w-4 h-4 text-green-600" />
//                       ) : (
//                         <X className="w-4 h-4 text-gray-400" />
//                       )}
//                     </div>
//                     <div className="flex-1">
//                       <h4 className="font-semibold text-gray-900 text-sm">{dayName}</h4>
//                       <p className="text-xs text-gray-500">
//                         {isAvailable ? `${slots?.length} slot${slots && slots.length > 1 ? 's' : ''}` : 'Off'}
//                       </p>
//                     </div>
//                   </div>

//                   {slots && slots.length > 0 && (
//                     <div className="space-y-2 mb-3">
//                       {slots.map((slot, idx) => (
//                         <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
//                           {isEditingAvailability ? (
//                             <>
//                               <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
//                               <input
//                                 type="time"
//                                 value={slot.startTime}
//                                 onChange={(e) => handleTimeSlotChange(day, idx, 'startTime', e.target.value)}
//                                 className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
//                               />
//                               <span className="text-gray-400 text-xs">to</span>
//                               <input
//                                 type="time"
//                                 value={slot.endTime}
//                                 onChange={(e) => handleTimeSlotChange(day, idx, 'endTime', e.target.value)}
//                                 className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
//                               />
//                               <button
//                                 onClick={() => handleRemoveTimeSlot(day, idx)}
//                                 className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors flex-shrink-0"
//                               >
//                                 <X className="w-3 h-3" />
//                               </button>
//                             </>
//                           ) : (
//                             <>
//                               <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
//                               <span className="text-xs text-gray-700 font-medium">
//                                 {slot.startTime} - {slot.endTime}
//                               </span>
//                             </>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   {isEditingAvailability && (
//                     <button
//                       onClick={() => handleAddTimeSlot(day)}
//                       disabled={slots && slots.length >= 3}
//                       className={`w-full px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-center gap-1 font-medium ${
//                         slots && slots.length >= 3
//                           ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                           : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
//                       }`}
//                     >
//                       <Plus className="w-3 h-3" />
//                       Add Slot
//                     </button>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Search Modals */}
//       <SearchModal
//         title="Add Specialty"
//         isOpen={showSkillModal}
//         onClose={() => setShowSkillModal(false)}
//         items={filteredSkills}
//         onSelect={handleAddSkill}
//         searchValue={searchInput}
//         onSearchChange={setSearchInput}
//       />

//       <SearchModal
//         title="Add Service City"
//         isOpen={showCityModal}
//         onClose={() => setShowCityModal(false)}
//         items={filteredCities}
//         onSelect={handleAddCity}
//         searchValue={searchInput}
//         onSearchChange={setSearchInput}
//       />
//     </div>
//   );
// };

// export default WorkerProfessionalSections;

// import React, { useState } from 'react';
// import { Clock, Plus, X, MapPin, Search, CheckCircle, DollarSign, Calendar, Tag, FileText, ChevronRight } from 'lucide-react';
// import Button from '@/components/atoms/Button';
// import Input from '@/components/atoms/Input';
// import Label from '@/components/atoms/Label';
// import Select from '@/components/atoms/Select';

// interface TimeSlot {
//   startTime: string;
//   endTime: string;
// }

// interface AvailabilitySlots {
//   [key: string]: TimeSlot[];
// }

// interface WorkerProfessionalData {
//   displayName: string;
//   displayImage: string;
//   aboutMe: string;
//   rate: {
//     amount: number;
//     type: 'hourly' | 'fixed';
//   };
//   skills: string[];
//   cities: string[];
//   availability: AvailabilitySlots;
// }

// const WorkerProfessionalSections: React.FC = () => {
//   const [isEditingProfessional, setIsEditingProfessional] = useState(false);
//   const [isEditingAvailability, setIsEditingAvailability] = useState(false);
//   const [showAddModal, setShowAddModal] = useState<'skill' | 'city' | null>(null);
//   const [searchInput, setSearchInput] = useState('');

//   const [professionalData, setProfessionalData] = useState<WorkerProfessionalData>({
//     displayName: 'Mike Johnson - Professional Plumber',
//     displayImage: '',
//     aboutMe: 'Professional contractor with over 15 years of experience in high-end kitchen and bathroom renovations. Specializing in custom cabinetry, modern designs, and complete home transformations. Licensed, insured, and committed to exceptional craftsmanship.',
//     rate: {
//       amount: 150,
//       type: 'hourly'
//     },
//     skills: ['Plumbing', 'Pipe Installation', 'Water Heater Repair'],
//     cities: ['Calicut', 'Malappuram', 'Kannur'],
//     availability: {
//       monday: [{ startTime: '09:00', endTime: '17:00' }],
//       tuesday: [{ startTime: '09:00', endTime: '17:00' }],
//       wednesday: [{ startTime: '09:00', endTime: '17:00' }],
//       thursday: [{ startTime: '09:00', endTime: '17:00' }],
//       friday: [{ startTime: '09:00', endTime: '17:00' }],
//       saturday: [{ startTime: '10:00', endTime: '14:00' }],
//       sunday: []
//     }
//   });

//   const [editData, setEditData] = useState<WorkerProfessionalData>({ ...professionalData });

//   const allSkills = [
//     'Plumbing', 'Pipe Installation', 'Water Heater Repair', 'Drainage Systems',
//     'Emergency Repairs', 'Kitchen Remodel', 'Bathroom Remodel', 'Leak Detection',
//     'Gas Fitting', 'Fixture Installation', 'Caulking', 'Hydro Jetting'
//   ];

//   const citySuggestions = [
//     'Calicut', 'Malappuram', 'Kannur', 'Wayanad', 'Thrissur', 'Palakkad',
//     'Kozhikode', 'Kochi', 'Thiruvananthapuram', 'Kollam', 'Ernakulam', 'Pathanamthitta'
//   ];

//   const daysOfWeek: string[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

//   const filteredSkills = allSkills.filter(skill =>
//     !editData.skills.includes(skill) &&
//     skill.toLowerCase().includes(searchInput.toLowerCase())
//   );

//   const filteredCities = citySuggestions.filter(city =>
//     !editData.cities.includes(city) &&
//     city.toLowerCase().includes(searchInput.toLowerCase())
//   );

//   const handleAddSkill = (skill: string): void => {
//     if (!editData.skills.includes(skill) && editData.skills.length < 10) {
//       setEditData(prev => ({
//         ...prev,
//         skills: [...prev.skills, skill]
//       }));
//       setSearchInput('');
//     }
//   };

//   const handleRemoveSkill = (skill: string): void => {
//     setEditData(prev => ({
//       ...prev,
//       skills: prev.skills.filter(s => s !== skill)
//     }));
//   };

//   const handleAddCity = (city: string): void => {
//     if (!editData.cities.includes(city)) {
//       setEditData(prev => ({
//         ...prev,
//         cities: [...prev.cities, city]
//       }));
//       setSearchInput('');
//     }
//   };

//   const handleRemoveCity = (city: string): void => {
//     setEditData(prev => ({
//       ...prev,
//       cities: prev.cities.filter(c => c !== city)
//     }));
//   };

//   const handleAddTimeSlot = (day: string): void => {
//     const currentSlots = editData.availability[day];
//     if (currentSlots && currentSlots.length < 3) {
//       setEditData(prev => ({
//         ...prev,
//         availability: {
//           ...prev.availability,
//           [day]: [...currentSlots, { startTime: '09:00', endTime: '17:00' }]
//         }
//       }));
//     }
//   };

//   const handleRemoveTimeSlot = (day: string, index: number): void => {
//     setEditData(prev => ({
//       ...prev,
//       availability: {
//         ...prev.availability,
//         [day]: prev.availability[day].filter((_, i) => i !== index)
//       }
//     }));
//   };

//   const handleTimeSlotChange = (day: string, index: number, field: 'startTime' | 'endTime', value: string): void => {
//     setEditData(prev => ({
//       ...prev,
//       availability: {
//         ...prev.availability,
//         [day]: prev.availability[day].map((slot, i) =>
//           i === index ? { ...slot, [field]: value } : slot
//         )
//       }
//     }));
//   };

//   const handleSaveProfessional = (): void => {
//     setProfessionalData({ ...editData });
//     setIsEditingProfessional(false);
//   };

//   const handleSaveAvailability = (): void => {
//     setProfessionalData(prev => ({
//       ...prev,
//       availability: editData.availability
//     }));
//     setIsEditingAvailability(false);
//   };

//   // Unified Modal Component
//   interface UnifiedModalProps {
//     type: 'skill' | 'city';
//     isOpen: boolean;
//     onClose: () => void;
//     items: string[];
//     onSelect: (item: string) => void;
//     searchValue: string;
//     onSearchChange: (value: string) => void;
//   }

//   const UnifiedModal: React.FC<UnifiedModalProps> = ({
//     type, isOpen, onClose, items, onSelect, searchValue, onSearchChange
//   }) => {
//     if (!isOpen) return null;

//     const title = type === 'skill' ? 'Add Specialty' : 'Add Service City';
//     const placeholder = type === 'skill' ? 'Search specialties...' : 'Search cities...';
//     const icon = type === 'skill' ? <Tag className="w-4 h-4" /> : <MapPin className="w-4 h-4" />;

//     return (
//       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//         <div className="bg-background rounded-xl shadow-lg w-full max-w-md border border-border">
//           {/* Header */}
//           <div className="p-6 border-b border-border">
//             <h2 className="text-lg font-semibold text-foreground">{title}</h2>
//           </div>

//           {/* Search Input */}
//           <div className="p-4 border-b border-border">
//             <Input
//               type="text"
//               placeholder={placeholder}
//               value={searchValue}
//               onChange={(e) => onSearchChange(e.target.value)}
//               leftIcon={<Search className="w-4 h-4" />}
//               autoFocus
//             />
//           </div>

//           {/* Items List */}
//           <div className="max-h-96 overflow-y-auto">
//             {items.length > 0 ? (
//               items.map((item, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => {
//                     onSelect(item);
//                     onSearchChange('');
//                   }}
//                   className="w-full px-6 py-3 text-left hover:bg-accent transition-colors flex items-center justify-between border-b border-border last:border-b-0 text-foreground"
//                 >
//                   <div className="flex items-center gap-3">
//                     {icon}
//                     <span className="text-sm">{item}</span>
//                   </div>
//                   <ChevronRight className="w-4 h-4 text-muted-foreground" />
//                 </button>
//               ))
//             ) : (
//               <div className="px-6 py-8 text-center text-muted-foreground text-sm">
//                 No items found
//               </div>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="p-4 border-t border-border">
//             <Button variant="ghost" onClick={onClose} fullWidth>
//               Close
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-background p-6">
//       <div className="max-w-6xl mx-auto space-y-6">
//         {/* Professional Information Section */}
//         <div className="bg-card rounded-2xl shadow-sm p-8 border border-border">
//           <div className="flex items-center justify-between mb-8">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-primary/10 rounded-lg">
//                 <FileText className="w-6 h-6 text-primary" />
//               </div>
//               <h3 className="text-2xl font-bold text-card-foreground">Professional Profile</h3>
//             </div>
//             {!isEditingProfessional ? (
//               <Button variant="primary" onClick={() => {
//                 setEditData({ ...professionalData });
//                 setIsEditingProfessional(true);
//               }}>
//                 Edit Profile
//               </Button>
//             ) : (
//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setEditData({ ...professionalData });
//                     setIsEditingProfessional(false);
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button variant="green" onClick={handleSaveProfessional}>
//                   Save
//                 </Button>
//               </div>
//             )}
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {/* Left Column - Image & Basic Info */}
//             <div className="space-y-6">
//               {/* Display Image */}
//               <div>
//                 <Label>Professional Image</Label>
//                 <div className="w-full aspect-square rounded-xl bg-muted flex items-center justify-center border-2 border-dashed border-border overflow-hidden">
//                   {editData.displayImage ? (
//                     <img src={editData.displayImage} alt="Display" className="w-full h-full object-cover" />
//                   ) : (
//                     <FileText className="w-12 h-12 text-muted-foreground" />
//                   )}
//                 </div>
//                 {isEditingProfessional && (
//                   <Button variant="blue" fullWidth className="mt-3">
//                     Upload Image
//                   </Button>
//                 )}
//               </div>

//               {/* Rate Card */}
//               <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
//                 <Label>Service Rate</Label>
//                 {isEditingProfessional ? (
//                   <div className="space-y-3">
//                     <div>
//                       <Input
//                         type="number"
//                         value={editData.rate.amount}
//                         onChange={(e) => setEditData(prev => ({
//                           ...prev,
//                           rate: { ...prev.rate, amount: Number(e.target.value) }
//                         }))}
//                         placeholder="Amount"
//                         leftIcon={<DollarSign className="w-4 h-4" />}
//                       />
//                     </div>
//                     <Select
//                       value={editData.rate.type}
//                       onChange={(v) => setEditData(prev => ({
//                         ...prev,
//                         rate: { ...prev.rate, type: v as 'hourly' | 'fixed' }
//                       }))}
//                       options={[
//                         { label: 'Per Hour', value: 'hourly' },
//                         { label: 'Fixed Rate', value: 'fixed' }
//                       ]}
//                     />
//                   </div>
//                 ) : (
//                   <div className="text-center">
//                     <div className="text-3xl font-bold text-primary">₹{professionalData.rate.amount}</div>
//                     <div className="text-xs text-muted-foreground mt-1">
//                       per {professionalData.rate.type === 'hourly' ? 'hour' : 'project'}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Right Column - Name & Details */}
//             <div className="md:col-span-2 space-y-6">
//               {/* Display Name */}
//               <div>
//                 <Label>Display Name <span className="text-destructive">*</span></Label>
//                 {isEditingProfessional ? (
//                   <Input
//                     type="text"
//                     value={editData.displayName}
//                     onChange={(e) => setEditData(prev => ({ ...prev, displayName: e.target.value }))}
//                     placeholder="Your professional display name"
//                   />
//                 ) : (
//                   <div className="text-lg font-semibold text-card-foreground py-2">{professionalData.displayName}</div>
//                 )}
//               </div>

//               {/* About Me - Section Card */}
//               <div className="border-l-4 border-primary pl-4 bg-primary/5 rounded-lg p-4">
//                 <Label>About You <span className="text-destructive">*</span></Label>
//                 {isEditingProfessional ? (
//                   <textarea
//                     value={editData.aboutMe}
//                     onChange={(e) => setEditData(prev => ({ ...prev, aboutMe: e.target.value }))}
//                     rows={4}
//                     className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none resize-none text-sm bg-background text-foreground"
//                     placeholder="Tell clients about your experience, specialties, and what makes you unique..."
//                   />
//                 ) : (
//                   <div className="text-card-foreground text-sm leading-relaxed whitespace-pre-wrap">{professionalData.aboutMe}</div>
//                 )}
//               </div>

//               {/* Specialties Section */}
//               <div className="border-l-4 border-accent pl-4 bg-accent/5 rounded-lg p-4">
//                 <Label>Specialties <span className="text-destructive">*</span></Label>
//                 {isEditingProfessional ? (
//                   <div className="space-y-3">
//                     <Button
//                       variant="primary"
//                       fullWidth
//                       onClick={() => {
//                         setSearchInput('');
//                         setShowAddModal('skill');
//                       }}
//                       iconLeft={<Plus className="w-4 h-4" />}
//                     >
//                       Add Specialty
//                     </Button>
//                     <div className="flex flex-wrap gap-2">
//                       {editData.skills.map((skill, idx) => (
//                         <span
//                           key={idx}
//                           className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent text-accent-foreground rounded-full text-sm font-medium"
//                         >
//                           {skill}
//                           <button
//                             onClick={() => handleRemoveSkill(skill)}
//                             className="hover:opacity-70"
//                           >
//                             <X className="w-3 h-3" />
//                           </button>
//                         </span>
//                       ))}
//                     </div>
//                     {editData.skills.length >= 10 && (
//                       <p className="text-xs text-destructive">Maximum 10 specialties allowed</p>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="flex flex-wrap gap-2">
//                     {professionalData.skills.map((skill, idx) => (
//                       <span
//                         key={idx}
//                         className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent text-accent-foreground rounded-full text-sm font-medium"
//                       >
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Service Cities Section */}
//               <div className="border-l-4 border-secondary pl-4 bg-secondary/5 rounded-lg p-4">
//                 <Label>Service Cities <span className="text-destructive">*</span></Label>
//                 {isEditingProfessional ? (
//                   <div className="space-y-3">
//                     <Button
//                       variant="green"
//                       fullWidth
//                       onClick={() => {
//                         setSearchInput('');
//                         setShowAddModal('city');
//                       }}
//                       iconLeft={<Plus className="w-4 h-4" />}
//                     >
//                       Add City
//                     </Button>
//                     <div className="flex flex-wrap gap-2">
//                       {editData.cities.map((city, idx) => (
//                         <span
//                           key={idx}
//                           className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
//                         >
//                           <MapPin className="w-3 h-3" />
//                           {city}
//                           <button
//                             onClick={() => handleRemoveCity(city)}
//                             className="hover:opacity-70"
//                           >
//                             <X className="w-3 h-3" />
//                           </button>
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="flex flex-wrap gap-2">
//                     {professionalData.cities.map((city, idx) => (
//                       <span
//                         key={idx}
//                         className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
//                       >
//                         <MapPin className="w-3 h-3" />
//                         {city}
//                       </span>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Availability Schedule Section */}
//         <div className="bg-card rounded-2xl shadow-sm p-8 border border-border">
//           <div className="flex items-center justify-between mb-8">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-primary/10 rounded-lg">
//                 <Calendar className="w-6 h-6 text-primary" />
//               </div>
//               <h3 className="text-2xl font-bold text-card-foreground">Availability Schedule</h3>
//             </div>
//             {!isEditingAvailability ? (
//               <Button variant="primary" onClick={() => {
//                 setEditData({ ...professionalData });
//                 setIsEditingAvailability(true);
//               }}>
//                 Edit Schedule
//               </Button>
//             ) : (
//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setEditData({ ...professionalData });
//                     setIsEditingAvailability(false);
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button variant="green" onClick={handleSaveAvailability}>
//                   Save Schedule
//                 </Button>
//               </div>
//             )}
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {daysOfWeek.map((day) => {
//               const dayName = day.charAt(0).toUpperCase() + day.slice(1);
//               const slots = isEditingAvailability ? editData.availability[day] : professionalData.availability[day];
//               const isAvailable = slots && slots.length > 0;

//               return (
//                 <div key={day} className="border border-border rounded-lg p-4 hover:border-primary transition-colors bg-card">
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
//                       isAvailable ? 'bg-primary/10' : 'bg-muted'
//                     }`}>
//                       {isAvailable ? (
//                         <CheckCircle className="w-4 h-4 text-primary" />
//                       ) : (
//                         <X className="w-4 h-4 text-muted-foreground" />
//                       )}
//                     </div>
//                     <div className="flex-1">
//                       <h4 className="font-semibold text-card-foreground text-sm">{dayName}</h4>
//                       <p className="text-xs text-muted-foreground">
//                         {isAvailable ? `${slots?.length} slot${slots && slots.length > 1 ? 's' : ''}` : 'Off'}
//                       </p>
//                     </div>
//                   </div>

//                   {slots && slots.length > 0 && (
//                     <div className="space-y-2 mb-3">
//                       {slots.map((slot, idx) => (
//                         <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-muted">
//                           {isEditingAvailability ? (
//                             <>
//                               <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
//                               <input
//                                 type="time"
//                                 value={slot.startTime}
//                                 onChange={(e) => handleTimeSlotChange(day, idx, 'startTime', e.target.value)}
//                                 className="flex-1 px-2 py-1 border border-input rounded text-xs focus:ring-2 focus:ring-ring focus:border-transparent outline-none bg-background text-foreground"
//                               />
//                               <span className="text-muted-foreground text-xs">to</span>
//                               <input
//                                 type="time"
//                                 value={slot.endTime}
//                                 onChange={(e) => handleTimeSlotChange(day, idx, 'endTime', e.target.value)}
//                                 className="flex-1 px-2 py-1 border border-input rounded text-xs focus:ring-2 focus:ring-ring focus:border-transparent outline-none bg-background text-foreground"
//                               />
//                               <button
//                                 onClick={() => handleRemoveTimeSlot(day, idx)}
//                                 className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors flex-shrink-0"
//                               >
//                                 <X className="w-3 h-3" />
//                               </button>
//                             </>
//                           ) : (
//                             <>
//                               <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
//                               <span className="text-xs text-card-foreground font-medium">
//                                 {slot.startTime} - {slot.endTime}
//                               </span>
//                             </>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   {isEditingAvailability && (
//                     <Button
//                       onClick={() => handleAddTimeSlot(day)}
//                       disabled={slots && slots.length >= 3}
//                       variant={slots && slots.length >= 3 ? 'ghost' : 'blue'}
//                       fullWidth
//                       className="text-xs py-2"
//                       iconLeft={<Plus className="w-3 h-3" />}
//                     >
//                       Add Slot
//                     </Button>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Unified Modal */}
//       <UnifiedModal
//         type={showAddModal as 'skill' | 'city'}
//         isOpen={showAddModal !== null}
//         onClose={() => setShowAddModal(null)}
//         items={showAddModal === 'skill' ? filteredSkills : filteredCities}
//         onSelect={showAddModal === 'skill' ? handleAddSkill : handleAddCity}
//         searchValue={searchInput}
//         onSearchChange={setSearchInput}
//       />
//     </div>
//   );
// };

// export default WorkerProfessionalSections;

/////////////////////
import React, { useState } from 'react';
import {
  Clock,
  Plus,
  X,
  MapPin,
  Search,
  CheckCircle,
  DollarSign,
  Calendar,
  Tag,
  FileText,
  ChevronRight,
} from 'lucide-react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Select from '@/components/atoms/Select';

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface AvailabilitySlots {
  [key: string]: TimeSlot[];
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
  const [showAddModal, setShowAddModal] = useState<'skill' | 'city' | null>(null);
  const [searchInput, setSearchInput] = useState('');

  const [professionalData, setProfessionalData] = useState<WorkerProfessionalData>({
    displayName: 'Mike Johnson - Professional Plumber',
    displayImage: '',
    aboutMe:
      'Professional contractor with over 15 years of experience in high-end kitchen and bathroom renovations. Specializing in custom cabinetry, modern designs, and complete home transformations. Licensed, insured, and committed to exceptional craftsmanship.',
    rate: {
      amount: 150,
      type: 'hourly',
    },
    skills: ['Plumbing', 'Pipe Installation', 'Water Heater Repair'],
    cities: ['Calicut', 'Malappuram', 'Kannur'],
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

  const allSkills = [
    'Plumbing',
    'Pipe Installation',
    'Water Heater Repair',
    'Drainage Systems',
    'Emergency Repairs',
    'Kitchen Remodel',
    'Bathroom Remodel',
    'Leak Detection',
    'Gas Fitting',
    'Fixture Installation',
    'Caulking',
    'Hydro Jetting',
  ];

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
    'Ernakulam',
    'Pathanamthitta',
  ];

  const daysOfWeek: string[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  const filteredSkills = allSkills.filter(
    skill =>
      !editData.skills.includes(skill) && skill.toLowerCase().includes(searchInput.toLowerCase())
  );

  const filteredCities = citySuggestions.filter(
    city =>
      !editData.cities.includes(city) && city.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleAddSkill = (skill: string): void => {
    if (!editData.skills.includes(skill) && editData.skills.length < 10) {
      setEditData(prev => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
      setSearchInput('');
    }
  };

  const handleRemoveSkill = (skill: string): void => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };

  const handleAddCity = (city: string): void => {
    if (!editData.cities.includes(city)) {
      setEditData(prev => ({
        ...prev,
        cities: [...prev.cities, city],
      }));
      setSearchInput('');
    }
  };

  const handleRemoveCity = (city: string): void => {
    setEditData(prev => ({
      ...prev,
      cities: prev.cities.filter(c => c !== city),
    }));
  };

  const handleAddTimeSlot = (day: string): void => {
    const currentSlots = editData.availability[day];
    if (currentSlots && currentSlots.length < 3) {
      setEditData(prev => ({
        ...prev,
        availability: {
          ...prev.availability,
          [day]: [...currentSlots, { startTime: '09:00', endTime: '17:00' }],
        },
      }));
    }
  };

  const handleRemoveTimeSlot = (day: string, index: number): void => {
    setEditData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: prev.availability[day].filter((_, i) => i !== index),
      },
    }));
  };

  const handleTimeSlotChange = (
    day: string,
    index: number,
    field: 'startTime' | 'endTime',
    value: string
  ): void => {
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

  const handleSaveProfessional = (): void => {
    setProfessionalData({ ...editData });
    setIsEditingProfessional(false);
  };

  const handleSaveAvailability = (): void => {
    setProfessionalData(prev => ({
      ...prev,
      availability: editData.availability,
    }));
    setIsEditingAvailability(false);
  };

  // Unified Modal Component
  interface UnifiedModalProps {
    type: 'skill' | 'city';
    isOpen: boolean;
    onClose: () => void;
    items: string[];
    onSelect: (item: string) => void;
    searchValue: string;
    onSearchChange: (value: string) => void;
  }

  const UnifiedModal: React.FC<UnifiedModalProps> = ({
    type,
    isOpen,
    onClose,
    items,
    onSelect,
    searchValue,
    onSearchChange,
  }) => {
    if (!isOpen) {
      return null;
    }

    const title = type === 'skill' ? 'Add Specialty' : 'Add Service City';
    const placeholder = type === 'skill' ? 'Search specialties...' : 'Search cities...';
    const icon = type === 'skill' ? <Tag className="w-4 h-4" /> : <MapPin className="w-4 h-4" />;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-background rounded-xl shadow-lg w-full max-w-md border border-border">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          </div>

          {/* Search Input */}
          <div className="p-4 border-b border-border">
            <Input
              type="text"
              placeholder={placeholder}
              value={searchValue}
              onChange={e => onSearchChange(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              autoFocus
            />
          </div>

          {/* Items List */}
          <div className="max-h-96 overflow-y-auto">
            {items.length > 0 ? (
              items.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelect(item);
                    onSearchChange('');
                  }}
                  className="w-full px-6 py-3 text-left hover:bg-accent transition-colors flex items-center justify-between border-b border-border last:border-b-0 text-foreground"
                >
                  <div className="flex items-center gap-3">
                    {icon}
                    <span className="text-sm">{item}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-muted-foreground text-sm">
                No items found
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Button variant="ghost" onClick={onClose} fullWidth>
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pt-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Professional Information Section */}
        <div className="bg-card rounded-2xl shadow-sm p-8 border border-border">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-fine-blue/10 rounded-lg">
                <FileText className="w-6 h-6" style={{ color: 'var(--fine-blue)' }} />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground">Professional Profile</h3>
            </div>
            {!isEditingProfessional ? (
              <Button
                variant="primary"
                onClick={() => {
                  setEditData({ ...professionalData });
                  setIsEditingProfessional(true);
                }}
              >
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditData({ ...professionalData });
                    setIsEditingProfessional(false);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="green" onClick={handleSaveProfessional}>
                  Save
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Image & Basic Info */}
            <div className="space-y-6">
              {/* Display Image */}
              <div>
                <Label>Professional Image</Label>
                <div className="w-full aspect-square rounded-xl bg-muted flex items-center justify-center border-2 border-dashed border-border overflow-hidden">
                  {editData.displayImage ? (
                    <img
                      src={editData.displayImage}
                      alt="Display"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileText className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
                {isEditingProfessional && (
                  <Button variant="blue" fullWidth className="mt-3">
                    Upload Image
                  </Button>
                )}
              </div>

              {/* Rate Card */}
              <div
                className="rounded-xl p-4 border shadow-sm"
                style={{
                  background: 'var(--fine-blue-light)',
                  borderColor: 'var(--fine-blue)/30',
                }}
              >
                <Label>Service Rate</Label>
                {isEditingProfessional ? (
                  <div className="space-y-3">
                    <div>
                      <Input
                        type="number"
                        value={editData.rate.amount}
                        onChange={e =>
                          setEditData(prev => ({
                            ...prev,
                            rate: { ...prev.rate, amount: Number(e.target.value) },
                          }))
                        }
                        placeholder="Amount"
                        leftIcon={<DollarSign className="w-4 h-4" />}
                      />
                    </div>
                    <Select
                      value={editData.rate.type}
                      onChange={v =>
                        setEditData(prev => ({
                          ...prev,
                          rate: { ...prev.rate, type: v as 'hourly' | 'fixed' },
                        }))
                      }
                      options={[
                        { label: 'Per Hour', value: 'hourly' },
                        { label: 'Fixed Rate', value: 'fixed' },
                      ]}
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <div
                      className="text-3xl font-bold"
                      style={{
                        background:
                          'linear-gradient(to right, var(--fine-blue), var(--fine-blue-dark))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      ₹{professionalData.rate.amount}
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--fine-blue)' }}>
                      per {professionalData.rate.type === 'hourly' ? 'hour' : 'project'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Name & Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Display Name */}
              <div>
                <Label>
                  Display Name <span className="text-destructive">*</span>
                </Label>
                {isEditingProfessional ? (
                  <Input
                    type="text"
                    value={editData.displayName}
                    onChange={e => setEditData(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="Your professional display name"
                  />
                ) : (
                  <div className="text-lg font-semibold text-card-foreground py-2">
                    {professionalData.displayName}
                  </div>
                )}
              </div>

              {/* About Me - Section Card */}
              <div
                className="border-l-4 pl-4 rounded-lg p-4"
                style={{
                  background: 'var(--section-blue)',
                  borderColor: 'var(--section-blue-border)',
                }}
              >
                <Label>
                  About You <span className="text-destructive">*</span>
                </Label>
                {isEditingProfessional ? (
                  <textarea
                    value={editData.aboutMe}
                    onChange={e => setEditData(prev => ({ ...prev, aboutMe: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none resize-none text-sm bg-background text-foreground"
                    placeholder="Tell clients about your experience, specialties, and what makes you unique..."
                  />
                ) : (
                  <div className="text-card-foreground text-sm leading-relaxed whitespace-pre-wrap">
                    {professionalData.aboutMe}
                  </div>
                )}
              </div>

              {/* Specialties Section */}
              <div
                className="border-l-4 pl-4 rounded-lg p-4"
                style={{
                  background: 'var(--section-red)',
                  borderColor: 'var(--section-red-border)',
                }}
              >
                <Label>
                  Specialties <span className="text-destructive">*</span>
                </Label>
                {isEditingProfessional ? (
                  <div className="space-y-3">
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => {
                        setSearchInput('');
                        setShowAddModal('skill');
                      }}
                      iconLeft={<Plus className="w-4 h-4" />}
                    >
                      Add Specialty
                    </Button>
                    <div className="flex flex-wrap gap-2">
                      {editData.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent text-accent-foreground rounded-full text-sm font-medium"
                        >
                          {skill}
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="hover:opacity-70"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    {editData.skills.length >= 10 && (
                      <p className="text-xs text-destructive">Maximum 10 specialties allowed</p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {professionalData.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent text-accent-foreground rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Service Cities Section */}
              <div
                className="border-l-4 pl-4 rounded-lg p-4"
                style={{
                  background: 'var(--section-green)',
                  borderColor: 'var(--section-green-border)',
                }}
              >
                <Label>
                  Service Cities <span className="text-destructive">*</span>
                </Label>
                {isEditingProfessional ? (
                  <div className="space-y-3">
                    <Button
                      variant="green"
                      fullWidth
                      onClick={() => {
                        setSearchInput('');
                        setShowAddModal('city');
                      }}
                      iconLeft={<Plus className="w-4 h-4" />}
                    >
                      Add City
                    </Button>
                    <div className="flex flex-wrap gap-2">
                      {editData.cities.map((city, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
                        >
                          <MapPin className="w-3 h-3" />
                          {city}
                          <button
                            onClick={() => handleRemoveCity(city)}
                            className="hover:opacity-70"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {professionalData.cities.map((city, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
                      >
                        <MapPin className="w-3 h-3" />
                        {city}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Availability Schedule Section */}
        <div className="bg-card rounded-2xl shadow-sm p-8 border border-border">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground">Availability Schedule</h3>
            </div>
            {!isEditingAvailability ? (
              <Button
                variant="primary"
                onClick={() => {
                  setEditData({ ...professionalData });
                  setIsEditingAvailability(true);
                }}
              >
                Edit Schedule
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditData({ ...professionalData });
                    setIsEditingAvailability(false);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="green" onClick={handleSaveAvailability}>
                  Save Schedule
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {daysOfWeek.map(day => {
              const dayName = day.charAt(0).toUpperCase() + day.slice(1);
              const slots = isEditingAvailability
                ? editData.availability[day]
                : professionalData.availability[day];
              const isAvailable = slots && slots.length > 0;

              return (
                <div
                  key={day}
                  className="border border-border rounded-lg p-4 hover:border-primary transition-colors bg-card"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isAvailable ? 'bg-primary/10' : 'bg-muted'
                      }`}
                    >
                      {isAvailable ? (
                        <CheckCircle className="w-4 h-4 text-primary" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-card-foreground text-sm">{dayName}</h4>
                      <p className="text-xs text-muted-foreground">
                        {isAvailable
                          ? `${slots?.length} slot${slots && slots.length > 1 ? 's' : ''}`
                          : 'Off'}
                      </p>
                    </div>
                  </div>

                  {slots && slots.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {slots.map((slot, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-muted">
                          {isEditingAvailability ? (
                            <>
                              <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                              <input
                                type="time"
                                value={slot.startTime}
                                onChange={e =>
                                  handleTimeSlotChange(day, idx, 'startTime', e.target.value)
                                }
                                className="flex-1 px-2 py-1 border border-input rounded text-xs focus:ring-2 focus:ring-ring focus:border-transparent outline-none bg-background text-foreground"
                              />
                              <span className="text-muted-foreground text-xs">to</span>
                              <input
                                type="time"
                                value={slot.endTime}
                                onChange={e =>
                                  handleTimeSlotChange(day, idx, 'endTime', e.target.value)
                                }
                                className="flex-1 px-2 py-1 border border-input rounded text-xs focus:ring-2 focus:ring-ring focus:border-transparent outline-none bg-background text-foreground"
                              />
                              <button
                                onClick={() => handleRemoveTimeSlot(day, idx)}
                                className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors flex-shrink-0"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                              <span className="text-xs text-card-foreground font-medium">
                                {slot.startTime} - {slot.endTime}
                              </span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {isEditingAvailability && (
                    <Button
                      onClick={() => handleAddTimeSlot(day)}
                      disabled={slots && slots.length >= 3}
                      variant={slots && slots.length >= 3 ? 'ghost' : 'blue'}
                      fullWidth
                      className="text-xs py-2"
                      iconLeft={<Plus className="w-3 h-3" />}
                    >
                      Add Slot
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Unified Modal */}
      <UnifiedModal
        type={showAddModal as 'skill' | 'city'}
        isOpen={showAddModal !== null}
        onClose={() => setShowAddModal(null)}
        items={showAddModal === 'skill' ? filteredSkills : filteredCities}
        onSelect={showAddModal === 'skill' ? handleAddSkill : handleAddCity}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
      />
    </div>
  );
};

export default WorkerProfessionalSections;
