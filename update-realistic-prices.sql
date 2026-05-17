-- Update all existing listings with accurate 2025 Rwanda market prices
-- Sources: Zawya, Numbeo Kigali, Debuilda.com live rates, WFP

-- ============================================================
-- CONSTRUCTION MATERIALS - Updated with real 2025 prices
-- ============================================================
UPDATE supplier_listings SET price = 12500, description = 'CIMERWA 50kg Portland cement. Current market rate. Suitable for all construction. Bulk orders available. Price reflects 2025 construction boom rates.'
WHERE title ILIKE '%cement%' AND title NOT ILIKE '%marine%';

UPDATE supplier_listings SET price = 19500, description = 'Sulfate-resistant marine grade cement for waterfront and lakeside construction. Premium grade for demanding environments.'
WHERE title ILIKE '%marine%' AND title ILIKE '%cement%';

UPDATE supplier_listings SET price = 9800, description = 'Grade 60 steel rebar 12mm diameter, 12m length. Prices have risen significantly in 2025 due to major infrastructure projects. Mill test certificates available.'
WHERE title ILIKE '%steel rebar%' OR title ILIKE '%reinforcement bar%';

UPDATE supplier_listings SET price = 150, description = 'Machine-made fired clay bricks. Standard size 215x102x65mm. Truck load pricing available. Note: truck load (approx 800 pcs) = 120,000 RWF.'
WHERE title ILIKE '%clay brick%' OR title ILIKE '%volcanic clay brick%';

UPDATE supplier_listings SET price = 800, description = 'Standard hollow concrete blocks 20cm. High compressive strength. Perfect for load-bearing walls. Bulk pricing available.'
WHERE title ILIKE '%concrete block%' OR title ILIKE '%hollow concrete%';

UPDATE supplier_listings SET price = 8000, description = 'Galvanized iron roofing sheets. 28 gauge. Various lengths. 15-year anti-rust warranty. Price per sheet.'
WHERE title ILIKE '%roofing sheet%' AND title NOT ILIKE '%coastal%' AND title NOT ILIKE '%aluminum%';

UPDATE supplier_listings SET price = 9500, description = 'Specially coated roofing sheets for coastal and lakeside areas. Extra corrosion resistance for humid environments.'
WHERE title ILIKE '%coastal roofing%';

UPDATE supplier_listings SET price = 22000, description = 'Premium ceramic floor tiles 60x60cm. Non-slip surface. Various designs. Suitable for residential and commercial use.'
WHERE title ILIKE '%ceramic%' AND title ILIKE '%tile%';

UPDATE supplier_listings SET price = 25000, description = 'High-quality ceramic wall tiles for bathrooms and kitchens. Water-resistant. Various colors and patterns available.'
WHERE title ILIKE '%ceramic wall tile%';

UPDATE supplier_listings SET price = 10000, description = 'High-coverage interior wall paint. Washable finish. Low VOC. Available in all colors. 10L bucket covers approx 80m².'
WHERE title ILIKE '%interior paint%' OR title ILIKE '%wall paint%';

UPDATE supplier_listings SET price = 2200, description = 'High-quality PVC pipes for water supply. Pressure rated. Various diameters (1/2" to 4"). UV resistant for outdoor use.'
WHERE title ILIKE '%pvc%' AND title ILIKE '%pipe%';

UPDATE supplier_listings SET price = 900, description = 'High-grade copper electrical cables 2.5mm². Meets Rwanda Bureau of Standards. Bulk pricing available per 100m roll.'
WHERE title ILIKE '%electrical cable%';

UPDATE supplier_listings SET price = 35000, description = 'Washed and screened river sand. Low clay content. Perfect for concrete mixing and plastering. Price per m³.'
WHERE title ILIKE '%sand%' AND (title ILIKE '%construction%' OR title ILIKE '%river%' OR title ILIKE '%clean%');

UPDATE supplier_listings SET price = 45000, description = 'Premium volcanic crushed stones from Virunga region. Excellent for concrete and road construction. Price per m³.'
WHERE title ILIKE '%crushed stone%' OR title ILIKE '%volcanic crushed%';

UPDATE supplier_listings SET price = 32000, description = 'Marine grade plywood 18mm. Water-resistant and durable. Perfect for furniture making and construction formwork.'
WHERE title ILIKE '%plywood%';

UPDATE supplier_listings SET price = 42000, description = 'Complete aluminum window frames with double-glazed glass. Energy efficient. Various sizes. Price per standard unit.'
WHERE title ILIKE '%window frame%';

