const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const config = require('config');
const security = require('../utils/security');

const User = require('../models/user');
const Fee = require('../models/fee');

exports.adminInit = async () => {
  try {
    mongoose.connect(process.env.MONGO_DATABASE);
    const hashedDefaultPassword = await security.hashPassword(
      config.get('default.password')
    );
    await User.deleteMany({ role: 'admin' });
    let admin = await User.create({
      role: 'ADMIN',
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

exports.feeInit = async () => {
  try {
    mongoose.connect(process.env.MONGO_DATABASE);
    await Fee.deleteMany();
    console.log('Deleted all fee');
    const fee = [
      {
        name: 'Phí vệ sinh',
        required: 6000,
        memberPayment: true,
      },
      {
        name: 'Ủng hộ ngày thương binh-liệt sỹ 27/07',
      },
      {
        name: 'Ủng hộ ngày tết thiếu nhi',
      },
      {
        name: 'Ủng hộ vì người nghèo',
      },
      {
        name: 'Trợ giúp đồng bào bị ảnh hưởng bão lụt',
      },
    ];
    const result = await Fee.insertMany(fee);

    if (result) console.log('Init fee successfully');

    mongoose.connection.close();
  } catch (error) {
    console.log(error);
  }
};
