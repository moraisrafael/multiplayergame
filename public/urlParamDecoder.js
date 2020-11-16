export { getUrlParameters, decodeUrlParameters };

function getUrlParameters() {
    const query = window.location.search.substring(1);
    return decodeUrlParameters(query);
}

function decodeUrlParameters(query) {
    const search = /([^&=]+)=?([^&]*)/g;
    let urlParameters = {};

    let match = search.exec(query);
    while (match) {
        const parameter = decodeURIComponent(match[1]);
        const value = match[2] ? decodeURIComponent(match[2]) : undefined;

        if (parameter in urlParameters) {
            if (!Array.isArray(urlParameters[parameter])) {
                urlParameters[parameter] = [urlParameters[parameter]];
            }
            urlParameters[parameter].push(value);
        } else {
            urlParameters[parameter] = decodeURIComponent(value);
        }

        match = search.exec(query);
    }

    return urlParameters;
}
