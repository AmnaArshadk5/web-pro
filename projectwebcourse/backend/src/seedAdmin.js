const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('./models/User');
const Wallet = require('./models/Wallet');

dotenv.config({ path: '../.env' }); // Adjust depending on run location

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ruralpay');

    const adminEmail = 'admin@ruralpay.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      // Check if admin has a wallet
      const walletExists = await Wallet.findOne({ userId: adminExists._id });
      if (!walletExists) {
        await Wallet.create({
          userId: adminExists._id,
          balance: 100000,
          currency: 'PKR',
          status: 'active'
        });
        console.log('Wallet created for existing admin.');
      } else {
        console.log('Admin and wallet already exist!');
      }
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);

    const user = await User.create({
      name: 'System Admin',
      email: adminEmail,
      passwordHash,
      role: 'admin',
      phone: '0000000000'
    });

    await Wallet.create({
      userId: user._id,
      balance: 100000,
      currency: 'PKR',
      status: 'active'
    });

    // Seed Products
    const Product = require('./models/Product');
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const products = [
        {
          name: 'Solar Irrigation Pump',
          category: 'Agricultural Equipment',
          price: 45000,
          description: 'High-efficiency solar-powered water pump for sustainable irrigation.',
          imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          retailerId: user._id,
          stock: 5
        },
        {
          name: 'Energy-Efficient Fridge',
          category: 'Home Appliance',
          price: 32000,
          description: 'Low-power consumption refrigerator designed for rural grids.',
          imageUrl: 'https://images.unsplash.com/photo-1571175432230-01c24844c022?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          retailerId: user._id,
          stock: 8
        },
        {
          name: 'Electric Seed Drill',
          category: 'Agricultural Equipment',
          price: 15000,
          description: 'Precision seeding tool for small to medium scale farmers.',
          imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          retailerId: user._id,
          stock: 12
        },
        {
          name: 'Professional Tool Set',
          category: 'Tools',
          price: 8500,
          description: 'Complete set of heavy-duty tools for rural artisans.',
          imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          retailerId: user._id,
          stock: 20
        }
      ];
      await Product.insertMany(products);
      console.log('Products seeded successfully!');
    }

    console.log('Admin and wallet created successfully! Email: admin@ruralpay.com, Password: admin123');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
