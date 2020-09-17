const User = require('../Schemas/users');
const express = require('express');
const app = express();

app.route('/')
    .get(
        (req, res) => {
            if (req.query.username) {
                User.findOne({ username: req.query.username }).then(data => res.status(200).json({ success: true, data: data })).catch(
                    err => res.status(400).json({ success: false, message: err })
                )
            } else if (req.query.role) {
                User.findOne({ role: req.query.role }).then(data => res.status(200).json({ success: true, data: data })).catch(
                    err => res.status(400).json({ success: false, message: err }))
            }

            else {
                User.find({}).then(data => res.status(200).json({ success: true, data: data })).catch(
                    err => res.status(400).json({ success: false, message: err })
                )
            }
        }
    )
    .post((req, res) => {
        let [username, password, email, phone, role] = [req.body.username, req.body.password, req.body.email, req.body.phone, req.body.role];
        new User({
            username,
            password,
            email,
            phone,
            role
        }).save().then((data) => res.status(201).json({ success: true, message: 'User Created.', data: data }))
            .catch(
                err => res.status(500).json({ success: false, message: err })
            );
    })
    .put((req, res) => {
        if (!req.query.username) {
            res.status(400).json({ success: false, message: "No id specified" })
        }
        let fields = {}
        let [password, email, phone, role] = [req.body.password, req.body.email, req.body.phone, req.body.role];
        if (password) {
            fields.password = password;
        }
        if (email) {
            fields.email = email;
        }
        if (phone) {
            fields.phone = phone;
        }
        if (role) {
            fields.role = role;
        }
        console.log(fields);
        User.findOneAndUpdate({ username: req.query.username }, fields, { new: true }).then((data) => {
            if (data) {
                return res.status(200).json({ success: true, message: 'User Updated.', data: data })
            }
            return res.status(400).json({ success: false, message: 'No User Found.' })
        }).catch(
            err => res.status(500).json({ success: false, message: err })
        )


    })
    .delete((req, res) => {
        if (!req.query.username) {
            res.status(400).json({ success: false, message: "No username specified" })
        }
        User.findOneAndDelete({ username: req.query.username }).then((data) => {
            if (data) {
                return res.status(200).json({ success: true, message: 'User Deleted.', data: data })
            }
            return res.status(400).json({ success: false, message: 'No User Found.' })
        }).catch(
            err => res.status(500).json({ success: false, message: err })
        )

    })

module.exports = app;