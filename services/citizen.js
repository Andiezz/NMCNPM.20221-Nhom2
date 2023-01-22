const Citizen = require('../models/citizen');

exports.getCitizenById = async ({ card_id, passport_id }) => {
  const citizen = await Citizen.findOne({
    card_id: card_id,
    passport_id: passport_id,
  });
  return citizen;
};

exports.createNewCitizen = async ({
  card_id,
  passport_id,
  firstName,
  lastName,
  gender,
  dob,
  birthPlace,
  hometown,
  residence,
  religion,
  ethic,
  profession,
  workplace,
  education,
}) => {
  const citizen = new Citizen({
    card_id: card_id,
    passport_id: passport_id,
    name: {
      firstName: firstName,
      lastName: lastName,
    },
    gender: gender,
    dob: dob,
    birthPlace: birthPlace,
    hometown: hometown,
    residence: residence,
    religion: religion,
    ethic: ethic,
    profession: profession,
    workplace: workplace,
    education: education,
  });

  const newCitizen = await citizen.save();
  if (newCitizen !== citizen) {
    const err = new Error('Failed to connect with database.');
    err.statusCode = 500;
    throw err;
  }
  return newCitizen;
};
