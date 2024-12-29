const express = require('express');
const bcrypt = require('bcrypt');
const sql = require('mssql');
const app = express();

app.use(express.json());

// SQL Server database connection
const dbConfig = {
    user: 'sa', // replace with your SQL Server username
    password: 'Compweb2014', // replace with your SQL Server password
    server: 'BARAKA\\SQLEXPRESS', // replace with your SQL Server instance
    database: 'WINESdatadb', // replace with your target database
    options: {
        encrypt: false, // set to true if using Azure or SQL Server encryption
        trustServerCertificate: true // change to true if needed for local development
    }
};

// Establish the connection
sql.connect(dbConfig, (err) => {
    if (err) {
        console.error('Error connecting to SQL Server:', err.message);
        return;
    }
    console.log('Connected to SQL Server nigga.');
});

//Sign-up endpoint
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const request = new sql.Request();
        const query = 'INSERT INTO users (name, phone, subscription,subscription_status) VALUES (@name,@phone,@subscription,"Active")';
        request.input('Name', sql.VarChar, name);
        request.input('phone', sql.VarChar, phone);
        request.input('subscriptionPlan', sql.VarChar, getSubscriptionValue);
        request.input('startdate', sql.DateTime, null);
        request.input('enddate', sql.DateTime, null);
        request.input('Status', sql.VarChar, 'inactive');
       await request.query(query);
       res.status(201).send('Subscription Activated');
    } catch (err) {
        console.error('Error during signup:', err.message);
        res.status(500).send('Server error');
    }
}); 

// Sign-in endpoint
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const request = new sql.Request();
        const query = 'SELECT * FROM users WHERE phone = @phone';
        request.input('phone', sql.VarChar, phone);
        const result = await request.query(query);

        if (result.recordset.length === 0) {
            res.status(401).send('Invalid phonenumber or password');
            return;
        }

        if (user.subscription_status === 'active') {
            res.status(200).send('Connected');
        } else {
            res.status(403).send('Subscription expired or inactive');

        }
    } catch (err) {
        console.error('Error during Connection:Retry!!:', err.message);
        res.status(500).send('Server error');
    }
});

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});

