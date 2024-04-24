let userModel = require('../model/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_KEY
const validator = require("./validation/validation")
module.exports.registerUser = async(req,res)=>{
    try {
        const { name, email, password, phone } = req.body; // Assuming request body contains data
    
        // Validation of name
        if (!validator.isValidName(name)) {
          return res.status(400).send({ status: false, message: "Invalid name" });
        }
        const existingEmail = await userModel.findOne({ email });
        if (existingEmail) {
          return res.status(400).send({ status: false, message: "Email already exists" });
        }
    
        // Check if phone number already exists
        const existingPhone = await userModel.findOne({ phone });
        if (existingPhone) {
          return res.status(400).send({ status: false, message: "Phone number already exists" });
        }
        // Validation of email
        if (!validator.isValidEmail(email)) {
          return res.status(400).send({ status: false, message: "Invalid email" });
        }
    
        // Validation of password
        if (!validator.isValidPassword(password)) {
          return res.status(400).send({
            status: false,
            message: "Invalid password. Password must contain at least one upper case letter, one lower case letter, one digit, one special character, and be at least eight characters long.",
          });
        }
    
        // Validation of phone number
        if (!validator.isValidMobile(phone)) {
          return res.status(400).send({ status: false, message: "Invalid phone number" });
        }
    
        
       
    
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create user
        const newUser = await userModel.create({
          name,
          email,
          password: hashedPassword,
          phone,
        });
    
        return res.status(200).json({
          status: true,
          message: "User registered successfully",
        
        });
      }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      }
}

module.exports.userLogin = async(req,res)=>{
    const { email, password } = req.body;

    try {
      const user = await userModel.findOne({ email })
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
    
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      
      const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '30d' });
  
      res.json({ message: 'Login successful', token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
