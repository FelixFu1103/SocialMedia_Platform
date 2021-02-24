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
    console.log("assgnInt in interest.js called");
    return fetch(`${process.env.REACT_APP_API_URL}/interests`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body:  JSON.stringify(  {
            "userId" : userId,
            "interests" :userInterests
            })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};