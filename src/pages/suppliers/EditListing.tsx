import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { useAuthStore } from '@/store';
import { suppliersService } from '@/services/suppliers.service';
import { supabase } from '@/lib/supabase';
import type { SupplierListing, Material } from '@/types/materials.types';
import { 
  ArrowLeft, Upload, X, Package, MapPin, DollarSign, 
  FileText, Camera, Save, AlertCircle, CheckCircle
} from '@/lib/icons';

interface EditListingForm {
  title: string;
  material_id: string;
  price: number;
  min_quantity: number;
  stock_quantity: number;
  location: string;
  description: string;
  photos: (File | string)[];
  availability_status: 'available' | 'out_of_stock' | 'limited';
  status: 'active' | 'inactive';
}

export function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [listing, setListing] = useState<SupplierListing | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<EditListingForm>({
    title: '',
    material_id: '',
    price: 0,
    min_quantity: 1,
    stock_quantity: 100,
    location: '',
    description: '',
    photos: [],
    availability_status: 'available',
    status: 'active'
  });

  const [selectedSector, setSelectedSector] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);

  // Load listing data
  useEffect(() => {
    const loadListing = async () => {
      if (!id || !user) return;

      try {
        const listingData = await suppliersService.getListing(id);
        
        if (!listingData) {
          setError('Listing not found');
          return;
        }

        // Check if user owns this listing
        if (listingData.supplier_id !== user.id) {
          setError('You do not have permission to edit this listing');
          return;
        }

        setListing(listingData);
        
        // Populate form with existing data
        setFormData({
          title: listingData.title || listingData.material?.name || 'Untitled Listing',
          material_id: listingData.material_id || '',
          price: listingData.price || 0,
          min_quantity: listingData.min_quantity || 1,
          stock_quantity: listingData.stock_quantity || 100,
          location: listingData.location || '',
          description: listingData.description || '',
          photos: listingData.photos || [],
          availability_status: listingData.availability_status || 'available',
          status: listingData.status || 'active'
        });

        // Set photo previews
        if (listingData.photos) {
          setPhotoPreviewUrls(listingData.photos);
        }

        // Set selected sector and category if material exists
        if (listingData.material) {
          setSelectedSector(listingData.material.sector || '');
          setSelectedCategory(listingData.material.category || '');
        }

      } catch (error) {
        console.error('Error loading listing:', error);
        setError(`Failed to load listing data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    loadListing();
  }, [id, user]);

  // Load materials and sectors
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load materials
        const { data: materialsData, error: materialsError } = await supabase
          .from('materials')
          .select('*')
          .order('name');

        if (materialsError) throw materialsError;
        setMaterials(materialsData || []);

        // Extract unique sectors
        const uniqueSectors = [...new Set(materialsData?.map(m => m.sector).filter(Boolean))];
        setSectors(uniqueSectors);

      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  // Update categories when sector changes
  useEffect(() => {
    if (selectedSector) {
      const sectorMaterials = materials.filter(m => m.sector === selectedSector);
      const uniqueCategories = [...new Set(sectorMaterials.map(m => m.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } else {
      setCategories([]);
    }
  }, [selectedSector, materials]);

  const handleInputChange = (field: keyof EditListingForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSectorChange = (sector: string) => {
    setSelectedSector(sector);
    setSelectedCategory('');
    setFormData(prev => ({ ...prev, material_id: '' }));
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setFormData(prev => ({ ...prev, material_id: '' }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (formData.photos.length + files.length > 5) {
      setError('Maximum 5 photos allowed');
      return;
    }

    // Validate file types and sizes
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Each photo must be less than 5MB');
        return;
      }
    }

    // Add new files to photos array
    const newPhotos = [...formData.photos, ...files];
    setFormData(prev => ({ ...prev, photos: newPhotos }));

    // Create preview URLs for new files
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPhotoPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removePhoto = (index: number) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    const newPreviewUrls = photoPreviewUrls.filter((_, i) => i !== index);
    
    setFormData(prev => ({ ...prev, photos: newPhotos }));
    setPhotoPreviewUrls(newPreviewUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;

    // Validation
    if (!formData.title.trim()) {
      setError('Product title is required');
      return;
    }
    if (!formData.material_id) {
      setError('Please select a material');
      return;
    }
    if (formData.price <= 0) {
      setError('Price must be greater than 0');
      return;
    }
    if (!formData.location.trim()) {
      setError('Location is required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Handle photo uploads for new files
      let photoUrls: string[] = [];
      
      for (const photo of formData.photos) {
        if (typeof photo === 'string') {
          // Existing photo URL
          photoUrls.push(photo);
        } else {
          // New file to upload
          const uploadedUrls = await suppliersService.uploadPhotos([photo], user.id);
          photoUrls.push(...uploadedUrls);
        }
      }

      // Update the listing
      await suppliersService.updateListing(id, {
        ...formData,
        photos: photoUrls.length > 0 ? photoUrls : null
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/suppliers/listings');
      }, 2000);

    } catch (error: any) {
      console.error('Error updating listing:', error);
      setError(error.message || 'Failed to update listing');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-marketplace section-padding">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-neutral-200 rounded w-64"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-16 bg-neutral-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && !listing) {
    return (
      <Layout>
        <div className="container-marketplace section-padding">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-900 mb-2">Error</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={() => navigate('/suppliers/listings')}
              className="btn-primary"
            >
              Back to My Listings
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const availableMaterials = materials.filter(material => {
    if (!selectedSector) return false;
    if (selectedSector && material.sector !== selectedSector) return false;
    if (selectedCategory && material.category !== selectedCategory) return false;
    return true;
  });

  return (
    <Layout>
      <div className="bg-neutral-50 min-h-screen">
        <div className="container-marketplace section-padding">
          {/* Header */}
          <div className="mb-8">
            <button 
              onClick={() => navigate('/suppliers/listings')} 
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to My Listings</span>
            </button>

            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Edit Listing</h1>
            <p className="text-neutral-600">Update your product information and settings</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-green-800 font-medium">Listing updated successfully!</p>
                <p className="text-green-700 text-sm">Redirecting to your listings...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <div className="bg-white rounded-lg border border-neutral-200 p-6">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Basic Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Product Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="e.g., High-Quality Steel Bars - Grade A"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Sector *
                        </label>
                        <select
                          value={selectedSector}
                          onChange={(e) => handleSectorChange(e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          required
                        >
                          <option value="">Select Sector</option>
                          {sectors.map(sector => (
                            <option key={sector} value={sector}>{sector}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Category *
                        </label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => handleCategoryChange(e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          disabled={!selectedSector}
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Material *
                        </label>
                        <select
                          value={formData.material_id}
                          onChange={(e) => handleInputChange('material_id', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          disabled={!selectedCategory}
                          required
                        >
                          <option value="">Select Material</option>
                          {availableMaterials.map(material => (
                            <option key={material.id} value={material.id}>
                              {material.name} ({material.unit})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing & Inventory */}
                <div className="bg-white rounded-lg border border-neutral-200 p-6">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Pricing & Inventory
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Price (RWF) *
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Minimum Order Quantity
                      </label>
                      <input
                        type="number"
                        value={formData.min_quantity}
                        onChange={(e) => handleInputChange('min_quantity', parseInt(e.target.value) || 1)}
                        placeholder="1"
                        min="1"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        value={formData.stock_quantity}
                        onChange={(e) => handleInputChange('stock_quantity', parseInt(e.target.value) || 0)}
                        placeholder="100"
                        min="0"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Location & Description */}
                <div className="bg-white rounded-lg border border-neutral-200 p-6">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location & Description
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Location *
                      </label>
                      <select
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      >
                        <option value="">Select location...</option>
                        <option value="Kigali">Kigali</option>
                        <option value="Huye">Huye</option>
                        <option value="Musanze">Musanze</option>
                        <option value="Rubavu">Rubavu</option>
                        <option value="Nyagatare">Nyagatare</option>
                        <option value="Muhanga">Muhanga</option>
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
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe your product, quality, specifications, etc."
                        rows={4}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Photos */}
                <div className="bg-white rounded-lg border border-neutral-200 p-6">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Photos (Optional)
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Photo Grid */}
                    {photoPreviewUrls.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {photoPreviewUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Product photo ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-neutral-200"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload Button */}
                    {formData.photos.length < 5 && (
                      <div>
                        <input
                          type="file"
                          id="photos"
                          multiple
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="photos"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors"
                        >
                          <Upload className="w-8 h-8 text-neutral-400 mb-2" />
                          <span className="text-sm text-neutral-600">
                            Click to upload photos ({formData.photos.length}/5)
                          </span>
                          <span className="text-xs text-neutral-500">
                            PNG, JPG, WebP up to 5MB each
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Status Settings */}
                <div className="bg-white rounded-lg border border-neutral-200 p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Status Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Listing Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Availability
                      </label>
                      <select
                        value={formData.availability_status}
                        onChange={(e) => handleInputChange('availability_status', e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="available">Available</option>
                        <option value="limited">Limited Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-lg border border-neutral-200 p-6">
                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Update Listing
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/suppliers/listings')}
                      className="w-full btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Help */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Having trouble updating your listing? Our support team is here to help.
                  </p>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}