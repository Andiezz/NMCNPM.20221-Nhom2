const CardIdentity = require('../models/cardIdentity');

const { DatabaseConnectionError, BadRequestError } = require('../utils/error');

exports.createCardIdentity = async ({
  card_id,
  location,
  date,
  expiration,
}) => {
  let isExist = await CardIdentity.exists({ card_id: card_id });
  if (isExist) {
    throw new BadRequestError('Card Identity has already existed.');
  }

  const cardIdentity = new CardIdentity({
    card_id: card_id,
    location: location,
    date: date,
    expiration: expiration,
  });

  const newCardIdentity = await cardIdentity.save();

  if (newCardIdentity !== cardIdentity) {
    const err = new Error('Failed to connect with database.');
    err.statusCode = 500;
    throw err;
  }

  return newCardIdentity;
};

exports.updateCardIdentity = async ({
  _id,
  card_id,
  location,
  date,
  expiration,
}) => {
  const updatedCardId = await CardIdentity.findById(_id);
  const isExist = await CardIdentity.findOne({ card_id: card_id })

  if (updatedCardId.card_id !== card_id && isExist) {
    throw new BadRequestError('This card id has already been used.')
  }

  updatedCardId.card_id = card_id;
  updatedCardId.location = location;
  updatedCardId.date = date;
  updatedCardId.expiration = expiration;

  const savedCardId = await updatedCardId.save();

  if (savedCardId !== updatedCardId) {
    throw new DatabaseConnectionError('Failed to connect with database.');
  }

  return savedCardId;
};
