import http from "http";
import fs from "fs";

// Get the content type based on the file extension
const getContentType = (path) => {
    const ext = path.split(".")[1];
    switch (ext) {
        case "html":
            return "text/html";
        case "js":
            return "text/javascript";
        case "css":
            return "text/css";
        case "png":
            return "image/png";
        case "jpg":
            return "image/jpg";
        case "svg":
            return "image/svg+xml";
        case "json":
            return "application/json";
        case "txt":
        default:
            return "text/plain";
    }
};

// Serve the /public directory
const server = http.createServer((req, res) => {
    const path = req.url === "/" ? "/index.html" : req.url;

    fs.readFile(`./public${path}`, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end("Not Found");
        } else {
            res.setHeader("Content-Type", getContentType(path));
            res.writeHead(200);
            res.end(data);
        }
    });
});

server.listen(8080);