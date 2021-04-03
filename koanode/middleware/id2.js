let getId2 = (context, start, end) => {
    let url = context.request.url;
    let id = url.slice(start, end);
    return id;
}

module.exports = getId2;