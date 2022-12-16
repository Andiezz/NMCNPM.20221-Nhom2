const bcrypt = require("bcryptjs")

const User = require("../models/user")
const Citizen = require("../models/citizen")

exports.register = async (req, res, next) => {
    const { role, phone, password, card_id, passport_id, firstName, lastName, gender, dob, birthPlace, 
        hometown, residence, religion, ethic, profession, workplace, education } = req.body
    if (!role) {
        const err = new Error("Role is required!")
        err.statusCode = 422
        throw err
    }

    const check_user = await User.findOne({
        phone: phone,
        role: role
    })

    if (check_user) {
        const err = new Error("This account has already existed!")
        err.statusCode = 400
        throw err
    }

    const check_citizen = await Citizen.findOne({
        card_id: card_id,
        passport_id: passport_id
    })

    if (check_citizen) {
        const err = new Error("This citizen has already existed!")
        err.statusCode = 400
        throw err
    }

    const citizen = new Citizen({
        card_id: card_id,
        passport_id: passport_id,
        name: {
            firstName: firstName,
            lastName: lastName
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
        education: education
    })

    const newCitizen = await citizen.save()
    if (newCitizen !== citizen) {
        const err = new Error("Failed to connect with database.")
        err.statusCode = 500
        throw err
    }

    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new User({
        citizen_id: newCitizen._id,
        role: role,
        phone: phone,
        password: hashedPassword
    })

    const newUser = await user.save()
    if (newUser !== user) {
        const err = new Error("Failed to connect with database.")
        err.statusCode = 500
        throw err
    }

    res.status(200).json({
        responseStatus: 1,
        message: "New user and citizen created!",
        data: {
            user: newUser,
            citizen: newCitizen
        }
    })
}