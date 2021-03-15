let getId = (context, len) => {
    let url = context.request.url;
    let id = url.slice(len);
    return id;
}

module.exports = getId;