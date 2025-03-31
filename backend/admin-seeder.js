const adminDetails = require("./models/Admin/details.model.js");
const adminCredential = require("./models/Admin/credential.model.js");
const connectToMongo = require("./Database/db.js");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const seedData = async () => {
    try {
        await connectToMongo();

        // Clear existing admin data
        await adminCredential.deleteMany({});
        await adminDetails.deleteMany({});

        // Generate dynamic salt
        const dynamicSalt = await bcrypt.genSalt(10);
        const staticSalt = process.env.STATIC_SALT || "mySecretStaticSalt";
        const password = "12345";
        const hashedPassword = await bcrypt.hash(dynamicSalt + password + staticSalt, 10);

        // Create admin credentials with encrypted password
        const adminCred = await adminCredential.create({
            loginid: 1,
            password: hashedPassword,
            dynamic_salt: dynamicSalt
        });

        // Create admin details
        const adminDetail = {
            employeeId: "1",
            firstName: "Khushi",
            middleName: "",
            lastName: "Singh",
            email: "khushiinterns1411@gmail.com",
            phoneNumber: "1234567890",
            gender: "Female",
            type: "Admin",
            profile: "Admin_Profile_1.jpg",
        };

        await adminDetails.create(adminDetail);

        console.log("Seeding completed successfully!");
    } catch (error) {
        console.error("Error while seeding:", error);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

seedData();