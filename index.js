// const dotenv = require('dotenv')

// dotenv.config({path: `.env.${process.env.NODE_ENV}`})

const app = require('./app')

const port = 5000

app.listen(port, () => {
  console.log(`server running on port ${port}`)
})
