const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');

dotenv.config();

const productsData = [
  {
    "name": "Apple 2026 MacBook Air 13-inch Laptop with M5 chip",
    "price": "PKR 298,964.62",
    "description": "Apple 2026 MacBook Air 13-inch Laptop with M5 chip: Built for AI, 13.6-inch Liquid Retina Display, 16GB Unified Memory, 512GB SSD, 12MP Center Stage Camera, Touch ID, Wi-Fi 7; Midnight",
    "image": "https://m.media-amazon.com/images/I/71pkfQGcMKL._AC_UY218_.jpg",
    "category": "Electronics"
  },
  {
    "name": "HP 15.6\" FHD Laptop 2026 Edition with Copilot AI",
    "price": "PKR 111,447.21",
    "description": "HP 15.6\" FHD Laptop 2026 Edition with Copilot AI, 16GB RAM, 512GB SSD, Intel Processor, Long Battery Life, Lightweight 3.64 lbs, Microsoft 365, Windows 11 for Students & Office, Type-RJ45 Cable",
    "image": "https://m.media-amazon.com/images/I/71VneS53BYL._AC_UY218_.jpg",
    "category": "Electronics"
  },
  {
    "name": "HP 14 Laptop",
    "price": "PKR 54,192.56",
    "description": "HP 14 Laptop, Intel Celeron N4020, 4 GB RAM, 64 GB Storage, 14-inch Micro-edge HD Display, Windows 11 Home, Thin & Portable, 4K Graphics, One Year of Microsoft 365 (14-dq0040nr, Snowflake White)",
    "image": "https://m.media-amazon.com/images/I/815uX7wkOZS._AC_UY218_.jpg",
    "category": "Electronics"
  },
  {
    "name": "Dell 16 Laptop DC16256-16.0-inch 16:10 2K Touchscreen Display",
    "price": "PKR 186,177.22",
    "description": "Dell 16 Laptop DC16256-16.0-inch 16:10 2K Touchscreen Display, AMD Ryzen AI 7 350 Processor, AMD Radeon Graphics, 32GB Memory, 1TB SSD, Windows 11 Home, Copilot+, Onsite Service, Platinum Silver",
    "image": "https://m.media-amazon.com/images/I/71caaFY18WL._AC_UY218_.jpg",
    "category": "Electronics"
  },
  {
    "name": "HP Ultrabook Laptop with Copilot AI • 2026 Edition",
    "price": "PKR 52,935.96",
    "description": "HP Ultrabook Laptop with Copilot AI • 2026 Edition • Intel 4-Core N150 CPU • 128GB SSD + 1TB Cloud Storage • Microsoft 365 • Windows 11 • Thin & Portable • w/o Mouse",
    "image": "https://m.media-amazon.com/images/I/71mLCqWj7UL._AC_UY218_.jpg",
    "category": "Electronics"
  },
  {
    "name": "Bose QuietComfort Headphones",
    "price": "PKR 58,232.62",
    "description": "Bose QuietComfort Headphones - Wireless Bluetooth Headphones, Active Over Ear Noise Cancelling and Mic, USB-C Charging, Deep Bass, Up to 24 Hours of Playtime, Twilight Blue - Limited Edition Color",
    "image": "https://m.media-amazon.com/images/I/51tItfLj8xL._AC_UY218_.jpg",
    "category": "Electronics"
  },
  {
    "name": "Bose QuietComfort Headphones - Moonlight Grey",
    "price": "PKR 55,446.38",
    "description": "Bose QuietComfort Headphones - Wireless Bluetooth Headphones, Active Over Ear Noise Cancelling and Mic, USB-C Charging, Deep Bass, Up to 24 Hours of Playtime, Moonlight Grey - Limited Edition Color",
    "image": "https://m.media-amazon.com/images/I/51NQwrNkWvL._AC_UY218_.jpg",
    "category": "Electronics"
  },
  {
    "name": "Sony WH-CH520 Wireless Headphones",
    "price": "PKR 10,448.44",
    "description": "Sony WH-CH520 Wireless Headphones Bluetooth On-Ear Headset with Microphone and up to 50 Hours Battery Life with Quick Charging, Blue",
    "image": "https://m.media-amazon.com/images/I/41JACWT-wWL._AC_UY218_.jpg",
    "category": "Electronics"
  },
  {
    "name": "BERIBES Bluetooth Headphones Over Ear",
    "price": "PKR 5,569.71",
    "description": "BERIBES Bluetooth Headphones Over Ear, 65H Playtime and 6 EQ Music Modes Wireless Headphones with Microphone, HiFi Stereo Foldable Lightweight Headset, Deep Bass for Home Office Cellphone PC Ect.",
    "image": "https://m.media-amazon.com/images/I/71F2ccIPPLL._AC_UY218_.jpg",
    "category": "Electronics"
  },
  {
    "name": "Bose QuietComfort Headphones - Black",
    "price": "PKR 50,988.38",
    "description": "Bose QuietComfort Headphones - Wireless Bluetooth Headphones, Active Over Ear Noise Cancelling and Mic, USB-C Charging, Deep Bass, Up to 24 Hours of Playtime, Black",
    "image": "https://m.media-amazon.com/images/I/51f7KKP25PL._AC_UY218_.jpg",
    "category": "Electronics"
  },
  {
    "name": "Runcati Mens Casual Slim Fit T Shirt",
    "price": "$19.99",
    "description": "Excellent Material: The Men's Color Block Raglan T-Shirt is well made of premium blends. Lightweight, stretchy, breathable and moisture-wicking fabric for a soft and dry feel during your workout or daily wear.",
    "image": "https://m.media-amazon.com/images/I/71YvE8zYn+L._AC_SX679_.jpg",
    "category": "Clothing"
  },
  {
    "name": "JMIERR Men's Muscle Slim Fit T-Shirt",
    "price": "$19.99",
    "description": "JMIERR men's t-shirts are made from a high-quality ribbed knit fabric that is soft, breathable, and elastic. This provides maximum comfort and flexibility during workouts or daily wear.",
    "image": "https://m.media-amazon.com/images/I/71Xm06jSj2L._AC_SX679_.jpg",
    "category": "Clothing"
  },
  {
    "name": "Gildan Men's Crew T-Shirts (Multipack)",
    "price": "$15.99",
    "description": "Classic fit. Moisture wicking. Taped neck and shoulders for durability. Tubular rib collar for better stretch and recovery. Tear away label for customizable comfort.",
    "image": "https://m.media-amazon.com/images/I/71u9SreZk6L._AC_SX679_.jpg",
    "category": "Clothing"
  },
  {
    "name": "BLACK+DECKER 12-Cup Digital Coffee Maker",
    "price": "$20.39",
    "description": "12-CUP DURALIFE GLASS CARAFE: The sturdy 12-cup carafe has measurement markings for accurate filling and an easy-grip handle for comfortable pouring. Features programmable auto-brew.",
    "image": "https://m.media-amazon.com/images/I/71YyM9r2L._AC_SX679_.jpg",
    "category": "Home & Kitchen"
  },
  {
    "name": "Keurig K-Mini Single Serve Coffee Maker",
    "price": "$59.99",
    "description": "COMPACT & PORTABLE: At less than 5 inches wide, the K-Mini is perfect for small spaces and easy to transport. Simple one-cup brewing with a removable drip tray.",
    "image": "https://m.media-amazon.com/images/I/71m09E-Y+8L._AC_SX679_.jpg",
    "category": "Home & Kitchen"
  },
  {
    "name": "Ninja Luxe Café Premier 3-in-1 Espresso Machine",
    "price": "$499.99",
    "description": "3-IN-1 VERSATILITY: Espresso, Drip Coffee, and Rapid Cold Brew in one machine. Includes a built-in coffee grinder and hands-free milk frother for professional results at home.",
    "image": "https://m.media-amazon.com/images/I/81oE+9zF2+L._AC_SX679_.jpg",
    "category": "Home & Kitchen"
  }
];


const cleanPrice = (priceStr) => {
  return parseFloat(priceStr.replace(/[^\d.]/g, ''));
};

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear existing data
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    // Create a dummy seller
    const seller = await User.create({
      name: 'BestBuy Seller',
      email: 'seller@bestbuy.com',
      password: 'password123',
      role: 'seller'
    });

    // Create categories
    const categoriesToCreate = [...new Set(productsData.map(p => p.category))];
    const categoryMap = {};

    for (const catName of categoriesToCreate) {
      const cat = await Category.create({
        name: catName,
        description: `${catName} products and accessories.`,
        image: productsData.find(p => p.category === catName).image
      });
      categoryMap[catName] = cat._id;
    }

    // Map and insert products
    const products = productsData.map(product => ({
      ...product,
      price: cleanPrice(product.price),
      category: categoryMap[product.category],
      seller: seller._id,
      stock: Math.floor(Math.random() * 100) + 1,
      images: [product.image],
      slug: product.name.toLowerCase().split(' ').join('-').replace(/[^\w-]+/g, '')
    }));

    await Product.insertMany(products);



    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};


if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
