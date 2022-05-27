import express from 'express'
import bcrypt from 'bcrypt'
import mysql from 'mysql'

const app = express()

// create connection with the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'review_db'
})

// set a template engine for the app, ejs (embeded java script)

app.set('view engine', 'ejs')

// source static files from public
app.use(express.static('public'))

// configuration to access form information
app.use(express.urlencoded({extended:false}))

/* FROM HERE ONWARDS ITS ROUTES*/

app.get('/', (req, res) => {
    res.render('index')
})

// display login form
app.get('/login', (req, res) => {
    const user = {
        email: '',
        password: '',
    }
    res.render('login', {error: false, user:user})
})

// submit login form
app.post('/login', (req, res) => {

    connection.query(
        'SELECT * FROM users WHERE email = ?',
        [req.body.email],
        (error, results) => {
            if(results.length > 0) {
                // authenticate 
                bcrypt.compare(req.body.password, results[0].password, (error, matches) => {
                    if(matches) {
                        res.redirect('/')
                    } else {
                        const user = {
                            email: req.body.email,
                            password: req.body.password
                        }
                        let message = 'Email/Password mismatch.'
                        res.render('login', {error: true, message: message, user: user})
                    }
                })    
            } else {
                const user = {
                    email: req.body.email,
                    password: req.body.password
                }
                let message = 'Account does not exist. Please create one.'
                res.render('login', {error: true, message: message, user: user})
            }
        }
    )
})
    
// display signup form

app.get('/signup', (req, res) => {
    const user = {
        fullname: '',
        email: '',
        password: '',
        confirmPassword: ''
    }
    res.render('signup', {error: false, user: user})
})

// submit signup form
app.post('/signup', (req, res) => {

   

    if(req.body.password === req.body.confirmPassword) {

        connection.query(
            'SELECT email FROM users WHERE email = ?',
            [req.body.email], 
            (error, results) => {
                if(results.length > 0){
                 const user = {
                     fullname: req.body.fullname,
                     email: req.body.email,
                     password: req.body.password,
                     confirmPassword: req.body.confirmPassword
                 }
                 let message = 'Account already exists with the email provided'
                 res.render('signup', {error: true, message: message, user: user })
                } else {
                 bcrypt.hash(req.body.password, 10, (error, hash) => {

                    connection.query(
                        'INSERT INTO users (fullname, email, password) VALUES (?,?,?)',
                        [req.body.fullname, req.body.email, hash],
                        (error, results) => {
                            res.redirect('/login')
                        }
                    )
                     
                 })   
                }
            }
         )
        
    } else {
    const user = {
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    }
    let message = 'Password and confirm password does not match'
    res.render('signup', {error: true, message: message, user: user})
}
    
})




app.get('/about', (req, res) => {
    res.render('about', {name: name})
})
// create a route '/about' and send 'about page' as response

//create business profile
app.get('/create-business-profile', (req,res) => {
    res.render('create-business-profile')
})


// return 404 error
app.get('*', (req, res) => {
    res.send('404 Error. Page Not Found!')
})

const PORT = process.env.PORT || 3000

app.listen(3000, () => {
    console.log('Server up. Application running...')
})