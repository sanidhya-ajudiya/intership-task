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
};
