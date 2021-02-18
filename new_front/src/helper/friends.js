export const recommendfriend = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}/recommendation`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {            
            return response.json();
        })
        .catch(err => console.log(err));
};


