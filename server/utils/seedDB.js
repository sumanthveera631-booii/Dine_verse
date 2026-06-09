const MenuItem = require('../models/MenuItem');
const PrivateRoom = require('../models/PrivateRoom');

const menuItemsData = [
  {
    title: 'Smoked Truffle Wagyu Ribeye',
    description: 'Aged Japanese A5 Wagyu ribeye smoked under a glass cloche with Applewood embers, served with shaved winter truffles and an imperial gold bone-marrow jus.',
    price: 185,
    category: 'Chef Specials',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
  },
  {
    title: 'Edible Gold Sea Bass Fillet',
    description: 'Poached Chilean sea bass layered with 24k micro-gold leaf, floating on a saffron lemongrass reduction and garnished with imperial sturgeon caviar.',
    price: 125,
    category: 'Chef Specials',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
  },
  {
    title: 'Volcanic Lobster Thermidor',
    description: 'Fresh Maine lobster flamed tableside with aged Cognac, baked in a rich volcanic black garlic gruyère cream and finished with wild chanterelles.',
    price: 145,
    category: 'Chef Specials',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600',
    rating: 5.0,
  },
  {
    title: 'Cosmic Octopus Grotto Carpaccio',
    description: 'Ultra-thin slivers of tender Spanish octopus, cold-pressed with volcanic sea salt, lemon thyme emulsification, and micro-wasabi.',
    price: 75,
    category: 'Chef Specials',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
  },
  {
    title: 'Truffle Porcini Ravioli',
    description: 'House-made ravioli pockets stuffed with wild porcini mushrooms and liquid ricotta, glazed in white truffle butter and cracked tellicherry pepper.',
    price: 55,
    category: 'Main Dishes',
    imageUrl: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=600',
    rating: 4.6,
  },
  {
    title: 'Seared Duck Breast à l\'Orange',
    description: 'Pan-roasted tender duck breast with crispy orange fire glaze, parsnip velvet purée, and a dark cherry-cardamom sauce reduction.',
    price: 68,
    category: 'Main Dishes',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600',
    rating: 4.5,
  },
  {
    title: 'Imperial Saffron Risotto',
    description: 'Aromatic carnaroli rice simmered slow in saffron-infused pheasant stock, finished with sweet lobster claw medallions and parmesan lace.',
    price: 62,
    category: 'Main Dishes',
    imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
  },
  {
    title: 'Woodfired Wild Seabream',
    description: 'Whole-roasted Mediterranean seabream stuffed with organic citrus slices, fennel fronds, and olive-oil herb mash, cooked in brick fires.',
    price: 78,
    category: 'Main Dishes',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
  },
  {
    title: 'Amber Elixir Glow',
    description: 'Fresh pressed orange fire juice, cardamon seed syrup, shaken with fresh ginger pulp, rosemary smoke, and carbonated white tea.',
    price: 24,
    category: 'Mocktails',
    imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
  },
  {
    title: 'Cosmic Lavender Mist',
    description: 'Cold-brewed organic lavender floral infusion, wild honey, fresh squeezed lime juice, topped with tonic bubbles and gold dust flakes.',
    price: 22,
    category: 'Mocktails',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
  },
  {
    title: 'Imperial Ginger Zinger',
    description: 'Muddled fresh baby ginger, sparkling cucumber-lime juice extract, sweet lemongrass syrup, topped with organic mint leaf sprays.',
    price: 20,
    category: 'Mocktails',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-2e467f4af445?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
  },
  {
    title: 'Smoked Pomegranate Ruby',
    description: 'Cold-pressed dark pomegranate juice, cedar wood smoke injection, fresh lime zest, and mineral water spritz.',
    price: 26,
    category: 'Mocktails',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
  },
  {
    title: 'Celestial Gold Chocolate Dome',
    description: 'Dark Belgian single-origin chocolate dome, melted tableside with hot espresso caramel to reveal a core of vanilla bean gel and velvet mousse.',
    price: 38,
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=600',
    rating: 5.0,
  },
  {
    title: 'Velvet Pistachio Soufflé',
    description: 'Delicate baked Sicilian pistachio soufflé, rising tall and served with a premium white-chocolate cardamom sauce pour.',
    price: 32,
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
  },
  {
    title: 'Saffron Mango Mille-Feuille',
    description: 'Crisp layers of caramelized puff pastry, filled with whipped saffron cream, sweet Alphonso mango segments, and rose water syrup.',
    price: 28,
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
  },
  {
    title: 'Smoked Honey Crème Brûlée',
    description: 'Vanilla bean custard set under a torched layer of caramelized organic orange honey, infused with a hint of smoked hickory salt.',
    price: 26,
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
  }
];

