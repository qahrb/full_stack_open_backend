const {request, response} = require("express")
const express = require("express")
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('body', (request, response) => {
    return JSON.stringify(request.body)
})

app.use(cors())
app.use(express.json())
app.use(morgan(':method  :url :status :res[content-length] - :response-time ms :body'))

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
                    <h3>Phonebook has info for ${notes.length} people</h3>
                    <br>
                    <h3>${d}</h3>
                    `)
})

app.get('/api/persons',  (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter( person => person.id !== id)
    
    response.status(204).end()
})

const generateId = () => {
    return parseInt(Math.random() * 100000)
}

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

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)

    response.status(204).end()
    
})

const PORT = process.env.port || 3001
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})