import express from 'express'

const app = express()

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/about', (req, res) => {
    res.render('about')
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