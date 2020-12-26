require('dotenv').config()
const {request, response} = require("express")
const express = require("express")
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person.js')

const app = express()

morgan.token('body', (request, response) => {
    return JSON.stringify(request.body)
})

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method  :url :status :res[content-length] - :response-time ms :body'))

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if(error.name === 'CastError'){
        return response.status(400).send({error: 'malformatted id'})
    }

    next(error)
}

let persons = [
    {
        id: 1,
        name: "Mohamed Mohamed",
        number: "0555-55555",
    },{
        id: 2,
        name: "Ahmed Sayed",
        number: "0666-55555",
    },{
        id: 3,
        name: "Amr Omar",
        number: "0888-55555",
    },{
        id: 4,
        name: "Tariq Ali",
        number: "0100-55555",
    },
]

app.get('/info', (request, response) => {
    let d = new Date()
    response.send(`
                    <h3>Phonebook has info for ${persons.length} people</h3>
                    <br>
                    <h3>${d}</h3>
                    `)
})

app.get('/api/persons',  (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.use(errorHandler)

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        if(person)
        {response.json(person)}
        else
        {response.status(404).end()}
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    console.log(request.params.id)
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name && !body.number) {
        return response.status(400).json({ 
          error: 'name or number missing' 
        })
    }

    const exists = persons.find( person => person.name === body.name)

    if(exists){
        return response.status(400).json({ 
            error: 'this name is already existing' 
          })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
        date: new Date(),
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })  
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number:body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(result => {
            response.json(result)
        })
        .catch(error =>next(error))
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})