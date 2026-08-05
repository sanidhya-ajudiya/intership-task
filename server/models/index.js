const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

// User Model
const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('Admin', 'Sales Person', 'User'),
      defaultValue: 'User',
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    },
    phone: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  delete values.password;
  return values;
};

// Product Model
const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0 },
    },
    category: {
      type: DataTypes.ENUM(
        'Electronics',
        'Fashion',
        'Home & Living',
        'Books',
        'Sports',
        'Beauty',
        'Gadgets',
        'Accessories',
        'Other'
      ),
      defaultValue: 'Other',
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      validate: { min: 0 },
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Product.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

// Cart Models
const Cart = sequelize.define(
  'Cart',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

Cart.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

const CartItem = sequelize.define(
  'CartItem',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: { min: 1 },
    },
  },
  {
    timestamps: true,
  }
);

// Wishlist Models
const Wishlist = sequelize.define(
  'Wishlist',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

Wishlist.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

const WishlistItem = sequelize.define(
  'WishlistItem',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    wishlistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// Order Models
const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    paymentId: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled'),
      defaultValue: 'Pending',
    },
    shippingAddress: {
      type: DataTypes.JSON,
      defaultValue: {
        address: '123 Main St',
        city: 'Metropolis',
        postalCode: '10001',
        country: 'India',
      },
    },
    trackingNumber: {
      type: DataTypes.STRING,
      defaultValue: () => `NEX-${Math.floor(100000 + Math.random() * 900000)}`,
    },
    currentLocation: {
      type: DataTypes.STRING,
      defaultValue: 'Logistics Facility',
    },
    estimatedDeliveryDate: {
      type: DataTypes.DATE,
      defaultValue: () => {
        const d = new Date();
        d.setDate(d.getDate() + 3);
        return d;
      },
    },
  },
  {
    timestamps: true,
  }
);

Order.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

const OrderItem = sequelize.define(
  'OrderItem',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

const OrderTrackingHistory = sequelize.define(
  'OrderTrackingHistory',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);

// Model Associations
User.hasMany(Product, { foreignKey: 'sellerId', as: 'products' });
Product.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

User.hasOne(Cart, { foreignKey: 'userId', as: 'cart' });
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

User.hasOne(Wishlist, { foreignKey: 'userId', as: 'wishlist' });
Wishlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Wishlist.hasMany(WishlistItem, { foreignKey: 'wishlistId', as: 'items' });
WishlistItem.belongsTo(Wishlist, { foreignKey: 'wishlistId' });
WishlistItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
OrderItem.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

Order.hasMany(OrderTrackingHistory, { foreignKey: 'orderId', as: 'trackingHistory' });
OrderTrackingHistory.belongsTo(Order, { foreignKey: 'orderId' });

const syncModels = async () => {
  await sequelize.sync({ alter: true });
};

const autoSeedIfEmpty = async () => {
  try {
    const userCount = await User.count();
    if (userCount === 0) {
      console.log('Database is empty. Auto-seeding initial data...');
      
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

      const createdUsers = [];
      for (const u of sampleUsers) {
        const user = await User.create(u);
        createdUsers.push(user);
      }

      const sellerUser = createdUsers.find((u) => u.role === 'Sales Person') || createdUsers[0];

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

      for (const p of sampleProducts) {
        await Product.create({
          ...p,
          sellerId: sellerUser.id,
        });
      }
      console.log('Auto-seeding completed successfully!');
    }
  } catch (err) {
    console.error('Auto-seed check failed:', err.message);
  }
};

module.exports = {
  sequelize,
  User,
  Product,
  Cart,
  CartItem,
  Wishlist,
  WishlistItem,
  Order,
  OrderItem,
  OrderTrackingHistory,
  syncModels,
  autoSeedIfEmpty,
};

