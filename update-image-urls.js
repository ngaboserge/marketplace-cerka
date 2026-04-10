// Supabase Storage URLs for Cerka images
// These URLs will work when deployed to any hosting platform

const SUPABASE_IMAGE_URLS = {
  'cerka-logo.jpeg': 'https://kiwtbssgteuszyckttyq.supabase.co/storage/v1/object/public/images/cerka-logo.jpeg',
  'aa.JPG': 'https://kiwtbssgteuszyckttyq.supabase.co/storage/v1/object/public/images/aa.JPG',
  'bb.webp': 'https://kiwtbssgteuszyckttyq.supabase.co/storage/v1/object/public/images/bb.webp',
  'cc.webp': 'https://kiwtbssgteuszyckttyq.supabase.co/storage/v1/object/public/images/cc.webp',
  'dd.webp': 'https://kiwtbssgteuszyckttyq.supabase.co/storage/v1/object/public/images/dd.webp'
};

console.log('🔗 Supabase Image URLs:');
console.log('========================');
Object.entries(SUPABASE_IMAGE_URLS).forEach(([filename, url]) => {
  console.log(`${filename}: ${url}`);
});

export { SUPABASE_IMAGE_URLS };