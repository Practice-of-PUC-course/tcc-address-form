module.exports = {
    apps: [{
        name: "tcc-address-form",
        script: "server.js",
        exec_mode: "cluster",
        instances: 1,
        output: "/data/logs/out.log",
        error: "/data/logs/err.log"
    }]
}