const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const User     = require('./models/User');
const Product  = require('./models/Product');
const Category = require('./models/Category');
const Order    = require('./models/Order');

dotenv.config();

const productsData = [
  { name: 'Apple 2026 MacBook Air 13-inch Laptop with M5 chip', price: 'PKR 298,964.62', description: 'Apple 2026 MacBook Air 13-inch Laptop with M5 chip: Built for AI, 13.6-inch Liquid Retina Display, 16GB Unified Memory, 512GB SSD, 12MP Center Stage Camera, Touch ID, Wi-Fi 7; Midnight', image: 'https://m.media-amazon.com/images/I/71pkfQGcMKL._AC_UY218_.jpg', category: 'Electronics' },
  { name: 'HP 15.6" FHD Laptop 2026 Edition with Copilot AI', price: 'PKR 111,447.21', description: 'HP 15.6" FHD Laptop 2026 Edition with Copilot AI, 16GB RAM, 512GB SSD, Intel Processor, Long Battery Life, Lightweight 3.64 lbs, Microsoft 365, Windows 11 for Students & Office', image: 'https://m.media-amazon.com/images/I/71VneS53BYL._AC_UY218_.jpg', category: 'Electronics' },
  { name: 'HP 14 Laptop', price: 'PKR 54,192.56', description: 'HP 14 Laptop, Intel Celeron N4020, 4 GB RAM, 64 GB Storage, 14-inch Micro-edge HD Display, Windows 11 Home, Thin & Portable, 4K Graphics', image: 'https://m.media-amazon.com/images/I/815uX7wkOZS._AC_UY218_.jpg', category: 'Electronics' },
  { name: 'Dell 16 Laptop DC16256 Touchscreen', price: 'PKR 186,177.22', description: 'Dell 16 Laptop DC16256-16.0-inch 16:10 2K Touchscreen Display, AMD Ryzen AI 7 350 Processor, AMD Radeon Graphics, 32GB Memory, 1TB SSD, Windows 11 Home', image: 'https://m.media-amazon.com/images/I/71caaFY18WL._AC_UY218_.jpg', category: 'Electronics' },
  { name: 'HP Ultrabook Laptop with Copilot AI 2026', price: 'PKR 52,935.96', description: 'HP Ultrabook Laptop with Copilot AI 2026 Edition, Intel 4-Core N150 CPU, 128GB SSD + 1TB Cloud Storage, Microsoft 365, Windows 11, Thin & Portable', image: 'https://m.media-amazon.com/images/I/71mLCqWj7UL._AC_UY218_.jpg', category: 'Electronics' },
  { name: 'Bose QuietComfort Headphones Twilight Blue', price: 'PKR 58,232.62', description: 'Bose QuietComfort Headphones - Wireless Bluetooth, Active Over Ear Noise Cancelling, USB-C Charging, Deep Bass, Up to 24 Hours of Playtime, Twilight Blue', image: 'https://m.media-amazon.com/images/I/51tItfLj8xL._AC_UY218_.jpg', category: 'Electronics' },
  { name: 'Bose QuietComfort Headphones Moonlight Grey', price: 'PKR 55,446.38', description: 'Bose QuietComfort Headphones - Wireless Bluetooth, Active Over Ear Noise Cancelling, USB-C Charging, Deep Bass, Up to 24 Hours of Playtime, Moonlight Grey', image: 'https://m.media-amazon.com/images/I/51NQwrNkWvL._AC_UY218_.jpg', category: 'Electronics' },
  { name: 'Sony WH-CH520 Wireless Headphones', price: 'PKR 10,448.44', description: 'Sony WH-CH520 Wireless Headphones Bluetooth On-Ear Headset with Microphone and up to 50 Hours Battery Life with Quick Charging, Blue', image: 'https://m.media-amazon.com/images/I/41JACWT-wWL._AC_UY218_.jpg', category: 'Electronics' },
  { name: 'BERIBES Bluetooth Headphones Over Ear', price: 'PKR 5,569.71', description: 'BERIBES Bluetooth Headphones Over Ear, 65H Playtime and 6 EQ Music Modes, HiFi Stereo Foldable Lightweight Headset, Deep Bass for Home Office Cellphone PC', image: 'https://m.media-amazon.com/images/I/71F2ccIPPLL._AC_UY218_.jpg', category: 'Electronics' },
  { name: 'Bose QuietComfort Headphones Black', price: 'PKR 50,988.38', description: 'Bose QuietComfort Headphones - Wireless Bluetooth, Active Over Ear Noise Cancelling, USB-C Charging, Deep Bass, Up to 24 Hours of Playtime, Black', image: 'https://m.media-amazon.com/images/I/51f7KKP25PL._AC_UY218_.jpg', category: 'Electronics' },
  { name: 'Runcati Mens Casual Slim Fit T Shirt', price: '$19.99', description: 'Premium blends Color Block Raglan T-Shirt. Lightweight, stretchy, breathable and moisture-wicking fabric for a soft and dry feel during workout or daily wear.', image: 'https://m.media-amazon.com/images/I/71YvE8zYn+L._AC_SX679_.jpg', category: 'Clothing' },
  { name: 'JMIERR Mens Muscle Slim Fit T-Shirt', price: '$19.99', description: 'High-quality ribbed knit fabric that is soft, breathable, and elastic. Maximum comfort and flexibility during workouts or daily wear.', image: 'https://m.media-amazon.com/images/I/71Xm06jSj2L._AC_SX679_.jpg', category: 'Clothing' },
  { name: 'Gildan Mens Crew T-Shirts Multipack', price: '$15.99', description: 'Classic fit. Moisture wicking. Taped neck and shoulders for durability. Tubular rib collar for better stretch and recovery. Tear away label for customizable comfort.', image: 'https://m.media-amazon.com/images/I/71u9SreZk6L._AC_SX679_.jpg', category: 'Clothing' },
  { name: 'BLACK+DECKER 12-Cup Digital Coffee Maker', price: '$20.39', description: '12-CUP DURALIFE GLASS CARAFE with measurement markings and easy-grip handle. Programmable auto-brew with keep-warm plate.', image: 'https://m.media-amazon.com/images/I/71YyM9r2L._AC_SX679_.jpg', category: 'Home & Kitchen' },
  { name: 'Keurig K-Mini Single Serve Coffee Maker', price: '$59.99', description: 'COMPACT & PORTABLE: At less than 5 inches wide, perfect for small spaces. Simple one-cup brewing with a removable drip tray.', image: 'https://m.media-amazon.com/images/I/71m09E-Y+8L._AC_SX679_.jpg', category: 'Home & Kitchen' },
  { name: 'Ninja Luxe Cafe Premier 3-in-1 Espresso Machine', price: '$499.99', description: '3-IN-1 VERSATILITY: Espresso, Drip Coffee, and Rapid Cold Brew in one machine. Includes built-in grinder and hands-free milk frother.', image: 'https://m.media-amazon.com/images/I/81oE+9zF2+L._AC_SX679_.jpg', category: 'Home & Kitchen' },
];

