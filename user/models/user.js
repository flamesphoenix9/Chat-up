const { v4: uuidv4 } = require("uuid");
const argon = require("argon2");
const { mongoose } = require("../../shared/db/index")

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        maxlength: 10,
        trim:true
    },    
    userId: {
        type: String,
        default: uuidv4,
        unique: true,
        immutable: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    firstname: {
        type: String,
        required: true,
        maxlength: 20,
        minlength: 3,
        trim:true
    },
    lastname: {
        type: String,
        required: true,
        maxlength: 20,
        minlength: 3,
        trim:true
    },
    password: {
        type: String,
        required: true,
        minlength:6
    },
    date_of_birth: {
        type: Date, 
        require:true
    },
    verified: {
        type: Boolean,
        default:false
    },
    profile_picture:{
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isStaff: {
        type: Boolean,
        default:false
    }
}, { timestamps: true })

UserSchema.pre("save", (next) => {
    if (!this.userId) {
        this.userId = uuidv4()
        next()
    }
})

UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await argon.hash(this.password);
    }
    next();
});

UserSchema.methods.comparePassword = async function (password) {
    return await argon.verify(this.password, password)
}

UserSchema.statics.getUserId = async function (username) {
  const user = await this.findOne({ username }); 
  if (!user) {
    throw new Error("User not found by username");
  }
  return user.userId;
};
module.exports = mongoose.model("User", UserSchema, "users")