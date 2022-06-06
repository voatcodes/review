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




//display login business profile form

app.get('/login-business-profile', (req, res) => {
    const user = {
        b_name: '',
        b_password: '',
    }
    res.render('login-business-profile', {error: false, user:user})
})



//submit login business profile form

app.post('/login-business-profile', (req, res) => {

    connection.query(
        'SELECT * FROM business_profile WHERE b_name = ?',
        [req.body.b_name],
        (error, results) => {
            if(results.length > 0) {
                // authenticate 
                bcrypt.compare(req.body.b_password, results[0].b_password, (error, matches) => {
                    if(matches) {
                        res.redirect('/')
                    } else {
                        const user = {
                            b_name: req.body.b_name,
                            b_password: req.body.b_password
                        }
                        let message = 'Name/Password mismatch.'
                        res.render('login-business-profile', {error: true, message: message, user: user})
                    }
                })    
            } else {
                const user = {
                    b_name: req.body.b_name,
                    b_password: req.body.b_password
                }
                let message = 'Account does not exist. Please create one.'
                res.render('login-business-profile', {error: true, message: message, user: user})
            }
        }
    )
})



app.get('/about', (req, res) => {
    res.render('about', {name: name})
})
// create a route '/about' and send 'about page' as response

//create business profile
// app.get('/create-business-profile', (req,res) => {
//     res.render('create-business-profile')
// })


//display create business profile form

app.get('/create-business-profile', (req,res) => {
    const user = {
        b_name: '',
        b_tag_line: '',
        b_category: '',
        b_description: '',
        b_location: '',
        b_contact_person: '',
        b_phone_number: '',
        b_password: '',
        confirmPassword: ''
    }
    res.render('create-business-profile', {error: false, user: user})
})

//submit create business profile form

app.post('/create-business-profile', (req,res) => {

    const profile = {
        business: {
                name: req.body.businessName,
                email: req.body.businessEmail,
                tagLine:req.body.tagLine,
                category: req.body.businessCategory,
                description: req.body.businessdescription,
                location: req.body.businessLocation
        },
        rep: {
            name: req.body.adminName,
            contacts: req.body.adminPhoneNumber,
            email: req.body.adminEmail,
            password: req.body.adminPassword,
            cPassword: req.body.adminConfirmPassword
        }
    }
    

    if (profile.rep.passwod === profile.rep.cPassword) {
        
        let sql = 'SELECT * FROM business_profile WHERE b_email = ?'

        connection.query(
            sql, [profile.business.email], (error, results) => {
                if (results.length >0) {
                    let message = 'Business profile with email provided already exists.'
                    res.render('create-business-profile', {error: true, message: message, profile: profile})

                } else {
                    bcrypt.hash(profile.rep.password, 10, (error, hash) => {
                        let sql = 'INSERT INTO business_profile (b_name, b_email, b_tag_line, b_category, b_description, b_location, b_contact_person, b_phone_number, b_email-address, b_password) VALUES (?,?,?,?,?,?,?,?,?,?)'
                        connection.query(
                            sql, 
                            [
                                profile.business.name,
                                profile.business.email,
                                profile.business.tagLine,
                                profile.business.category,
                                profile.business.description,
                                profile.business.location,,
                                profile.rep.name,
                                profile.rep.contacts,
                                profile.rep.email,
                                hash
                            ],
                            (error, results) => {
                                res.send('/business profile succesfully craeted')
                            }
                        )
                        
                    })   
                }
            }
        )
    
    } else {
        let message = 'Password and confirm password does not match'
        res.render('create-business-profile', {error: true, message: message, profile: profile})
    } 
})


// return 404 error
app.get('*', (req, res) => {
    res.send('404 Error. Page Not Found!')
})

const PORT = process.env.PORT || 3000

app.listen(3000, () => {
    console.log('Server up. Application running...')
})