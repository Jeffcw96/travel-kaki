export const string = {
    isRequired: function (label, val) {
        if (val.length === 0) {
            return `${label} is required`
        }

        return null
    }

}
