require('dotenv').config();
const express = require('express')
const connectDB = require('./DB/connect')
const ShortUrl = require('./models/shortUrl')
const app = express()


app.set('view engine', 'ejs')
// mongoose.set('strictQuery', true)
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl })

  res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    //connect to db
    await connectDB(process.env.MONGO_URL)
    app.listen(port, (req, res) => {
      console.log(`server is listening on port ${port}.... `)
    })
  } catch (err) {
    console.log(err)
  }
}

start()

