export const string = {
    isRequired: function (label, val) {
        if (val.length === 0) {
            return `${label} is required`
        }

        return null
    }

}

export const number = {
    range: function (min, max) {
        return function (value) {
            if (value < min || value > max) {
                return `Please enter between ${min} to ${max}`
            }
            return true
        }
    }
}



