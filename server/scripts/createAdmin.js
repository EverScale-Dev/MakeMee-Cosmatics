const mongoose = require('mongoose');
require('dotenv').config();

async function createAdmin() {
  // Parse --role flag (default: super_admin)
  const args = process.argv.slice(2);
  const roleIndex = args.indexOf('--role');
  const role = roleIndex !== -1 && args[roleIndex + 1] ? args[roleIndex + 1] : 'super_admin';

  if (!['admin', 'super_admin'].includes(role)) {
    console.error('Invalid role. Use --role admin or --role super_admin');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI);

  const User = require('../models/User');

  // Check if admin exists
  let admin = await User.findOne({ email: 'admin@makemee.in' });

  if (admin) {
    console.log('Admin exists:', admin.email, 'Role:', admin.role);
    // Update role
    if (admin.role !== role) {
      admin.role = role;
      await admin.save();
      console.log('Updated to', role, 'role');
    }
  } else {
    // Create admin
    admin = await User.create({
      fullName: 'Admin',
      email: 'admin@makemee.in',
      password: 'Admin@123',
      role: role,
      authProvider: 'local'
    });
    console.log('Admin created:', admin.email, 'Role:', role);
  }

  await mongoose.disconnect();
  console.log('Done');
}

createAdmin().catch(e => console.error('Error:', e.message));
