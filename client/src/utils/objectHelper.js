export const hasValues = (obj) => {

    if (obj === null) return true;
    if (obj === undefined) return true;

    let isEmpty = false;
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key] !== undefined && obj[key] !== '') {
                isEmpty = true;
                break;
            }
        }
    }
    return isEmpty;

}


export const hasNullValues = (obj) => {

    if (obj === null) return true;
    if (obj === undefined) return true;

    let isEmpty = false;
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
                isEmpty = true;
                break;
            }
        }
    }




    return isEmpty;

}