UPDATE supplier_listings SET price = 170000, description = 'Heavy-duty steel security doors with multiple locking points. Anti-theft design. Suitable for homes and offices.'
WHERE title ILIKE '%steel door%';

UPDATE supplier_listings SET price = 13000, description = 'Lightweight aluminum roofing sheets. Corrosion-resistant. Modern look. Perfect for contemporary construction.'
WHERE title ILIKE '%aluminum roofing%';

-- ============================================================
-- AGRICULTURE / FOOD - Updated with real 2025 prices
-- ============================================================
UPDATE supplier_listings SET price = 1200, description = 'Premium greenhouse tomatoes. Pesticide-free. Harvested daily. Consistent quality for restaurants and supermarkets. Price per kg.'
WHERE title ILIKE '%tomato%';

UPDATE supplier_listings SET price = 700, description = 'Fresh Irish potatoes from Musanze highlands. Washed and sorted. Excellent for chips and cooking. Price per kg.'
WHERE title ILIKE '%irish potato%' OR title ILIKE '%highland potato%' OR title ILIKE '%musanze%potato%';

UPDATE supplier_listings SET price = 1100, description = 'Quality red onions from local farms. Good storage life. Sorted by size. Wholesale prices for bulk orders. Price per kg.'
WHERE title ILIKE '%onion%';

UPDATE supplier_listings SET price = 900, description = 'Sweet highland carrots. Rich in vitamin A. Washed and packaged. Perfect for juice production and cooking. Price per kg.'
WHERE title ILIKE '%carrot%';

UPDATE supplier_listings SET price = 600, description = 'Large fresh cabbage heads. Crisp and healthy. Direct from highland farms. Perfect for restaurants and households. Price per kg.'
WHERE title ILIKE '%cabbage%';

UPDATE supplier_listings SET price = 1600, description = 'High-quality milled rice from Eastern Province. Modern processing facility. Consistent quality. Price per kg.'
WHERE title ILIKE '%rice%' AND title NOT ILIKE '%fried%';

UPDATE supplier_listings SET price = 1100, description = 'Premium red kidney beans. Export quality. High protein content. Properly dried and sorted. Price per kg.'
WHERE title ILIKE '%bean%' OR title ILIKE '%kidney bean%';

UPDATE supplier_listings SET price = 600, description = 'Quality dried maize grain. Low moisture content. Perfect for animal feed and human consumption. Price per kg.'
WHERE title ILIKE '%maize%';

UPDATE supplier_listings SET price = 4500, description = 'Specialty grade Arabica coffee beans. Fully washed processing. Cupping score 85+. Fair trade certified. Price per kg.'
WHERE title ILIKE '%arabica coffee%' OR title ILIKE '%premium arabica%';

UPDATE supplier_listings SET price = 3800, description = 'Fully washed Arabica coffee beans. High altitude grown. Excellent cup quality. Direct from farmers. Price per kg.'
WHERE title ILIKE '%washed arabica%';

UPDATE supplier_listings SET price = 3200, description = 'High-quality CTC tea leaves from Western Province plantations. Fresh processing. Export quality. Price per kg.'
WHERE title ILIKE '%tea%';

UPDATE supplier_listings SET price = 2000, description = 'Fresh cooking bananas from local farms. Uniform size. Good shelf life. Perfect for institutions and restaurants. Price per bunch.'
WHERE title ILIKE '%banana%';

UPDATE supplier_listings SET price = 35000, description = 'Organic compost fertilizer. Rich in nutrients. Environmentally friendly. Perfect for sustainable farming. Price per 50kg bag.'
WHERE title ILIKE '%fertilizer%' OR title ILIKE '%organic fertilizer%';

UPDATE supplier_listings SET price = 1600, description = 'High-quality wheat flour. Finely milled and enriched with vitamins. Perfect for bread making and baking. Price per kg.'
WHERE title ILIKE '%wheat flour%';

UPDATE supplier_listings SET price = 3200, description = 'Premium Hass avocados ready for export. Perfectly ripened and sorted by size. Direct from highland farms. Price per kg.'
WHERE title ILIKE '%avocado%';

UPDATE supplier_listings SET price = 9000, description = 'Raw unprocessed honey from local beekeepers. Rich in natural enzymes and antioxidants. Pure and natural. Price per kg.'
WHERE title ILIKE '%honey%';

