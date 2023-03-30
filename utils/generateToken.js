const jwt = require('jsonwebtoken')

const generateToken = (id) => {
    return jwt.sign({ id }, 'secret', { expiresIn: '8h' })
}

module.exports = generateToken