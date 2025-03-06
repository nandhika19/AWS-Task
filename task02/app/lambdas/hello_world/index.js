exports.handler = async (event) => {
    const path = event.rawPath || "/";
    const method = event.requestContext?.http?.method || "UNKNOWN";
    if (path === "/hello" && method === "GET") {
        return {
            statusCode: 200,
            body: JSON.stringify({
                statusCode: 200,
                message: "Hello from Lambda"
            }),
            headers: {
                "content-type": "application/json"
            },
            isBase64Encoded: false
        };
    } else {
        return {
            statusCode: 400,
            body: JSON.stringify({
                statusCode: 400,
                message: `Bad request syntax or unsupported method. Request path: ${path}. HTTP method: ${method}`
            }),
            headers: {
                "content-type": "application/json"
            },
            isBase64Encoded: false
        };
    }
};
