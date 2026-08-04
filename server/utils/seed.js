const dotenv = require('dotenv');
dotenv.config();

const { connectDB } = require('../config/db');
const { User, Product, Cart, Wishlist, Order, syncModels } = require('../models');

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@ecommerce.com',
    password: 'Password123!',
    role: 'Admin',
    phone: '+1 800-555-0199',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  },
  {
    name: 'Sarah Seller',
    email: 'seller@ecommerce.com',
    password: 'Password123!',
    role: 'Sales Person',
    phone: '+1 800-555-0144',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
  },
  {
    name: 'Alex Customer',
    email: 'user@ecommerce.com',
    password: 'Password123!',
    role: 'User',
    phone: '+1 800-555-0188',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
  },
];

const sampleProducts = [
  {
    title: 'Wireless Noise-Canceling Headphones',
    description: 'Immersive sound experience with active noise-canceling technology, 30-hour battery life, and crystal-clear microphone.',
    price: 199.99,
    category: 'Electronics',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'Minimalist Smart Watch Pro',
    description: 'Track health metrics, heart rate, sleep quality, and GPS tracking with a high-definition AMOLED glass display.',
    price: 149.50,
    category: 'Gadgets',
    stock: 18,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'Premium Ergonomic Leather Backpack',
    description: 'Crafted with genuine full-grain leather, padded laptop compartment, water-resistant interior, and RFID blocking security.',
    price: 89.00,
    category: 'Fashion',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'Mechanical RGB Gaming Keyboard',
    description: 'Tactile blue switches, customizable per-key RGB backlighting, durable aluminum top frame, and detachable wrist rest.',
    price: 119.00,
    category: 'Electronics',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'Ultra-Fine Ceramic Drip Coffee Set',
    description: 'Handcrafted ceramic pour-over coffee dripper with heat-resistant borosilicate glass carafe and precision stainless steel mesh filter.',
    price: 45.99,
    category: 'Home & Living',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'Wireless Ergonomic Vertical Mouse',
    description: 'Promotes neutral wrist posture to decrease muscle strain with dual Bluetooth and 2.4G wireless connectivity.',
    price: 39.99,
    category: 'Gadgets',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'Architectural Design Annual Monograph',
    description: 'Hardcover visual volume exploring contemporary global architecture, interior aesthetics, and sustainable engineering concepts.',
    price: 65.00,
    category: 'Books',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'Performance Studio Running Shoes',
    description: 'Lightweight breathable mesh knit upper with reactive foam cushioning for maximum energetic stride stability.',
    price: 129.99,
    category: 'Sports',
    stock: 22,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
  },
];

const seedData = async () => {
  try {
    await connectDB();
    await syncModels();

    console.log('MySQL Database Connected for seeding...');

    // Clear existing data
    await User.destroy({ where: {}, truncate: false });

    const createdUsers = [];
    for (const u of sampleUsers) {
      const user = await User.create(u);
      createdUsers.push(user);
    }

    const sellerUser = createdUsers.find((u) => u.role === 'Sales Person') || createdUsers[0];

    for (const p of sampleProducts) {
      await Product.create({
        ...p,
        sellerId: sellerUser.id,
      });
    }

    console.log('Database Seeded Successfully into MySQL!');
    console.log('----------------------------------------------------');
    console.log('Admin Account:   admin@ecommerce.com  / Password123!');
    console.log('Seller Account:  seller@ecommerce.com / Password123!');
    console.log('User Account:    user@ecommerce.com   / Password123!');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
