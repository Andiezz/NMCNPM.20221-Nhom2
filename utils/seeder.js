const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const config = require('config');
const security = require('../utils/security');

const User = require('../models/user');
const Fee = require('../models/fee');
const Transaction = require('../models/transaction');
const Household = require('../models/household');

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
    await Transaction.deleteMany();
    console.log('Deleted all transaction');

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

    const fee_list = await Fee.find({ required: { $ne: 0 } });
    const household_list = await Household.find();

    for (i = 0; i < fee_list.length; i++) {
      let total = fee_list[i].required * 12;
      for (j = 0; j < household_list.length; j++) {
        if (fee_list[i].memberPayment) {
          total = household_list[j].members.length * 12 * fee_list[i].required;
        }
        await Transaction.create({
          fee_id: fee_list[i]._id,
          household_id: household_list[j]._id,
          cost: total,
        });
      }
    }

    mongoose.connection.close();
  } catch (error) {
    console.log(error);
  }
};
