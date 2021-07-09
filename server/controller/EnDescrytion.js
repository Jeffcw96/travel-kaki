const crypto = require('crypto')

class Secure {
    constructor(message, cipher, key, randomBytes, inputEncoding = "utf-8", outputEncoding = "hex") {
        this.message = message
        this.cipher = cipher
        this.key = key
        this.randomBytes = randomBytes
        this.inputEncoding = inputEncoding
        this.outputEncoding = outputEncoding
    }

    generateRandomBytes() {
        if (!this.randomBytes) {
            throw new Error("RANDOM BYTES LENGTH NOT FOUND")
        }
        return crypto.randomBytes(this.randomBytes)
    }

    encryption() {
        try {
            if (!this.message || !this.cipher || !this.key) {
                throw new Error("Missing Crypto Params")
            }
            const randomBytes = this.generateRandomBytes()
            const cipher = crypto.createCipheriv(this.cipher, this.key, randomBytes)
            let encrpted = cipher.update(this.message, this.inputEncoding, this.outputEncoding)
            encrpted += cipher.final(this.outputEncoding)

            return encrpted
        } catch (error) {
            return error
        }
    }

    decryption() {
        try {
            if (!this.message || !this.cipher || !this.key) {
                throw new Error("Missing Crypto Params")
            }
            const randomBytes = this.generateRandomBytes()
            const decipher = crypto.createDecipheriv(this.cipher, this.key, randomBytes)
            let decrpted = decipher.update(this.message, this.inputEncoding, this.outputEncoding)
            decrpted += decipher.final(this.outputEncoding)

            return decipher
        } catch (error) {
            return error
        }
    }

}

module.exports = Secure