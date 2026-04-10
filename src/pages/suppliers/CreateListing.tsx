import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuppliersStore, useMaterialsStore, useAuthStore } from '../../store';
import { supabase } from '../../lib/supabase';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Textarea } from '../../components/ui/Textarea';
import { toast } from '../../components/ui/Toast';
import { 
  ArrowLeft, DollarSign, Building, Wheat, Meat, Smartphone, 
  Car, Home as HomeIcon, Tool, Cow, Lightning, Hammer, Box,
  Camera, MessageCircle, CheckCircle, Plus, X
} from '../../lib/icons';
import type { ListingForm } from '../../types/materials.types';

export default function CreateListing() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { materials, fetchMaterials } = useMaterialsStore();
  const { createListing, loading } = useSuppliersStore();

  const [formData, setFormData] = useState<Partial<ListingForm>>({
    photos: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [showCustomMaterial, setShowCustomMaterial] = useState(false);
  const [customMaterialName, setCustomMaterialName] = useState('');
  const [customMaterialUnit, setCustomMaterialUnit] = useState('');
  const [customUnitInput, setCustomUnitInput] = useState('');
  const [customMaterialDescription, setCustomMaterialDescription] = useState('');
  const [creatingCustomMaterial, setCreatingCustomMaterial] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string[]>([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [isDragging, setIsDragging] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  const selectedMaterial = materials.find(m => m.id === formData.material_id);

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Update available categories when materials or sector changes
  useEffect(() => {
    if (selectedSector && materials.length > 0) {
      const sectorMaterials = materials.filter(m => m.sector === selectedSector);
      const categories = [...new Set(sectorMaterials.map(m => m.category))].sort();
      setAvailableCategories(categories);
      
      // Reset category selection if current category is not available
      if (selectedCategory && !categories.includes(selectedCategory)) {
        setSelectedCategory('');
        updateField('material_id', '');
      }
    } else {
      setAvailableCategories([]);
      setSelectedCategory('');
    }
  }, [selectedSector, materials]);

  // Group materials by sector, then by category
  const sectors = [
    { value: 'construction', label: 'Construction', icon: <Building className="w-4 h-4" /> },
    { value: 'agriculture', label: 'Agriculture', icon: <Wheat className="w-4 h-4" /> },
    { value: 'food', label: 'Food & Commodities', icon: <Meat className="w-4 h-4" /> },
    { value: 'electronics', label: 'Electronics', icon: <Smartphone className="w-4 h-4" /> },
    { value: 'vehicles', label: 'Vehicles', icon: <Car className="w-4 h-4" /> },
    { value: 'rentals', label: 'Real Estate', icon: <HomeIcon className="w-4 h-4" /> },
    { value: 'services', label: 'Services', icon: <Tool className="w-4 h-4" /> },
    { value: 'livestock', label: 'Livestock', icon: <Cow className="w-4 h-4" /> },
    { value: 'energy', label: 'Energy & Utilities', icon: <Lightning className="w-4 h-4" /> },
    { value: 'hardware', label: 'Hardware & Tools', icon: <Hammer className="w-4 h-4" /> },
  ];

  // Filter materials by selected sector and category
  const filteredMaterials = selectedSector
    ? materials.filter(m => {
        const matchesSector = m.sector === selectedSector;
        const matchesCategory = !selectedCategory || m.category === selectedCategory;
        return matchesSector && matchesCategory;
      })
    : [];

  const updateField = (field: keyof ListingForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (showCustomMaterial) {
      if (!customMaterialName.trim()) newErrors.custom_material_name = 'Material name is required';
      if (!customMaterialUnit) newErrors.custom_material_unit = 'Unit is required';
    } else {
      if (!formData.material_id) newErrors.material_id = 'Material is required';
    }
    
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.location) newErrors.location = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateCustomMaterial = async () => {
    const newErrors: Record<string, string> = {};
    if (!customMaterialName.trim()) newErrors.custom_material_name = 'Material name is required';
    if (!customMaterialUnit) newErrors.custom_material_unit = 'Unit is required';
    if (customMaterialUnit === 'custom' && !customUnitInput.trim()) {
      newErrors.custom_unit_input = 'Please enter a custom unit';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalUnit = customMaterialUnit === 'custom' ? customUnitInput.trim() : customMaterialUnit;

    setCreatingCustomMaterial(true);
    try {
      const { materialsService } = await import('../../services/materials.service');
      
      const newMaterial = await materialsService.createMaterial({
        name: customMaterialName.trim(),
        unit: finalUnit,
        category: customMaterialDescription || 'Custom',
        sector: selectedSector,
        icon: '📦'
      });

      await fetchMaterials();
      
      if (newMaterial && newMaterial.id) {
        updateField('material_id', newMaterial.id);
      }
      
      setShowCustomMaterial(false);
      setCustomMaterialName('');
      setCustomMaterialUnit('');
      setCustomUnitInput('');
      setCustomMaterialDescription('');
      
      toast('success', 'Material added successfully!');
    } catch (error: any) {
      console.error('Error creating custom material:', error);
      toast('error', error.message || 'Failed to add material');
    } finally {
      setCreatingCustomMaterial(false);
    }
  };

  const uploadPhotos = async (): Promise<string[]> => {
    if (photoFiles.length === 0) return [];

    setUploadingPhotos(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of photoFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user!.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error } = await supabase.storage
          .from('listing-photos')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('listing-photos')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      return uploadedUrls;
    } catch (error: any) {
      console.error('Error uploading photos:', error);
      toast('error', 'Failed to upload some photos');
      return uploadedUrls;
    } finally {
      setUploadingPhotos(false);
    }
  };

  const validateAndAddFiles = (newFiles: File[]) => {
    if (newFiles.length === 0) {
      toast('error', 'No files selected');
      return false;
    }

    const totalCount = photoFiles.length + newFiles.length;
    if (totalCount > 5) {
      toast('error', `Maximum 5 photos allowed. You can add ${5 - photoFiles.length} more.`);
      return false;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/jpe', 'image/pjpeg'];
    const invalidFiles = newFiles.filter(f => !validTypes.includes(f.type.toLowerCase()));
    if (invalidFiles.length > 0) {
      toast('error', `Invalid file type: ${invalidFiles[0].name}. Only JPEG, PNG, and WebP are allowed.`);
      return false;
    }

    const oversizedFiles = newFiles.filter(f => f.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast('error', 'Some files exceed 5MB limit');
      return false;
    }

    const allFiles = [...photoFiles, ...newFiles];
    setPhotoFiles(allFiles);

    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    const allPreviews = [...photoPreview, ...newPreviews];
    setPhotoPreview(allPreviews);

    toast('success', `${newFiles.length} photo(s) added`);
    return true;
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (validateAndAddFiles(files)) {
      e.target.value = '';
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    validateAndAddFiles(files);
  };

  const removePhoto = (index: number) => {
    const newFiles = photoFiles.filter((_, i) => i !== index);
    const newPreviews = photoPreview.filter((_, i) => i !== index);
    
    URL.revokeObjectURL(photoPreview[index]);
    
    setPhotoFiles(newFiles);
    setPhotoPreview(newPreviews);
    
    setFileInputKey(Date.now());
  };

  const handleSubmit = async () => {
    if (!user) {
      toast('error', 'Please log in to create listings');
      return;
    }

    if (!validate()) return;

    try {
      let photoUrls: string[] = [];
      if (photoFiles.length > 0) {
        toast('info', 'Uploading photos...');
        photoUrls = await uploadPhotos();
      }

      // Map form data to match supplier_listings table structure
      const materialName = selectedMaterial?.name || 'Custom Product';
      const listingData = {
        material_id: formData.material_id!,
        title: `${materialName} - ${formData.location || 'Rwanda'}`,
        description: formData.description || `High quality ${materialName.toLowerCase()} available for purchase.`,
        price: formData.price!,
        min_quantity: 1,
        photos: photoUrls.length > 0 ? photoUrls : null,
        delivery_available: true,
        delivery_cost: null,
        delivery_time_days: 3
      };

      await createListing(listingData as any, user.id);
      toast('success', 'Listing created successfully!');
      
      photoPreview.forEach(url => URL.revokeObjectURL(url));
      
      setTimeout(() => {
        navigate('/suppliers/listings');
      }, 2000);
    } catch (error: any) {
      toast('error', error.message || 'Failed to create listing');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="container-marketplace section-padding">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => navigate('/suppliers/listings')} 
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Listings</span>
            </button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Create New Listing
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Showcase your products to thousands of buyers across Rwanda
            </p>
          </div>

          {/* Trust Banner */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">Secure & Professional</h3>
                <p className="text-neutral-700 mb-3">
                  Your listing will be visible to verified buyers. All communication happens through our secure messaging system.
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>No personal contact sharing required</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>Professional buyer verification</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="p-8 space-y-8">
              {/* Sector Selection */}
              <div>
                <label className="block text-lg font-bold text-neutral-900 mb-4">
                  1. Choose Your Product Category
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {sectors.map(sector => (
                    <button
                      key={sector.value}
                      type="button"
                      onClick={() => {
                        setSelectedSector(sector.value);
                        setSelectedCategory('');
                        updateField('material_id', '');
                      }}
                      className={`
                        p-4 rounded-xl border-2 transition-all text-center hover:shadow-md
                        ${selectedSector === sector.value 
                          ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-500/20' 
                          : 'border-neutral-200 bg-white hover:border-neutral-300'
                        }
                      `}
                    >
                      <div className={`w-8 h-8 mx-auto mb-2 flex items-center justify-center rounded-lg ${
                        selectedSector === sector.value ? 'bg-blue-100 text-blue-600' : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        {sector.icon}
                      </div>
                      <div className={`text-sm font-medium ${
                        selectedSector === sector.value ? 'text-blue-900' : 'text-neutral-900'
                      }`}>
                        {sector.label}
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-sm text-neutral-500 mt-3">
                  Select the category that best matches your product
                </p>
              </div>

              {/* Category Selection */}
              {selectedSector && (
                <div>
                  <label className="block text-lg font-bold text-neutral-900 mb-4">
                    2. Choose Product Category
                  </label>
                  {availableCategories.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {availableCategories.map(category => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(category);
                            updateField('material_id', '');
                          }}
                          className={`
                            p-4 rounded-xl border-2 transition-all text-center hover:shadow-md
                            ${selectedCategory === category 
                              ? 'border-green-500 bg-green-50 shadow-md ring-2 ring-green-500/20' 
                              : 'border-neutral-200 bg-white hover:border-neutral-300'
                            }
                          `}
                        >
                          <div className={`w-8 h-8 mx-auto mb-2 flex items-center justify-center rounded-lg ${
                            selectedCategory === category ? 'bg-green-100 text-green-600' : 'bg-neutral-100 text-neutral-600'
                          }`}>
                            <Box className="w-4 h-4" />
                          </div>
                          <div className={`text-sm font-medium ${
                            selectedCategory === category ? 'text-green-900' : 'text-neutral-900'
                          }`}>
                            {category}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-neutral-50 rounded-xl border-2 border-dashed border-neutral-300">
                      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Box className="w-8 h-8 text-neutral-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                        No Categories Available
                      </h3>
                      <p className="text-neutral-600 mb-4">
                        There are no product categories available for {sectors.find(s => s.value === selectedSector)?.label}.
                      </p>
                      <p className="text-sm text-neutral-500">
                        You can add a custom product below.
                      </p>
                    </div>
                  )}
                  <p className="text-sm text-neutral-500 mt-3">
                    Select the category that best matches your product
                  </p>
                </div>
              )}

              {/* Material Selection */}
              {selectedSector && (selectedCategory || availableCategories.length === 0) && (
                <div>
                  <label className="block text-lg font-bold text-neutral-900 mb-4">
                    {availableCategories.length > 0 ? '3. Select Your Product' : '2. Select Your Product'}
                  </label>
                  <div className="space-y-4">
                    {filteredMaterials.length > 0 ? (
                      <select
                        value={formData.material_id || ''}
                        onChange={(e) => {
                          if (e.target.value === 'custom') {
                            setShowCustomMaterial(true);
                            updateField('material_id', '');
                          } else {
                            setShowCustomMaterial(false);
                            updateField('material_id', e.target.value);
                          }
                        }}
                        className="w-full px-4 py-4 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      >
                        <option value="">Choose a product...</option>
                        {filteredMaterials.map(material => (
                          <option key={material.id} value={material.id}>
                            {material.name} (sold per {material.unit})
                          </option>
                        ))}
                        <option value="custom" className="font-semibold text-blue-700">
                          ➕ Add Custom Product
                        </option>
                      </select>
                    ) : (
                      <div className="text-center py-8 bg-blue-50 rounded-xl border-2 border-dashed border-blue-300">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Plus className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                          No Products Available
                        </h3>
                        <p className="text-neutral-600 mb-4">
                          {selectedCategory 
                            ? `No products found in ${selectedCategory} category.`
                            : `No products found in ${sectors.find(s => s.value === selectedSector)?.label} sector.`
                          }
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowCustomMaterial(true)}
                          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                          Add Custom Product
                        </button>
                      </div>
                    )}
                    {errors.material_id && (
                      <p className="text-sm text-red-600 flex items-center gap-2">
                        <X className="w-4 h-4" />
                        {errors.material_id}
                      </p>
                    )}
                    {selectedMaterial && !showCustomMaterial && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-sm font-medium text-blue-900 mb-1">Selected Product:</p>
                        <p className="text-blue-700">{selectedMaterial.name} • Category: {selectedMaterial.category}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Custom Material Form */}
              {showCustomMaterial && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Plus className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900">Add Custom Product</h3>
                      <p className="text-neutral-600">Create a new product for the marketplace</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={customMaterialName}
                        onChange={(e) => setCustomMaterialName(e.target.value)}
                        placeholder="e.g., Premium Steel Rods"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      {errors.custom_material_name && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                          <X className="w-4 h-4" />
                          {errors.custom_material_name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Unit of Sale *
                      </label>
                      <select
                        value={customMaterialUnit}
                        onChange={(e) => setCustomMaterialUnit(e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="">Select unit...</option>
                        <option value="kg">Kilogram (kg)</option>
                        <option value="piece">Piece</option>
                        <option value="meter">Meter</option>
                        <option value="liter">Liter</option>
                        <option value="bag">Bag</option>
                        <option value="box">Box</option>
                        <option value="truck">Truck</option>
                        <option value="ton">Ton</option>
                        <option value="custom">Custom Unit</option>
                      </select>
                      {errors.custom_material_unit && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                          <X className="w-4 h-4" />
                          {errors.custom_material_unit}
                        </p>
                      )}
                    </div>

                    {customMaterialUnit === 'custom' && (
                      <div>
                        <label className="block text-sm font-semibold text-neutral-900 mb-2">
                          Custom Unit *
                        </label>
                        <input
                          type="text"
                          value={customUnitInput}
                          onChange={(e) => setCustomUnitInput(e.target.value)}
                          placeholder="e.g., bundle, roll, sheet"
                          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                        {errors.custom_unit_input && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                            <X className="w-4 h-4" />
                            {errors.custom_unit_input}
                          </p>
                        )}
                      </div>
                    )}

                    <div className={customMaterialUnit === 'custom' ? '' : 'md:col-span-2'}>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Product Description (Optional)
                      </label>
                      <textarea
                        value={customMaterialDescription}
                        onChange={(e) => setCustomMaterialDescription(e.target.value)}
                        placeholder="Brief description of your product..."
                        rows={3}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <button
                      type="button"
                      onClick={handleCreateCustomMaterial}
                      disabled={creatingCustomMaterial}
                      className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {creatingCustomMaterial ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Create Product
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomMaterial(false);
                        setCustomMaterialName('');
                        setCustomMaterialUnit('');
                        setCustomUnitInput('');
                        setCustomMaterialDescription('');
                      }}
                      className="flex-1 sm:flex-none bg-neutral-200 text-neutral-700 px-6 py-3 rounded-xl font-semibold hover:bg-neutral-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Price and Location */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-lg font-bold text-neutral-900 mb-4">
                    {availableCategories.length > 0 ? '4. Set Your Price' : '3. Set Your Price'}
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="number"
                      placeholder="0.00"
                      value={formData.price || ''}
                      onChange={(e) => updateField('price', parseFloat(e.target.value))}
                      className="w-full pl-12 pr-4 py-4 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-500">
                      RWF per {selectedMaterial?.unit || 'unit'}
                    </div>
                  </div>
                  {errors.price && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                      <X className="w-4 h-4" />
                      {errors.price}
                    </p>
                  )}
                  <p className="text-sm text-neutral-500 mt-2">
                    Set a competitive price based on market rates
                  </p>
                </div>

                <div>
                  <label className="block text-lg font-bold text-neutral-900 mb-4">
                    {availableCategories.length > 0 ? '5. Choose Location' : '4. Choose Location'}
                  </label>
                  <select
                    value={formData.location || ''}
                    onChange={(e) => updateField('location', e.target.value)}
                    className="w-full px-4 py-4 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  >
                    <option value="">Select your location...</option>
                    <option value="Kigali">Kigali</option>
                    <option value="Huye">Huye</option>
                    <option value="Musanze">Musanze</option>
                    <option value="Rubavu">Rubavu</option>
                    <option value="Muhanga">Muhanga</option>
                    <option value="Nyagatare">Nyagatare</option>
                    <option value="Rusizi">Rusizi</option>
                    <option value="Kayonza">Kayonza</option>
                    <option value="Nyanza">Nyanza</option>
                    <option value="Rwamagana">Rwamagana</option>
                    <option value="Burera">Burera</option>
                    <option value="Gakenke">Gakenke</option>
                    <option value="Gasabo">Gasabo</option>
                    <option value="Kicukiro">Kicukiro</option>
                    <option value="Nyarugenge">Nyarugenge</option>
                  </select>
                  {errors.location && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                      <X className="w-4 h-4" />
                      {errors.location}
                    </p>
                  )}
                  <p className="text-sm text-neutral-500 mt-2">
                    Buyers will see your general location for price comparison
                  </p>
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-lg font-bold text-neutral-900 mb-4">
                  {availableCategories.length > 0 ? '6. Add Product Photos (Optional)' : '5. Add Product Photos (Optional)'}
                </label>
                <div
                  className={`
                    border-2 border-dashed rounded-xl p-8 text-center transition-all
                    ${isDragging 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-neutral-300 hover:border-blue-400 hover:bg-blue-50'
                    }
                  `}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    Upload Product Photos
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    High-quality photos help buyers trust your products and increase sales
                  </p>
                  <div className="space-y-2 text-sm text-neutral-500 mb-6">
                    <p>• Upload up to 5 photos</p>
                    <p>• JPEG, PNG, WebP formats</p>
                    <p>• Maximum 5MB per photo</p>
                  </div>
                  <input
                    key={fileInputKey}
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handlePhotoSelect}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="btn-primary cursor-pointer inline-flex items-center gap-2 px-6 py-3 text-lg"
                  >
                    <Camera className="w-5 h-5" />
                    Choose Photos
                  </label>
                </div>

                {/* Photo Preview */}
                {photoPreview.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-neutral-900 mb-3">
                      Selected Photos ({photoPreview.length}/5)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {photoPreview.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-neutral-200"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          {index === 0 && (
                            <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                              Main
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-lg font-bold text-neutral-900 mb-4">
                  {availableCategories.length > 0 ? '7. Product Description (Optional)' : '6. Product Description (Optional)'}
                </label>
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Describe your product quality, specifications, delivery options, or any other important details buyers should know..."
                  rows={5}
                  className="w-full px-4 py-4 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
                <p className="text-sm text-neutral-500 mt-2">
                  A detailed description helps buyers understand your product better
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-neutral-50 px-8 py-6 border-t border-neutral-200">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <button 
                  type="button"
                  onClick={() => navigate('/suppliers/listings')}
                  className="btn-secondary px-6 py-3 w-full sm:w-auto"
                >
                  Save as Draft
                </button>
                <button 
                  type="button"
                  onClick={handleSubmit} 
                  disabled={loading || uploadingPhotos}
                  className="btn-primary px-8 py-3 text-lg font-semibold w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  {uploadingPhotos ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading Photos...
                    </>
                  ) : loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Listing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Publish Listing
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Help Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => {
              const messageParams = new URLSearchParams({
                userId: 'support',
                context: 'listing-help',
                subject: 'Help Creating Listing'
              });
              navigate('/messages?' + messageParams.toString());
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors flex items-center gap-2"
            title="Need help creating your listing?"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="hidden md:inline text-sm font-medium">Need Help?</span>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}