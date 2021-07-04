function currentLatAndLong() {
    return new Promise((resolve, reject) => {
        //Prompt user permission for knowing location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (position.coords.latitude && position.coords.longitude) {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                }
            },
            (error) => {
                reject(error.message);
            },
            { enableHighAccuracy: true }
        );
    });
}

function roundDownNearest(rating, interval) {
    const floor = parseFloat(Math.floor(rating))
    if (rating - floor < interval) {
        return floor
    }
    return floor + interval
}

export default {
    currentLatAndLong,
    roundDownNearest
}