const mongoose = require('./connection')
const Background = require('./background')
const db = mongoose.connection
console.log("sus")
db.on('open',() => {
    console.log('hello')
    const startBackgrounds = [
        {
            url: "/assets/daniel-sessler-p_3j4nZpZw4-unsplash.jpg"
        }
      ]
      Background.remove({})
        .then(deletedBackgrounds => {
            console.log('this is what remove return', deletedBackgrounds)
            Background.create(startBackgrounds)
            .then(data => {
                console.log('the new backgrounds', data)
                db.close()
            })
            .catch(error => {
                console.log(error)
                db.close()
            })
        })
        .catch(error => {
            console.log('error:', error)
            db.close
        })
})