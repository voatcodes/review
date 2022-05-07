import express from 'express'
import bcrypt from 'bcrypt'

const app = express()

// set a template engine for the app, ejs (embeded java script)

app.set('view engine', 'ejs')

// source static files from public
app.use(express.static('public'))

// configuration to access form information
app.use(express.urlencoded({extended:false}))

const users = [
    {
        id: 2,
        fullname: 'Valarie Tila',
        email: 'valarie@review.com',
        password: '$2b$10$hveJJj/xI2TawYbQrwZl2ObNlzqUwUQnexQOJk5pT9bk0Zl9nISKm'
      }
]

app.get('/', (req, res) => {
    res.render('index')
})

// display login form
app.get('/login', (req, res) => {
    res.render('login')
})

// submit login form
app.post('/login', (req, res) => {

    const user = users.find(user => user.email === req.body.email)

    if(user) {
        // authenticate 
        bcrypt.compare(req.body.password, user.password, (error, matches) => {
            if(matches) {
                console.log('grant access')
            } else {
                console.log('Email/password mismatch')
            }
        })
        
    } else {
        console.log('Error. Account does not exist. Please create one.')
    }
})

// display signup form

app.get('/signup', (req, res) => {
    res.render('signup')
})

// submit signup form
app.post('/signup', (req, res) => {

    if(req.body.password === req.body.confirmPassword) {
        bcrypt.hash(req.body.password, 10, (error, hash) => {
            const user = {
                id: users.length + 1,
                fullname: req.body.fullname,
                email: req.body.email,
                password: hash
            }
            users.push(user)
            console.log(user)
            console.log('Account successsfully created')
        })
        
    } else {
        console.log('Error. Password and Confirm password does not match.')
    }  
    
})




app.get('/about', (req, res) => {
    res.render('about', {name: name})
})
// create a route '/about' and send 'about page' as response

// return 404 error
app.get('*', (req, res) => {
    res.send('404 Error. Page Not Found!')
}
)

const PORT = process.env.PORT || 3000

app.listen(3000, () => {
    console.log('Server up. Application running...')
})