const privateVenuesData = [
  {
    title: 'The Obsidian Lounge',
    description: 'Encased in charcoal basalt with complete acoustic isolation. Ideal for confidential executive engagements.',
    capacity: 12,
    acoustics: '96dB Soundproof',
    panorama: 'Skyline East View',
    depositPrice: 500,
    imageUrl: 'https://images.unsplash.com/photo-1570129476589-94f50b8aaeb4?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'The Zenith Rooftop',
    description: 'Suspended high under retractable glass with panoramic night vistas and premium climate control.',
    capacity: 20,
    acoustics: 'Acoustic Glass Dome',
    panorama: '360° Star Sky Deck',
    depositPrice: 800,
    imageUrl: 'https://images.unsplash.com/photo-1500522714194-8ea0824f4662?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'The Imperial Vault',
    description: 'Underground brass-lined sanctuary with climate-controlled wine reserves and intimate seating.',
    capacity: 8,
    acoustics: '104dB Soundproof',
    panorama: 'Aged Wine Casks',
    depositPrice: 600,
    imageUrl: 'https://images.unsplash.com/photo-1525238413002-c4538320e098?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'The Crimson Salon',
    description: 'Royal red silk damask draperies and mahogany furniture, evoking a classic salon dining theatre.',
    capacity: 6,
    acoustics: '92dB Soundproof',
    panorama: 'Fountain Grotto',
    depositPrice: 400,
    imageUrl: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'The Gilded Glasshouse',
    description: 'Botanical sanctuary wrapped in gold-mesh and biophilic design, perfect for family gatherings.',
    capacity: 10,
    acoustics: 'Raindrop Isolation',
    panorama: 'Cosmic Conservatory',
    depositPrice: 450,
    imageUrl: 'https://images.unsplash.com/photo-1631504866246-ab2151c8e89c?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'The Celestial Deck',
    description: 'Adjacent to the chef kitchen with heat-resistant viewing shields and chef\'s preview windows.',
    capacity: 15,
    acoustics: 'Acoustic Dampening',
    panorama: 'Zenith Constellations',
    depositPrice: 750,
    imageUrl: 'https://images.unsplash.com/photo-1552566626-7ee31b080d1a?auto=format&fit=crop&q=80&w=800',
  }
];

const autoSeedDB = async () => {
  try {
    const menuCount = await MenuItem.countDocuments();
    const venueCount = await PrivateRoom.countDocuments();

    // Only seed if collections are empty
    if (menuCount === 0 && venueCount === 0) {
      console.log('🌱 Database is empty. Starting auto-seed...');

      await MenuItem.insertMany(menuItemsData);
      console.log(`✅ Seeded ${menuItemsData.length} menu items`);

      await PrivateRoom.insertMany(privateVenuesData);
      console.log(`✅ Seeded ${privateVenuesData.length} private venues`);

      console.log('🎉 Database auto-seeding completed successfully!');
      return true;
    } else {
      console.log(`ℹ️  Database already populated (${menuCount} items, ${venueCount} venues). Skipping seed.`);
      return false;
    }
  } catch (error) {
    console.error('❌ Error during auto-seed:', error.message);
    // Don't crash the server if seeding fails
    return false;
  }
};

module.exports = autoSeedDB;
