const mongoose =require('mongoose')

if(process.argv.length < 3){
    console.log('Please provide the password as an argument: node mongo.js <passwords>')
    process.exit(1)
}

const password  = process.argv[2]

const url = `mongodb+srv://bahaa:${password}@bahaacluster.s5wit.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: Date,
})

const Person = mongoose.model('Person', personSchema)

if( process.argv[3]){
    const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
    date: new Date(),
    })

    person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
    })
}

Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
})

