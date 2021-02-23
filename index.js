const {WebhookClient} = require("discord.js");
const path = require("path");
const readline = require("readline");
const Axios = require("axios");

const {spawn} = require("child_process");

const axios = Axios.create({
    baseURL: "https://limebot-userdata.herokuapp.com"
})
const ls = spawn('java', ["-Xms2G", "-Xmx6G", "-jar", "server.jar", "nogui"], {cwd: path.join(__dirname, "../minecraft")});
ls.on('close', (code) => console.log(`child process exited with code ${code}`));
ls.stderr.on('data', console.error);

async function webhook() {
    const {data} = await axios.get("/")
    const webhookClient = new WebhookClient('813534901386215424', 'GzrN9PBUVbQzGJ-BRSV1kwsyDNcHjshPMZ9rPgOVec4V5QSnREYko3lhFY-IYRXXyzNj');

    function sendMessage(userData, parts) {
        webhookClient.send(parts.join(' '), userData);
    }

    function handleMessage(message) {
        const [username, ...parts] = message.split(' ')
        if (data[username]) {
            sendMessage(data[username], parts)
        }
    }

    const rl = readline.createInterface({input: ls.stdout});
    rl.on('line', line => {
        let message = line.toString().split(":").slice(3).join("").slice(1);
        console.log(message)
        handleMessage(message)
    })

}

try {
    webhook()
} catch (e) {
    console.error("Unable to start webhook client");
    console.error(e)
}
