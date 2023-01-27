const CardIdentity = require('../models/cardIdentity');

exports.createNewCardIdentity = async ({
  citizen_id,
  card_id,
  location,
  date,
  expiration,
}) => {
  const cardIdentity = new CardIdentity({
    citizen_id: citizen_id,
    card_id: card_id,
    location: location,
    date: date,
    expiration: expiration,
  });

  const newCardIdentity = await cardIdentity.save()

  if (newCardIdentity !== cardIdentity) {
    const err = new Error('Failed to connect with database.');
    err.statusCode = 500;
    throw err;
  }

  return newCardIdentity;
};
