const express = require('express');
const { Customer } = require('./models');
const app = express();
app.use(express.json());
const PORT = 4000

const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

app.post('/customer/register', async (req, res) => {
    try {
        const { name, username, email, password, phoneNumber, address } = req.body;
        if (!email) {
            return res.status(400).json({ code: 400, message: ['Email is null'] });
        }
        if (!password) {
            return res.status(400).json({ code: 400, message: ['Password is null'] });
        }
        if (!validateEmail(email)) {
            return res.status(400).json({ code: 400, message: ['Invalid email format'] });
        }
        const customer = await Customer.create({ name, username, email, password, phoneNumber, address });
        res.status(201).json({ id: customer.id, email: customer.email });
    } catch (error) {
        res.status(400).json({ code: 400, message: [error.message] });
    }
});

app.post('/customer/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ code: 400, message: ['Email and password are required'] });
        }
        const customer = await Customer.findOne({ where: { email } });
        if (!customer || customer.password !== password) {
            return res.status(401).json({ code: 401, message: ['invalid email / password'] });
        }
        res.status(200).json({ access_token: 'fake-jwt-token' });
    } catch (error) {
        res.status(400).json({ code: 400, message: [error.message] });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;