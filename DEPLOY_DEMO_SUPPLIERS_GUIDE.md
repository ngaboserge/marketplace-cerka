# 🚀 Demo Suppliers Deployment Guide

## 📋 **3-Step Deployment Process**

### **Step 1: Add Missing Profile Columns**
```sql
-- Copy and paste this in Supabase SQL Editor:
-- File: add-missing-profile-columns.sql
```
This adds any missing columns to your profiles table (location, business_name, business_description, is_verified_supplier, phone).

### **Step 2: Create Demo Suppliers & Products**
```sql
-- Copy and paste this in Supabase SQL Editor:
-- File: create-demo-suppliers.sql
```
This creates 11 suppliers and 50+ product listings with images.

### **Step 3: Update Supplier Business Details**
```sql
-- Copy and paste this in Supabase SQL Editor:
-- File: update-demo-supplier-details.sql
```
This adds business names, descriptions, locations, and phone numbers to all suppliers.

---

## ✅ **What You'll Get**

### **11 Demo Suppliers**
- **Kigali**: BuildMax Construction, FreshMart Agro, DigiTech Electronics
- **Musanze**: Volcano Stone Works, Highland Fresh Produce
- **Huye**: Southern Materials Hub, Premium Coffee Collective
- **Kayonza**: Eastern Grain Processors
- **Rwamagana**: Solar Solutions East
- **Rubavu**: Lakeside Construction Co
- **Karongi**: Western Agro Processing

### **50+ Product Listings**
- **Construction Materials**: Cement, steel, bricks, roofing, tiles, paint, pipes
- **Food & Agriculture**: Vegetables, fruits, grains, coffee, tea, fertilizer
- **Electronics**: Smartphones, laptops, TVs, solar panels, batteries

### **Professional Features**
- **High-quality product images** (2 per listing)
- **Realistic Rwanda market pricing** in RWF
- **Recent listing dates** (marketplace appears active)
- **Geographic distribution** across all provinces
- **Verified supplier status** for all accounts

---

## 🔐 **Login Credentials**

**Universal Password**: `demo123`

**Sample Accounts**:
- `buildmax.kigali@demo.rw` - Construction (Kigali)
- `freshmart.kigali@demo.rw` - Agriculture (Kigali)
- `digitech.kigali@demo.rw` - Electronics (Kigali)
- `volcano.musanze@demo.rw` - Construction (Musanze)
- `highland.musanze@demo.rw` - Agriculture (Musanze)

*See DEMO_SUPPLIER_CREDENTIALS.md for complete list*

---

## 🧪 **Testing Checklist**

After deployment, verify:

### **✅ Supplier Login**
- [ ] Login with any demo account works
- [ ] Supplier dashboard shows business information
- [ ] Profile shows business name and description

### **✅ Product Listings**
- [ ] Supplier can see their listings in "My Listings"
- [ ] Product images display correctly
- [ ] Pricing shows in Rwanda Francs (RWF)

### **✅ Marketplace Browse**
- [ ] Products appear in marketplace search
- [ ] Category filtering works (Construction, Food, Electronics)
- [ ] Location filtering shows different provinces
- [ ] Product cards show images and pricing

### **✅ Messaging System**
- [ ] "Contact Supplier" button works on product details
- [ ] Messages show real supplier names (not generic placeholders)
- [ ] Conversation history displays correctly

---

## 🎯 **Expected Results**

### **Dense, Active Marketplace**
- 50+ recent listings across 3 major sectors
- Professional product photography
- Realistic pricing based on Rwanda market rates
- Geographic diversity across all 5 provinces

### **Professional Appearance**
- High-quality product images from Unsplash CDN
- Consistent visual standards
- Real business names and descriptions
- Verified supplier badges

### **Functional Features**
- Working login system with demo accounts
- Complete product catalog with images
- Functional messaging between buyers and suppliers
- Location-based price aggregation data

---

## 🔧 **Troubleshooting**

### **If Step 1 Fails**
- Some columns might already exist (this is fine)
- Script will skip existing columns automatically

### **If Step 2 Fails**
- Check if materials table exists
- Verify supplier_listings table has photos column
- Ensure profiles table has basic columns (id, email, full_name, role)

### **If Step 3 Fails**
- Make sure Step 2 completed successfully
- Verify the supplier emails were created in Step 2

### **If Images Don't Load**
- Images use Unsplash CDN (should work on any hosting)
- Check browser console for any CORS issues
- Verify photos column contains JSON array format

---

## 📊 **Database Impact**

### **New Records Created**
- **11 new profiles** (supplier accounts)
- **32 new materials** (if not already existing)
- **50+ new supplier_listings** (with images)

### **Storage Requirements**
- **Minimal database storage** (text data only)
- **No local image storage** (uses external CDN)
- **Realistic data volumes** for testing

---

## 🎉 **Success Indicators**

Your Cerka marketplace will now have:
- **Professional, dense appearance** with real product listings
- **Functional demo accounts** for testing all features
- **Realistic pricing data** for Rwanda market analysis
- **Geographic distribution** showing nationwide supplier network
- **High-quality imagery** improving user experience and engagement

The marketplace will look and feel like an established, active B2B platform with real suppliers and products across Rwanda.