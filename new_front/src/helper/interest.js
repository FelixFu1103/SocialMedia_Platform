export const readInterests = (userId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/interests/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const getAllInterests = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/interests`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        }
    })
        .then(response => {            
            return response.json();
        })
        .catch(err => console.log(err));

};


export const assignInterest = (userId, token, userInterests) => {
    return fetch(`${process.env.REACT_APP_API_URL}/interests/${userId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body:  JSON.stringify(  {
            "interests" :userInterests
            })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};


export const unassignInterest = (userId, token, removeInterest) => {
    return fetch(`${process.env.REACT_APP_API_URL}/interests/${userId}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body:  JSON.stringify(  {
            "interest" :removeInterest
            })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};


export const addInterest = (newInterest) => {
    return fetch(`${process.env.REACT_APP_API_URL}/interests`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body:  JSON.stringify(  {
            "title" : newInterest
            })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};