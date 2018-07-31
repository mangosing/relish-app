const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const shortid = require('shortid');

const adminSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: shortid.generate
        },
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        passwordResetToken: { type: String }
    },
    { timestamps: true }
);

adminSchema.pre('save', function(next) {
    const admin = this;
    if (!admin.isModified('password')) {
        return next();
    }
    return bcrypt
        .hash(admin.password, 10)
        .then(hashedPassword => {
            admin.password = hashedPassword;
            return next();
        })
        .catch(err => {
            return next(err);
        });
});

adminSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
