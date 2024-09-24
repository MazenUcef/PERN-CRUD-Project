const exress = require('express')
const { PrismaClient } = require('@prisma/client')
const express = require('express')

const prisma = new PrismaClient()
const app = express()


// json
app.use(express.json())


// cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    next()
})


// test api with error 500 in case of error
app.get('/test', (req, res) => {
    try {
        res.status(200).json({ message: 'API is working' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})



// get All Users

app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


// getUserByid

app.get('/users/:id', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(req.params.id)
            }
        })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


// create User

app.post('/users', async (req, res) => {
    try {
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
            }
        })
        res.status(201).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})



// update User

app.put('/user/:id', async (req, res) => {
    console.log(req.params.id); 
    
    try {
        const user = await prisma.user.update({
            where: {
                id: Number(req.params.id), // Make sure req.params.id is the correct ID
            },
            
            data: {
                name: req.body.name,
                email: req.body.email,
            },
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});





// delete User

app.delete('/users/:id', async (req, res) => {
    try {
        const user = await prisma.user.delete({
            where: {
                id: Number(req.params.id)
            }
        })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


// start server

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
