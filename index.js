const server = require('./server/server.js');

const PORT = process.env.PORT || 3333;

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
