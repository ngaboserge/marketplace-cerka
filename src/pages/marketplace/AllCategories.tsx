import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  TrendingUp, Package, Building, Wheat, Meat, Smartphone, Car, Home as HomeIcon, 
  Tool, Cow, Lightning, Hammer, Box, Hospital, Tractor, Shirt, ArrowRight
} from '@/lib/icons';

const CATEGORIES = [
  {
    id: 'construction-materials',
    name: 'Construction Materials',
    icon: <Building className="w-12 h-12" />,
    color: 'orange',
    description: 'Cement, steel, bricks, tiles, and building supplies',
    itemCount: '50+',
    trending: true
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    icon: <Wheat className="w-12 h-12" />,
    color: 'green',
    description: 'Seeds, fertilizer, produce, and farming equipment',
    itemCount: '40+',
    trending: true
  },
  {
    id: 'food-and-beverage',
    name: 'Food & Commodities',
    icon: <Meat className="w-12 h-12" />,
    color: 'red',
    description: 'Staples, proteins, produce, dairy, and beverages',
    itemCount: '60+',
    trending: false
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: <Smartphone className="w-12 h-12" />,
    color: 'blue',
    description: 'Phones, laptops, solar panels, and devices',
    itemCount: '45+',
    trending: true
  },
  {
    id: 'vehicles',
    name: 'Vehicles',
    icon: <Car className="w-12 h-12" />,
    color: 'gray',
    description: 'Cars, motorcycles, trucks, and parts',
    itemCount: '30+',
    trending: false
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    icon: <HomeIcon className="w-12 h-12" />,
    color: 'purple',
    description: 'Houses, apartments, shops, and commercial spaces',
    itemCount: '25+',
    trending: true
  },
  {
    id: 'services',
    name: 'Services',
    icon: <Tool className="w-12 h-12" />,
    color: 'indigo',
    description: 'Labor, transport, equipment rental, and more',
    itemCount: '35+',
    trending: false
  },
  {
    id: 'livestock',
    name: 'Livestock',
    icon: <Cow className="w-12 h-12" />,
    color: 'amber',
    description: 'Cows, goats, chickens, and animal products',
    itemCount: '20+',
    trending: false
  },
  {
    id: 'energy-and-utilities',
    name: 'Energy & Utilities',
    icon: <Lightning className="w-12 h-12" />,
    color: 'yellow',
    description: 'Charcoal, gas, solar, and energy solutions',
    itemCount: '15+',
    trending: false
  },
  {
    id: 'hardware-and-tools',
    name: 'Hardware & Tools',
    icon: <Hammer className="w-12 h-12" />,
    color: 'slate',
    description: 'Tools, equipment, and hardware supplies',
    itemCount: '30+',
    trending: false
  },
  {
    id: 'manufactured-goods',
    name: 'Manufactured Goods',
    icon: <Box className="w-12 h-12" />,
    color: 'cyan',
    description: 'Clothes, shoes, plastics, and consumer products',
    itemCount: '40+',
    trending: false
  },
  {
    id: 'health-and-hygiene',
    name: 'Health & Hygiene',
    icon: <Hospital className="w-12 h-12" />,
    color: 'pink',
    description: 'Soap, sanitizers, medical supplies, and hygiene',
    itemCount: '25+',
    trending: false
  },
  {
    id: 'automotive-and-transport',
    name: 'Automotive & Transport',
    icon: <Tractor className="w-12 h-12" />,
    color: 'emerald',
    description: 'Fuel, spare parts, tires, and automotive supplies',
    itemCount: '35+',
    trending: false
  },
  {
    id: 'textiles-and-tailoring',
    name: 'Textiles & Tailoring',
    icon: <Shirt className="w-12 h-12" />,
    color: 'violet',
    description: 'Fabric, thread, buttons, and tailoring supplies',
    itemCount: '20+',
    trending: false
  }
];

export default function AllCategories() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      {/* Hero Section */}
      <div className="promo-banner">
        <div className="container-marketplace">
          <div className="text-center">
            <h1 className="promo-title text-5xl">Browse All Categories</h1>
            <p className="promo-subtitle text-xl mb-6">
              Explore 14 economic sectors with 200+ materials and products
            </p>
            <div className="flex justify-center gap-6 text-sm text-orange-100">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                <span>200+ Materials</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>Real-time Prices</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇷🇼</span>
                <span>Made for Rwanda</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container-marketplace section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category) => (
            <div
              key={category.id}
              onClick={() => navigate(`/marketplace/${category.id}`)}
              className="cursor-pointer group"
            >
              <div className="bg-white rounded-lg border border-neutral-200 h-full hover-lift">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-orange-600">{category.icon}</div>
                      <div>
                        <h3 className="font-bold text-lg text-neutral-900 group-hover:text-orange-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-neutral-600">{category.itemCount} items</p>
                      </div>
                    </div>
                    {category.trending && (
                      <span className="badge badge-success flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Trending
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-neutral-600 mb-4">
                    {category.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                    <span className="text-sm text-neutral-500">Browse sector</span>
                    <ArrowRight className="w-5 h-5 text-orange-600 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 promo-banner rounded-2xl text-center">
          <h2 className="promo-title text-3xl">Can't find what you're looking for?</h2>
          <p className="promo-subtitle text-lg mb-8">
            Post a request and let sellers come to you
          </p>
          <button
            onClick={() => navigate('/materials/trends')}
            className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-neutral-100 transition-colors"
          >
            Post a Request
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
