export const readInterests = (userId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/interests/${userId}`, {
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