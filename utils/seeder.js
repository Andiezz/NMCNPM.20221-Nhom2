const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const config = require('config');
const security = require('../utils/security');

const User = require('../models/user');

exports.adminInit = async () => {
  try {
    mongoose.connect(process.env.MONGO_DATABASE);
    const hashedDefaultPassword = await security.hashPassword(
      config.get('default.password')
    );
    await User.deleteMany({ role: 'admin' });
    let admin = await User.create({
      role: 'admin',
      citizen_id: mongoose.Types.ObjectId('123456789101112131415161'),
      phone: '0912345678',
      password: hashedDefaultPassword,
      name: {
        first: 'ad',
        last: 'min',
      },
      gender: 'other',
      dob: '01/01/3000',
    });

    if (admin) console.log('Init admin successfully!!!');

    mongoose.connection.close();
  } catch (error) {
    console.log(error);
  }
};