const cleanPrice = (priceStr) => parseFloat(priceStr.replace(/[^\d.]/g, ''));

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear all collections
    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('Collections cleared...');

    // ── Users ─────────────────────────────────────────────────────────────────
    const seller = await User.create({
      name: 'BestBuy Seller', email: 'seller@bestbuy.com', password: 'password123', role: 'seller',
    });
    await User.create({
      name: 'BestBuy Admin', email: 'admin@bestbuy.com', password: 'adminpassword', role: 'admin',
    });
    const buyer1 = await User.create({
      name: 'Alice Johnson', email: 'alice@example.com', password: 'password123', role: 'user',
    });
    const buyer2 = await User.create({
      name: 'Bob Smith', email: 'bob@example.com', password: 'password123', role: 'user',
    });
    const buyer3 = await User.create({
      name: 'Carol Davis', email: 'carol@example.com', password: 'password123', role: 'user',
    });

    console.log('Users created...');

    // ── Categories ────────────────────────────────────────────────────────────
    const catNames = [...new Set(productsData.map(p => p.category))];
    const categoryMap = {};
    for (const catName of catNames) {
      const cat = await Category.create({
        name:        catName,
        description: `${catName} products and accessories.`,
        image:       productsData.find(p => p.category === catName).image,
      });
      categoryMap[catName] = cat._id;
    }

    console.log('Categories created...');

    // ── Products ──────────────────────────────────────────────────────────────
    const reviews = [
      { user: buyer1._id, name: buyer1.name, rating: 5, comment: 'Absolutely love this product! Worth every penny.', reply: 'Thank you for your kind words!' },
      { user: buyer2._id, name: buyer2.name, rating: 4, comment: 'Great quality, fast delivery. Would recommend.' },
      { user: buyer3._id, name: buyer3.name, rating: 5, comment: 'Exceeded my expectations. Will buy again!' },
      { user: buyer1._id, name: buyer1.name, rating: 3, comment: 'Good product but packaging could be better.' },
      { user: buyer2._id, name: buyer2.name, rating: 4, comment: 'Solid build quality. Happy with the purchase.' },
    ];

    const productDocs = productsData.map((p, i) => ({
      name:        p.name,
      description: p.description,
      price:       cleanPrice(p.price),
      category:    categoryMap[p.category],
      seller:      seller._id,
      stock:       Math.floor(Math.random() * 80) + 20,
      images:      [p.image],
      slug:        p.name.toLowerCase().split(' ').join('-').replace(/[^\w-]+/g, ''),
      reviews:     i < reviews.length ? [reviews[i]] : [],
      averageRating: i < reviews.length ? reviews[i].rating : undefined,
      isActive:    true,
    }));

    const createdProducts = await Product.insertMany(productDocs);

    console.log('Products created...');

    // ── Orders ────────────────────────────────────────────────────────────────
    const p0 = createdProducts[0]; // MacBook
    const p5 = createdProducts[5]; // Bose headphones
    const p1 = createdProducts[1]; // HP laptop
    const p10 = createdProducts[10]; // T-shirt
    const p13 = createdProducts[13]; // Coffee maker
    const p14 = createdProducts[14]; // Keurig

    const ordersData = [
      {
        user:   buyer1._id,
        status: 'Delivered',
        paymentMethod: 'COD',
        shippingAddress: { address: '123 Oak Street', city: 'New York', postalCode: '10001', country: 'USA' },
        items: [
          { product: p0._id, name: p0.name, price: p0.price, quantity: 1, image: p0.images[0], seller: seller._id },
          { product: p5._id, name: p5.name, price: p5.price, quantity: 2, image: p5.images[0], seller: seller._id },
        ],
        get total() { return this.items.reduce((s, i) => s + i.price * i.quantity, 0); },
        isPaid: true, paidAt: new Date('2025-12-01'), isDelivered: true, deliveredAt: new Date('2025-12-05'),
      },
      {
        user:   buyer2._id,
        status: 'Shipped',
        paymentMethod: 'COD',
        shippingAddress: { address: '456 Maple Ave', city: 'Los Angeles', postalCode: '90001', country: 'USA' },
        items: [
          { product: p1._id, name: p1.name, price: p1.price, quantity: 1, image: p1.images[0], seller: seller._id },
        ],
        get total() { return this.items.reduce((s, i) => s + i.price * i.quantity, 0); },
      },
      {
        user:   buyer3._id,
        status: 'Confirmed',
        paymentMethod: 'Stripe',
        shippingAddress: { address: '789 Pine Rd', city: 'Chicago', postalCode: '60601', country: 'USA' },
        items: [
          { product: p10._id, name: p10.name, price: p10.price, quantity: 3, image: p10.images[0], seller: seller._id },
          { product: p13._id, name: p13.name, price: p13.price, quantity: 1, image: p13.images[0], seller: seller._id },
        ],
        get total() { return this.items.reduce((s, i) => s + i.price * i.quantity, 0); },
        isPaid: true, paidAt: new Date('2025-12-10'),
      },
      {
        user:   buyer1._id,
        status: 'Pending',
        paymentMethod: 'COD',
        shippingAddress: { address: '321 Elm St', city: 'Houston', postalCode: '77001', country: 'USA' },
        items: [
          { product: p14._id, name: p14.name, price: p14.price, quantity: 1, image: p14.images[0], seller: seller._id },
        ],
        get total() { return this.items.reduce((s, i) => s + i.price * i.quantity, 0); },
      },
      {
        user:   buyer2._id,
        status: 'Delivered',
        paymentMethod: 'Stripe',
        shippingAddress: { address: '654 Cedar Blvd', city: 'Phoenix', postalCode: '85001', country: 'USA' },
        items: [
          { product: p5._id, name: p5.name, price: p5.price, quantity: 1, image: p5.images[0], seller: seller._id },
          { product: p10._id, name: p10.name, price: p10.price, quantity: 2, image: p10.images[0], seller: seller._id },
        ],
        get total() { return this.items.reduce((s, i) => s + i.price * i.quantity, 0); },
        isPaid: true, paidAt: new Date('2025-11-20'), isDelivered: true, deliveredAt: new Date('2025-11-25'),
      },
    ];

    for (const o of ordersData) {
      await Order.create({
        user:            o.user,
        items:           o.items,
        shippingAddress: o.shippingAddress,
        paymentMethod:   o.paymentMethod,
        total:           o.total,
        status:          o.status,
        isPaid:          o.isPaid ?? false,
        paidAt:          o.paidAt,
        isDelivered:     o.isDelivered ?? false,
        deliveredAt:     o.deliveredAt,
      });
    }

    console.log('Orders created...');
    console.log('\n✅ Data Imported Successfully!\n');
    console.log('Demo accounts:');
    console.log('  Admin  → admin@bestbuy.com   / adminpassword');
    console.log('  Seller → seller@bestbuy.com  / password123');
    console.log('  Buyer  → alice@example.com   / password123\n');

    process.exit();
  } catch (error) {
    console.error(`Seeder error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Order.deleteMany();
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
