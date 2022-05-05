import express from 'express'

const app = express()

app.set('view engine', 'ejs')

let countries = ['fiji', 'thailand', 'phillipines', 'South Korea', 'japan', 'vietnam']

app.get('/', (req, res) => {
    res.render('index', {title: 'This is the index page', countries: countries})
})

let name = 'valarie tila'

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