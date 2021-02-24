import PCRE from "pcre-to-regexp";

const searchRequest = (recognitionText, requests) => {
    for (let plugin in requests) {
        for (let action in requests[plugin]) {
            let keys = [];
            let re = PCRE("%^" + requests[plugin][action] + "$%ui", keys);
            let match = re.exec(recognitionText.trim());
            if (match) {
                let data = mapKeysMatches(keys, match);
                return {
                    "plugin": plugin,
                    "action": action,
                    "data": data
                };
            }
        }
    }
    return null;
}

const mapKeysMatches = (keys, match) => {
    let datas = {};
    for (let i = 0; i < keys.length; i++) {
        if ('string' === typeof keys[i]) {
            datas[keys[i]] = match[i + 1];
        }
    }
    return datas;
}

export { searchRequest };