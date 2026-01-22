const mongoose = require('mongoose');
require('dotenv').config();

async function createAdmin() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI);

  const User = require('../models/User');

  // Check if admin exists
  let admin = await User.findOne({ email: 'admin@makemee.in' });

  if (admin) {
    console.log('Admin exists:', admin.email, 'Role:', admin.role);
    // Update role if not admin
    if (admin.role !== 'admin') {
      admin.role = 'admin';
      await admin.save();
      console.log('Updated to admin role');
    }
  } else {
    // Create admin
    admin = await User.create({
      fullName: 'Admin',
      email: 'admin@makemee.in',
      password: 'Admin@123',
      role: 'admin',
      authProvider: 'local'
    });
    console.log('Admin created:', admin.email);
  }

  await mongoose.disconnect();
  console.log('Done');
}

createAdmin().catch(e => console.error('Error:', e.message));