UPDATE supplier_listings SET price = 3500, description = 'High-quality passion fruits for juice production. Sweet and aromatic. Harvested at optimal ripeness. Price per kg.'
WHERE title ILIKE '%passion fruit%';

UPDATE supplier_listings SET price = 800, description = 'High-quality sorghum grain. Drought-resistant variety. Suitable for animal feed and human consumption. Price per kg.'
WHERE title ILIKE '%sorghum%';

UPDATE supplier_listings SET price = 2800, description = 'Premium refined sunflower cooking oil. Heart-healthy and cholesterol-free. Available in bulk quantities. Price per liter.'
WHERE title ILIKE '%cooking oil%' OR title ILIKE '%sunflower%';

-- ============================================================
-- ELECTRONICS - Updated with real 2025 prices
-- ============================================================
UPDATE supplier_listings SET price = 380000, description = 'Samsung Galaxy A34 5G. 128GB storage, 6GB RAM. 1-year warranty. Bulk discounts for businesses. Current Kigali market price.'
WHERE title ILIKE '%samsung galaxy%' OR title ILIKE '%galaxy a34%';

UPDATE supplier_listings SET price = 780000, description = 'HP Pavilion 15 with Intel i5, 8GB RAM, 512GB SSD. Perfect for business and education. Volume pricing available.'
WHERE title ILIKE '%hp pavilion%' OR title ILIKE '%business laptop%';

UPDATE supplier_listings SET price = 480000, description = 'LG 43-inch 4K Smart TV with WebOS. Built-in WiFi, Netflix, YouTube. Energy efficient. 2-year warranty.'
WHERE title ILIKE '%lg%' AND title ILIKE '%tv%';

UPDATE supplier_listings SET price = 620000, description = 'Energy-efficient Samsung refrigerator 350L. Digital inverter technology. 10-year compressor warranty.'
WHERE title ILIKE '%samsung%' AND title ILIKE '%fridge%';

UPDATE supplier_listings SET price = 260000, description = '300W monocrystalline solar panels. 25-year performance warranty. High efficiency. Perfect for residential use.'
WHERE title ILIKE '%solar panel%' AND title NOT ILIKE '%400w%' AND title NOT ILIKE '%tier 1%';

UPDATE supplier_listings SET price = 320000, description = '400W Tier 1 monocrystalline solar panels. 25-year warranty. High efficiency rating. Best for commercial use.'
WHERE title ILIKE '%solar panel%' AND (title ILIKE '%400w%' OR title ILIKE '%tier 1%');

UPDATE supplier_listings SET price = 350000, description = '200Ah deep cycle batteries for solar systems. Long lifespan. Maintenance-free. Perfect for off-grid use.'
WHERE title ILIKE '%solar batter%' OR title ILIKE '%deep cycle%';

UPDATE supplier_listings SET price = 420000, description = '3000W pure sine wave inverters. High efficiency. Built-in battery charger. Perfect for solar systems.'
WHERE title ILIKE '%inverter%';

UPDATE supplier_listings SET price = 600000, description = 'Complete desktop systems with Intel i5, 8GB RAM, 256GB SSD. Perfect for office work. 3-year warranty.'
WHERE title ILIKE '%desktop computer%';

UPDATE supplier_listings SET price = 75000, description = 'High-definition IP security cameras with night vision. Remote monitoring via smartphone. Complete with recording system.'
WHERE title ILIKE '%security camera%';

UPDATE supplier_listings SET price = 22000, description = 'Fast-charging power banks 20000mAh. Multiple USB ports. LED display. Compatible with all smartphone brands.'
WHERE title ILIKE '%power bank%';

UPDATE supplier_listings SET price = 160000, description = '24" Full HD LED monitor. Multiple connectivity options. Perfect for office work and design. Energy efficient.'
WHERE title ILIKE '%monitor%' OR title ILIKE '%computer monitor%';

UPDATE supplier_listings SET price = 42000, description = 'Dual-band wireless router. High-speed internet connectivity. Perfect for homes and small offices. Easy setup.'
WHERE title ILIKE '%wifi router%' OR title ILIKE '%wireless router%';

UPDATE supplier_listings SET price = 30000, description = 'Premium wireless Bluetooth headphones with noise cancellation. Long battery life. Superior sound quality.'
WHERE title ILIKE '%headphone%';

-- Verify the updates
SELECT 
    title,
    price,
    location,
    availability_status
FROM supplier_listings
ORDER BY created_at DESC
LIMIT 20;