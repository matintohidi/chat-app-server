module.exports = mongoose => {
    let userSchema = mongoose.Schema({
        name: {
            type: String,
            required: true,
            min: 3,
            max: 20,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            min: 8
        },
        profile: {
            type: String,
            default: null
        },
        phone: {
            type: String,
            default: null
        },
        city: {
            type: String,
            default: null
        }
    } , { versionKey: false })

    return  mongoose.model("User" , userSchema);
};