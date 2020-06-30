// You need to complete this controller with the required 7 actions

const viewPath = 'reservations';
const Reservation = require('../models/reservation');
const User = require('../models/user');
// Is this restaurants array not supposed to be here? Even with the hint on slack I seem to be missing something.
const restaurants = ["Kelseys", "Montanas", "Outbacks", "Harveys", "Swiss Chalet"];

exports.index = async (req, res) => {
    try {
        
        const reservations = await Reservation
        .find()

        res.render(`${viewPath}/index`, {
            pageTitle: 'List of reservations',
            reservations: reservations
        });
        
    }
    catch {
        req.flash('danger', `Something went wrong displaying the reservations: ${error}`);
        res.redirect('/');
    }
};

exports.show = async (req, res) => {
    try {
        const reservation = await reservations.findById(req.params.id);
        
        res.render(`${viewPath}/show`, {
            pageTitle: 'Your reservation',
            reservation: reservation
         });
    }
    catch {
        req.flash('danger', `Something went wrong displaying the reservation: ${error}`);
        res.redirect('/');
    }
};

exports.new = async (req, res) => {
    try {
        res.render(`${viewPath}/new`, {
            restaurants: ["Kelseys", "Montanas", "Outbacks", "Harveys", "Swiss Chalet"],
            pageTitle: 'Create a reservation'
        });
    }
    catch {
        req.flash('danger', `Something went wrong displaying the new reservation form ${error}`);
        res.redirect('/');
    }
 
};
// Something in this code does not work. It's likely others are also incomplete, as I can't test them
exports.create = async (req, res) => {
    try {
        const { user: email } = req.session.passport;
        const user = await User.findOne({email: email});

        const reservation = await Reservation.create({user: user._id, ...req.body});

        req.flash('success', 'Reservation successfully created');
        res.redirect(`/reservations/${reservation.id}`);
    }
    catch {
        req.flash('danger', `Something went wrong creating the reservation: ${error}`);
        req.session.formData = req.body;
        res.redirect('/reservations/new');
    }
};

exports.edit = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        res.render(`${viewPath}/edit`, {
            pageTitle: 'Edit your reservation',
            formData: reservation
        })
    }
    catch {
        req.flash('danger', `Something went wrong editing the reservation: ${error}`);
        res,redirect('/');
    }
};

exports.update = async (req, res) => {
    try {
        const { user: email } = req.session.passport;
        const user = await User.findOne({email: email});

        let reservation = await Reservation.findById(req.body.id);
        if (!reservation) throw new Error('Reservation could not be found');

        const attributes = {user: user._id, ...req.body};
        await Reservation.validate(attributes);
        await Reservation.findByIdAndUpdate(attributes.id, attributes);

        req.flash('success', 'The reservation was updated successfully');
        res.redirect(`/plans/${req.body.id}`);

    }
    catch {
        req.flash('danger', `Something went wrong updating the reservation: ${error}`);
        res.redirect(`/reservations/${req.body.id}/edit`);
    }
};

exports.delete = async (req, res) => {
    try {
        await Reservation.deleteOne({_id: req.body.id});
        req.flash('success', 'The reservation was deleted successfully');
        res.redirect(`/plan`);
    }
    catch {
        req.flash('danger', `Something went wrong deleting the reservation: ${error}`);
    }
};