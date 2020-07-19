const mongoose  = require('mongoose');
const validator = require('validator');
const bcrypt    = require('bcryptjs');
//todo [name,email,photo,password,passwordconfirm]

const userSchema = new mongoose.Schema({

    name:
    {
        type:String,
        required: [true, 'Please tell us your name!']
    },
    email:
    {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    password:
    {
        type: String,
        required: [true, 'Please provide the password'],
        minlength: 8,
        select: false
    },
    passwordConfirm:
    {
        type: String,
        required: [true, 'Please confirm ypur password'],
        validate:
        {
            //todo THIS ONLY WORK WITH THE CREATEE AND THE SAVE METHOD
            validator: function(el){
                return el === this.password;
            },
            message: 'Password are not the same'
        }
    },
    passwordChangedAt: Date

});

//!RUNS BETWEEN THE DATA RECIVES AND THE DATA STORE
userSchema.pre('save', async function(next){
    // only run this function if the password was actually modified
    if(!this.isModified('password')) return next();
    // hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    // Delete passwordConfirm filed
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function(candidatePass, userPassword)
{
    return await bcrypt.compare(candidatePass, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp)
{
    if(this.passwordChangedAt)
    {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimeStamp
    }
    // false means not changed
    return false;
}

//*MODEL
const User = mongoose.model('User', userSchema);

module.exports = User;