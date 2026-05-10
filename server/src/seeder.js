const mongoose   = require('mongoose');
const dotenv     = require('dotenv');
const cloudinary = require('./config/cloudinary');
const User       = require('./models/User');
const Product    = require('./models/Product');
const Category   = require('./models/Category');
const Order      = require('./models/Order');

dotenv.config();

const productsData = [
  { name: 'Apple 2026 MacBook Air 13-inch Laptop with M5 chip', price: 'PKR 298,964.62', description: 'Apple 2026 MacBook Air 13-inch Laptop with M5 chip: Built for AI, 13.6-inch Liquid Retina Display, 16GB Unified Memory, 512GB SSD, 12MP Center Stage Camera, Touch ID, Wi-Fi 7; Midnight', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', category: 'Electronics' },
  { name: 'HP 15.6" FHD Laptop 2026 Edition with Copilot AI', price: 'PKR 111,447.21', description: 'HP 15.6" FHD Laptop 2026 Edition with Copilot AI, 16GB RAM, 512GB SSD, Intel Processor, Long Battery Life, Lightweight 3.64 lbs, Microsoft 365, Windows 11 for Students & Office', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80', category: 'Electronics' },
  { name: 'HP 14 Laptop', price: 'PKR 54,192.56', description: 'HP 14 Laptop, Intel Celeron N4020, 4 GB RAM, 64 GB Storage, 14-inch Micro-edge HD Display, Windows 11 Home, Thin & Portable, 4K Graphics', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80', category: 'Electronics' },
  { name: 'Dell 16 Laptop DC16256 Touchscreen', price: 'PKR 186,177.22', description: 'Dell 16 Laptop DC16256-16.0-inch 16:10 2K Touchscreen Display, AMD Ryzen AI 7 350 Processor, AMD Radeon Graphics, 32GB Memory, 1TB SSD, Windows 11 Home', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80', category: 'Electronics' },
  { name: 'HP Ultrabook Laptop with Copilot AI 2026', price: 'PKR 52,935.96', description: 'HP Ultrabook Laptop with Copilot AI 2026 Edition, Intel 4-Core N150 CPU, 128GB SSD + 1TB Cloud Storage, Microsoft 365, Windows 11, Thin & Portable', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80', category: 'Electronics' },
  { name: 'Bose QuietComfort Headphones Twilight Blue', price: 'PKR 58,232.62', description: 'Bose QuietComfort Headphones - Wireless Bluetooth, Active Over Ear Noise Cancelling, USB-C Charging, Deep Bass, Up to 24 Hours of Playtime, Twilight Blue', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', category: 'Electronics' },
  { name: 'Bose QuietComfort Headphones Moonlight Grey', price: 'PKR 55,446.38', description: 'Bose QuietComfort Headphones - Wireless Bluetooth, Active Over Ear Noise Cancelling, USB-C Charging, Deep Bass, Up to 24 Hours of Playtime, Moonlight Grey', image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80', category: 'Electronics' },
  { name: 'Sony WH-CH520 Wireless Headphones', price: 'PKR 10,448.44', description: 'Sony WH-CH520 Wireless Headphones Bluetooth On-Ear Headset with Microphone and up to 50 Hours Battery Life with Quick Charging, Blue', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80', category: 'Electronics' },
  { name: 'BERIBES Bluetooth Headphones Over Ear', price: 'PKR 5,569.71', description: 'BERIBES Bluetooth Headphones Over Ear, 65H Playtime and 6 EQ Music Modes, HiFi Stereo Foldable Lightweight Headset, Deep Bass for Home Office Cellphone PC', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80', category: 'Electronics' },
  { name: 'Bose QuietComfort Headphones Black', price: 'PKR 50,988.38', description: 'Bose QuietComfort Headphones - Wireless Bluetooth, Active Over Ear Noise Cancelling, USB-C Charging, Deep Bass, Up to 24 Hours of Playtime, Black', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80', category: 'Electronics' },
  { name: 'Runcati Mens Casual Slim Fit T Shirt', price: '$19.99', description: 'Premium blends Color Block Raglan T-Shirt. Lightweight, stretchy, breathable and moisture-wicking fabric for a soft and dry feel during workout or daily wear.', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', category: 'Clothing' },
  { name: 'JMIERR Mens Muscle Slim Fit T-Shirt', price: '$19.99', description: 'High-quality ribbed knit fabric that is soft, breathable, and elastic. Maximum comfort and flexibility during workouts or daily wear.', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80', category: 'Clothing' },
  { name: 'Gildan Mens Crew T-Shirts Multipack', price: '$15.99', description: 'Classic fit. Moisture wicking. Taped neck and shoulders for durability. Tubular rib collar for better stretch and recovery. Tear away label for customizable comfort.', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', category: 'Clothing' },
  { name: 'BLACK+DECKER 12-Cup Digital Coffee Maker', price: '$20.39', description: '12-CUP DURALIFE GLASS CARAFE with measurement markings and easy-grip handle. Programmable auto-brew with keep-warm plate.', image: 'https://images.unsplash.com/photo-1520970014086-2208d157c9e2?w=800&q=80', category: 'Home & Kitchen' },
  { name: 'Keurig K-Mini Single Serve Coffee Maker', price: '$59.99', description: 'COMPACT & PORTABLE: At less than 5 inches wide, perfect for small spaces. Simple one-cup brewing with a removable drip tray.', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80', category: 'Home & Kitchen' },
  { name: 'Ninja Luxe Cafe Premier 3-in-1 Espresso Machine', price: '$499.99', description: '3-IN-1 VERSATIVITY: Espresso, Drip Coffee, and Rapid Cold Brew in one machine. Includes built-in grinder and hands-free milk frother.', image: 'https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=800&q=80', category: 'Home & Kitchen' },
  { name: 'Atomic Habits', price: '$11.98', description: 'No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world\'s leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80', category: 'Books' },
  { name: 'The Psychology of Money', price: '$12.72', description: 'Doing well with money isn’t necessarily about what you know. It’s about how you behave. And behavior is hard to teach, even to really smart people.', image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&q=80', category: 'Books' },
  { name: 'The Silent Patient', price: '$10.43', description: 'The Silent Patient is a shocking psychological thriller of a woman’s act of violence against her husband—and of the therapist obsessed with uncovering her motive.', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80', category: 'Books' },
];

const cleanPrice = (priceStr) => parseFloat(priceStr.replace(/[^\d.]/g, ''));

const uploadToCloudinary = async (imageUrl) => {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'bestbuy_products',
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Cloudinary upload error for ${imageUrl}:`, error.message);
    return imageUrl; // Fallback to original if upload fails
  }
};

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

    // ── Categories & Products ──────────────────────────────────────────────────
    const catNames = [...new Set(productsData.map(p => p.category))];
    const categoryMap = {};
    const productImagesMap = {};

    console.log('Uploading images to Cloudinary (this may take a minute)...');

    for (const catName of catNames) {
      const firstProd = productsData.find(p => p.category === catName);
      const catImage  = await uploadToCloudinary(firstProd.image);
      const cat = await Category.create({
        name:        catName,
        description: `${catName} products and accessories.`,
        image:       catImage,
      });
      categoryMap[catName] = cat._id;
    }

    const reviews = [
      { user: buyer1._id, name: buyer1.name, rating: 5, comment: 'Absolutely love this product! Worth every penny.', reply: 'Thank you for your kind words!' },
      { user: buyer2._id, name: buyer2.name, rating: 4, comment: 'Great quality, fast delivery. Would recommend.' },
      { user: buyer3._id, name: buyer3.name, rating: 5, comment: 'Exceeded my expectations. Will buy again!' },
      { user: buyer1._id, name: buyer1.name, rating: 3, comment: 'Good product but packaging could be better.' },
      { user: buyer2._id, name: buyer2.name, rating: 4, comment: 'Solid build quality. Happy with the purchase.' },
    ];

    const productDocs = [];
    for (let i = 0; i < productsData.length; i++) {
      const p = productsData[i];
      const cloudImage = await uploadToCloudinary(p.image);
      
      productDocs.push({
        name:        p.name,
        description: p.description,
        price:       cleanPrice(p.price),
        category:    categoryMap[p.category],
        seller:      seller._id,
        stock:       Math.floor(Math.random() * 80) + 20,
        images:      [cloudImage],
        slug:        p.name.toLowerCase().split(' ').join('-').replace(/[^\w-]+/g, ''),
        reviews:     i < reviews.length ? [reviews[i]] : [],
        averageRating: i < reviews.length ? reviews[i].rating : undefined,
        isActive:    true,
      });
    }

    const createdProducts = await Product.insertMany(productDocs);

    console.log('Products created with Cloudinary images...');

    // ── Orders ────────────────────────────────────────────────────────────────
    const p0 = createdProducts[0];
    const p5 = createdProducts[5];
    const p1 = createdProducts[1];
    const p10 = createdProducts[10];
    const p13 = createdProducts[13];
    const p14 = createdProducts[14];

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
        isPaid: true, paidAt: new Date('2025-11-20'), isDelivered: true, deliveredAt: new Date('2025-11-25'),
      },
    ];

    for (const o of ordersData) {
      await Order.create({
        user:            o.user,
        items:           o.items,
        shippingAddress: o.shippingAddress,
        paymentMethod:   o.paymentMethod,
        total:           o.items.reduce((s, i) => s + i.price * i.quantity, 0),
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
