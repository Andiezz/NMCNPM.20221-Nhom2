const CardIdentity = require('../models/cardIdentity');

const { DatabaseConnectionError } = require("../utils/error")

exports.createCardIdentity = async ({
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

exports.updateCardIdentity = async ({
  card_id,
  location,
  date,
  expiration
}) => {
  const updatedCardId = await CardIdentity.findOne({
		card_id: card_id,
	});

  updatedCardId.card_id = card_id;
	updatedCardId.location = location;
	updatedCardId.date = date;
  updatedCardId.expiration = expiration;

  const savedCardId = await updatedCardId.save();

  if (savedCardId !== updatedCardId) {
		throw new DatabaseConnectionError('Failed to connect with database.');
	}

  return savedCardId;
}
