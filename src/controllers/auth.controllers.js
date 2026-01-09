const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth')
const { AdminAccount } = require('../models')
const { Device } = require('../models');

const signIn = async (req, res) => {
    const { username, password } = req.body;

    try{
        const account = await AdminAccount.findOne({
            where: {
                username
            }
        });

        if (!account) {
            return res.status(404).json({ error: 'Account Not Found'});
        }

        const passwordIsValid = bcrypt.compareSync(password, account.password);
        if (!passwordIsValid) {
            return res.status(401).json({ errors: "Invalid Password!" });
        }

        const token = jwt.sign({
            username: account.username
        }, config.jwt.secret, {
            expiresIn: 86400
        });

        res.json({ auth: true, access_token: token });
    } catch(err) {
        res.status(500).json({ error: err.message });
    };
};

const signOut = (req, res) => {
	res.status(200).json({
	  auth: false,
	  access_token: null,
	  message: 'Signed out'
	});
};
  
module.exports = { signIn, signOut };

    // signup(req, res) {
	// 	return User
	// 		.create({
	// 			name: req.body.name,
	// 			id: req.body.id,
	// 			email: req.body.email,
	// 			password: bcrypt.hashSync(req.body.password, 8)
	// 		}).then(user => {
	// 			Role.findAll({
	// 				where: {
	// 					name: {
	// 						[Op.or]: req.body.roles
	// 					}
	// 				}
	// 			}).then(roles => {
	// 				user.setRoles(roles).then(() => {
	// 					res.status(200).send({
	// 						auth: true,
	// 						id: req.body.id,
	// 						message: "User registered successfully!",
	// 						errors: null,
	// 					});
	// 				});
	// 			}).catch(err => {
	// 				res.status(500).send({
	// 					auth: false,
	// 					message: "Error",
	// 					errors: err
	// 				});
	// 			});
	// 		}).catch(err => {
	// 			res.status(500).send({
	// 				auth: false,
	// 				id: req.body.id,
	// 				message: "Error",
	// 				errors: err
	// 			});
	// 		})
	// },
