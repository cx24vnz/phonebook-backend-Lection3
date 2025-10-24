const express = require('express')
const morgan = require("morgan")
const app = express()
console.log("hi")
app.use(express.json())
app.use(morgan(function (tokens, req, res) {
  let body = req.body 
  return [
    JSON.stringify(body),
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}))

let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
  
  ]
  

  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })
  app.get('/info', (request, response) => {
    response.send(prepareInfo())
  })
  app.get('/api/persons/:id', (request, response) => {
    const id =  request.params.id
    console.log(id)
    const person = findPerson(id)
    console.log(person)

    if (person) {
     return     response.json(person)
    }
    response.status(404).end()

    
   
  })
  app.delete('/api/persons/:id', (request, response) => {
    const id =  request.params.id
     deletePerson(id)

    response.status(204).end()

    
   
  })
  app.post('/api/persons', (request, response) => {
    const person = request.body
     let {responseText , code} =addPerson(person)

    response.status(code)
    response.send({responseText})

    
   
  })
  
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })


  function prepareInfo(){

    
    let date  = new Date();

    let peopleInBook = persons.length

    let html1 = "<p>Phonebook has info for " + peopleInBook + " people </p>"
    let html2 = "<p>"+ date +"</p>"

    return html1 + html2



  }
  function findPerson(id){
    const person = persons.find(person => person.id == id)
    return person
  }
  function deletePerson(id){
   let list = persons.filter(person => person.id != id)
   console.log(list)

   persons = list

  }

  function addPerson(person) {

    let responseText = ""
    let code = 400
    let succesful = false

    if (!person.name) {
         responseText = "Error: name is required"
         return {responseText , code}
    }
    if (!person.number) {
        responseText = "Error: number is required"
        return {responseText , code}
    }

    let nameObj = {}
    persons.forEach((person) => {
        nameObj[person.name] = person
    })

    if (nameObj[person.name]) {
        responseText = "Error: That person already exists in the phonebook"
        return {responseText , code}
    }

   
      succesful= true
    

    person.id = Math.floor(Math.random()*100000)
    persons.push(person)
    console.log(persons)
    responseText = "Sucess: Person added"
    code = 200
    return {responseText , code}

        
  }