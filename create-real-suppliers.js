import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Read .env file manually (no dotenv needed)
try {
  const envFile = readFileSync(".env", "utf8");
  for (const line of envFile.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex > 0) {
        const key = trimmed.slice(0, eqIndex).trim();
        const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, "");
        process.env[key] = value;
      }
    }
  }
} catch (e) {
  // .env not found, rely on actual env vars
}

const SUPABASE_URL = "https://kiwtbssgteuszyckttyq.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY || SERVICE_ROLE_KEY === "PASTE_HERE") {
  console.error("ERROR: Set SUPABASE_SERVICE_ROLE_KEY in your .env file");
  console.error("Get it from: Supabase Dashboard > Settings > API > service_role key");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const suppliers = [
  {
    email: "patrick.uwimana@cerka.rw",
    password: "Cerka@2025",
    full_name: "Patrick Uwimana",
    business_name: "Uwimana Building Supplies",
    location: "Kigali",
    phone: "+250788301001",
    bio: "Supplying quality construction materials in Kigali since 2018. Cement, steel, bricks and finishing materials. Fast delivery within Kigali.",
    listings: [
      { material: "Portland Cement", title: "CIMERWA Portland Cement 42.5N", description: "Genuine CIMERWA cement 50kg bags. Grade 42.5N for all construction. We stock directly from factory. Minimum 10 bags. Delivery available in Kigali.", price: 12500, min_qty: 10, max_qty: 500, photos: ["https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600"] },
      { material: "Steel Reinforcement Bars", title: "Steel Rebar 12mm - Grade 60", description: "High-tensile steel rebar 12mm diameter, 12m length. Grade 60 certified. Mill test certificates available. Bulk orders get discount.", price: 9800, min_qty: 10, max_qty: 200, photos: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"] },
      { material: "Concrete Blocks", title: "Hollow Concrete Blocks 20cm", description: "Machine-made hollow concrete blocks 20cm. High compressive strength. Consistent dimensions. Perfect for load-bearing walls.", price: 800, min_qty: 100, max_qty: 5000, photos: ["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600"] },
      { material: "Iron Roofing Sheets", title: "Galvanized Roofing Sheets 28G", description: "Galvanized iron roofing sheets 28 gauge. Various lengths (2m, 2.5m, 3m). 15-year anti-rust warranty. Price per sheet.", price: 8500, min_qty: 20, max_qty: 500, photos: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600"] }
    ]
  },
  {
    email: "jean.habimana@cerka.rw",
    password: "Cerka@2025",
    full_name: "Jean Claude Habimana",
    business_name: "Volcano Stone & Aggregates",
    location: "Musanze",
    phone: "+250788302002",
    bio: "Quarry and aggregates supplier in Northern Province. Volcanic stone, sand, and crushed stones. Serving Musanze, Burera, Rulindo districts.",
    listings: [
      { material: "Crushed Stones", title: "Volcanic Crushed Stones - All Sizes", description: "Premium volcanic crushed stones from Virunga quarry. Available in 10mm, 20mm, 40mm sizes. Excellent for concrete and road construction. Price per m3.", price: 42000, min_qty: 3, max_qty: 50, photos: ["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600"] },
      { material: "River Sand", title: "Clean River Sand for Construction", description: "Washed and screened river sand. Very low clay content. Perfect for concrete mixing and plastering. Consistent quality. Price per m3.", price: 35000, min_qty: 3, max_qty: 30, photos: ["https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600"] },
      { material: "Clay Bricks", title: "Volcanic Clay Bricks - Machine Made", description: "Bricks made from volcanic clay. Superior strength and durability. Excellent thermal properties. Locally manufactured in Musanze. Price per piece.", price: 160, min_qty: 500, max_qty: 20000, photos: ["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600"] },
      { material: "Portland Cement", title: "Cement Bulk Supply - Musanze", description: "CIMERWA cement available in bulk for Northern Province projects. Competitive pricing for contractors. Delivery to Musanze, Burera, Rulindo.", price: 12800, min_qty: 20, max_qty: 1000, photos: ["https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600"] }
    ]
  },
  {
    email: "eric.nzeyimana@cerka.rw",
    password: "Cerka@2025",
    full_name: "Eric Nzeyimana",
    business_name: "Southern Finishing Materials",
    location: "Huye",
    phone: "+250788303003",
    bio: "Finishing materials specialist in Southern Province. Tiles, paint, plumbing and electrical supplies. Serving Huye, Nyanza, Gisagara.",
    listings: [
      { material: "Floor Tiles", title: "Ceramic Floor Tiles 60x60cm", description: "Premium imported ceramic floor tiles 60x60cm. Non-slip surface. Various designs and colors. Suitable for residential and commercial. Price per m2.", price: 22000, min_qty: 5, max_qty: 200, photos: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600"] },
      { material: "Wall Paint", title: "Interior Wall Paint - All Colors", description: "High-coverage interior paint. Washable finish. Low VOC formula. Available in all colors. 10L bucket covers approx 80m2. Price per liter.", price: 10000, min_qty: 5, max_qty: 100, photos: ["https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600"] },
      { material: "PVC Pipes", title: "PVC Water Pipes - All Diameters", description: "High-quality PVC pipes for water supply. Pressure rated. Available 1/2 inch to 4 inch diameter. UV resistant for outdoor use. Price per meter.", price: 2200, min_qty: 50, max_qty: 1000, photos: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600"] },
      { material: "Electrical Cables", title: "Copper Electrical Cables 2.5mm", description: "High-grade copper electrical cables 2.5mm2. Meets Rwanda Bureau of Standards. Sold per meter or per 100m roll. Bulk pricing available.", price: 900, min_qty: 100, max_qty: 5000, photos: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"] }
    ]
  },
  {
    email: "innocent.bizimana@cerka.rw",
    password: "Cerka@2025",
    full_name: "Innocent Bizimana",
    business_name: "Lakeside Hardware & Construction",
    location: "Rubavu",
    phone: "+250788304004",
    bio: "Construction materials supplier in Western Province. Specializing in materials for lakeside and humid environments. Serving Rubavu, Rutsiro, Nyamasheke.",
    listings: [
      { material: "Aluminum Roofing", title: "Aluminum Roofing Sheets - Coastal Grade", description: "Specially coated aluminum roofing sheets for humid and lakeside environments. Extra corrosion resistance. Lightweight. Price per sheet.", price: 13500, min_qty: 20, max_qty: 500, photos: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600"] },
      { material: "Portland Cement", title: "Marine Grade Cement - Sulfate Resistant", description: "Sulfate-resistant cement for waterfront and lakeside construction. Specially formulated for humid environments. Price per 50kg bag.", price: 14500, min_qty: 10, max_qty: 300, photos: ["https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600"] },
      { material: "Plywood Sheets", title: "Marine Grade Plywood 18mm", description: "High-quality marine grade plywood sheets. Water-resistant and durable. Perfect for furniture making and construction formwork. Price per sheet.", price: 32000, min_qty: 5, max_qty: 100, photos: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600"] },
      { material: "Steel Doors", title: "Security Steel Doors", description: "Heavy-duty steel doors for maximum security. Anti-theft design with multiple locking points. Suitable for homes and offices. Price per door.", price: 170000, min_qty: 1, max_qty: 20, photos: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"] }
    ]
  },
  {
    email: "agnes.mukamana@cerka.rw",
    password: "Cerka@2025",
    full_name: "Agnes Mukamana",
    business_name: "FreshMart Agro Kigali",
    location: "Kigali",
    phone: "+250788305005",
    bio: "Fresh produce aggregator in Kigali. We source directly from farmers in Musanze, Ruhango, and Kayonza. Daily supply to restaurants, hotels, and supermarkets.",
    listings: [
      { material: "Tomatoes", title: "Fresh Greenhouse Tomatoes", description: "Premium greenhouse tomatoes. Pesticide-free. Harvested daily. Consistent size and quality. Perfect for restaurants and supermarkets. Price per kg.", price: 1200, min_qty: 50, max_qty: 2000, photos: ["https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=600"] },
      { material: "Irish Potatoes", title: "Highland Irish Potatoes - Musanze", description: "Fresh Irish potatoes sourced from Musanze highlands. Washed and sorted by size. Excellent for chips and cooking. Available year-round. Price per kg.", price: 700, min_qty: 100, max_qty: 5000, photos: ["https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600"] },
      { material: "Onions", title: "Fresh Red Onions", description: "Quality red onions from Ruhango farms. Good storage life. Sorted by size. Wholesale prices for bulk orders. Price per kg.", price: 1100, min_qty: 25, max_qty: 1000, photos: ["https://images.unsplash.com/photo-1508747703725-719777637510?w=600"] },
      { material: "Carrots", title: "Fresh Carrots - Highland Grade", description: "Sweet highland carrots from Musanze. Rich in vitamin A. Washed and packaged. Perfect for juice production and cooking. Price per kg.", price: 900, min_qty: 50, max_qty: 2000, photos: ["https://images.unsplash.com/photo-1445282768818-728615cc910a?w=600"] }
    ]
  },
  {
    email: "vincent.nsengimana@cerka.rw",
    password: "Cerka@2025",
    full_name: "Vincent Nsengimana",
    business_name: "Eastern Grain Processors Ltd",
    location: "Kayonza",
    phone: "+250788306006",
    bio: "Grain processing and wholesale in Eastern Province. Modern milling facility. Supplying rice, maize, beans to wholesalers and institutions across Rwanda.",
    listings: [
      { material: "Rice", title: "Premium Milled White Rice", description: "High-quality milled rice from Eastern Province. Modern processing facility. Consistent quality. Sorted and packaged. Bulk supply for wholesalers. Price per kg.", price: 1600, min_qty: 100, max_qty: 10000, photos: ["https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=600"] },
      { material: "Red Beans", title: "Red Kidney Beans - Export Grade", description: "Premium red kidney beans. Export quality. High protein content. Properly dried and sorted. Moisture content below 14%. Price per kg.", price: 1100, min_qty: 50, max_qty: 5000, photos: ["https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=600"] },
      { material: "Maize", title: "Dried Maize Grain", description: "Quality dried maize grain. Low moisture content below 13%. Perfect for animal feed and human consumption. Bulk supply available. Price per kg.", price: 600, min_qty: 100, max_qty: 8000, photos: ["https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600"] },
      { material: "Sorghum", title: "Drought-Resistant Sorghum Grain", description: "High-quality sorghum grain. Drought-resistant variety. Suitable for animal feed and human consumption. Bulk supply from Eastern Province. Price per kg.", price: 800, min_qty: 50, max_qty: 3000, photos: ["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600"] }
    ]
  },
  {
    email: "beatrice.uwamahoro@cerka.rw",
    password: "Cerka@2025",
    full_name: "Beatrice Uwamahoro",
    business_name: "Premium Coffee & Agro Huye",
    location: "Huye",
    phone: "+250788307007",
    bio: "Specialty coffee and agricultural products from Southern Province. Fair trade certified. Supplying Arabica coffee, bananas, and seasonal produce.",
    listings: [
      { material: "Coffee Beans", title: "Specialty Arabica Coffee - Fully Washed", description: "Specialty grade Arabica coffee beans. Fully washed processing. Cupping score 85+. Fair trade certified. Sourced from Huye Mountain washing station. Price per kg.", price: 4500, min_qty: 25, max_qty: 1000, photos: ["https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600"] },
      { material: "Bananas", title: "Fresh Cooking Bananas", description: "Fresh cooking bananas from local farms in Huye. Uniform size. Good shelf life. Perfect for institutions, restaurants, and markets. Price per bunch.", price: 2000, min_qty: 20, max_qty: 500, photos: ["https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600"] },
      { material: "Fertilizer", title: "NPK Fertilizer 17-17-17", description: "Balanced NPK fertilizer 17-17-17. Suitable for all crops. Promotes healthy growth and high yields. Price per 50kg bag.", price: 38000, min_qty: 5, max_qty: 200, photos: ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600"] },
      { material: "Sweet Potatoes", title: "Orange-Fleshed Sweet Potatoes", description: "Vitamin A-rich orange-fleshed sweet potatoes. Sourced from Huye farms. Perfect for schools, hospitals, and food processors. Price per kg.", price: 500, min_qty: 100, max_qty: 5000, photos: ["https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600"] }
    ]
  },
  {
    email: "esperance.mukamazimpaka@cerka.rw",
    password: "Cerka@2025",
    full_name: "Esperance Mukamazimpaka",
    business_name: "Western Agro Processing Karongi",
    location: "Karongi",
    phone: "+250788308008",
    bio: "Tea, coffee, and agricultural processing in Western Province. Supplying processed tea, Arabica coffee, and organic fertilizers. Sustainable farming advocate.",
    listings: [
      { material: "Tea Leaves", title: "Premium CTC Tea Leaves", description: "High-quality CTC tea leaves from Western Province plantations. Fresh processing. Export quality. Consistent flavor profile. Price per kg.", price: 3200, min_qty: 25, max_qty: 1000, photos: ["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600"] },
      { material: "Avocados", title: "Hass Avocados - Export Quality", description: "Premium Hass avocados from Karongi highlands. Export quality. Perfectly ripened and sorted by size. Direct from farmers. Consistent supply. Price per kg.", price: 3200, min_qty: 50, max_qty: 1000, photos: ["https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600"] },
      { material: "Honey", title: "Pure Natural Honey", description: "Raw unprocessed honey from local beekeepers in Karongi. Rich in natural enzymes and antioxidants. No additives. Certified pure. Price per kg.", price: 9000, min_qty: 5, max_qty: 100, photos: ["https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600"] },
      { material: "Coffee Beans", title: "Washed Arabica Coffee - Karongi", description: "Fully washed Arabica coffee beans from Karongi highlands. High altitude grown. Excellent cup quality. Direct from farmers cooperative. Price per kg.", price: 4200, min_qty: 25, max_qty: 800, photos: ["https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600"] }
    ]
  }
];

async function createSuppliers() {
  console.log("Starting supplier creation...\n");
  const results = [];

  for (const supplier of suppliers) {
    console.log(`Creating: ${supplier.full_name} (${supplier.email})`);

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: supplier.email,
      password: supplier.password,
      email_confirm: true,
      user_metadata: { full_name: supplier.full_name, role: "supplier" }
    });

    if (authError) {
      console.error(`  Auth error: ${authError.message}`);
      continue;
    }

    const userId = authData.user.id;
    console.log(`  Auth user created: ${userId}`);

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: supplier.full_name,
        role: "supplier",
        location: supplier.location,
        business_name: supplier.business_name,
        business_description: supplier.bio,
        phone: supplier.phone,
        is_verified_supplier: true,
        average_rating: parseFloat((4.2 + Math.random() * 0.6).toFixed(1)),
        total_reviews: Math.floor(Math.random() * 20) + 5
      })
      .eq("id", userId);

    if (profileError) {
      console.error(`  Profile error: ${profileError.message}`);
    } else {
      console.log(`  Profile updated`);
    }

    for (const listing of supplier.listings) {
      const { data: material } = await supabase
        .from("materials")
        .select("id")
        .eq("name", listing.material)
        .single();

      if (!material) {
        console.error(`  Material not found: ${listing.material}`);
        continue;
      }

      const { error: listingError } = await supabase
        .from("supplier_listings")
        .insert({
          supplier_id: userId,
          material_id: material.id,
          title: listing.title,
          description: listing.description,
          price: listing.price,
          min_quantity: listing.min_qty,
          max_quantity: listing.max_qty,
          location: supplier.location,
          availability_status: "available",
          photos: listing.photos,
          view_count: Math.floor(Math.random() * 20) + 5
        });

      if (listingError) {
        console.error(`  Listing error "${listing.title}": ${listingError.message}`);
      } else {
        console.log(`  Listing: ${listing.title}`);
      }
    }

    results.push(supplier);
    console.log(`  Done!\n`);
  }

  console.log("\n========================================");
  console.log("SUPPLIER CREDENTIALS");
  console.log("========================================");
  for (const r of results) {
    console.log(`\n${r.business_name} - ${r.location}`);
    console.log(`  Email:    ${r.email}`);
    console.log(`  Password: ${r.password}`);
    console.log(`  Phone:    ${r.phone}`);
    console.log(`  Products: ${r.listings.length}`);
  }
  console.log("\n========================================");
}

createSuppliers().catch(console.error);
