#! /usr/bin/env node
import axios from 'axios';

import chalk from 'chalk';
import inquirer from 'inquirer';

import fs from 'fs';

import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// ----> TODO <----
// ✅ Setup inquirer
// ✅ Make the request
// ✅ Log file /logs/[date].log
// ----> TODO <----

let method, link, data, returnedData, dateLiteral, date;
const createDate = () => {
    date = `${dateLiteral.getMonth()}-${dateLiteral.getDay()}-${dateLiteral.getFullYear()}.${dateLiteral.getMinutes()}-${dateLiteral.getSeconds()}`;
} 

console.log(chalk.red('Thank you for using reqsr ♥'));

// Get HTTP module
const askMethod = await inquirer.prompt({
    name: 'http_method',
    type: 'list',
    message: 'What HTTP method would you like to use?',
    choices: [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE'
    ]
});

method = askMethod.http_method;

// Sending data?
const askData = await inquirer.prompt({
    name: 'data',
    type: 'message',
    message: 'If you are sending data, please provide it in JSON format; otherwise, press enter',
    default() { return null; }
});

data = JSON.stringify(askData.data);

// Get website link
const askLink = await inquirer.prompt({
    name: 'link',
    type: 'message',
    message: 'What website are you trying to send a request to?'
});

link = askLink.link;

// Make the request
try {
    switch(method) {
        // Not sure there's any better way to do this,
        // but if you can think of anything please make a PR!
    
        case 'GET':
            if(data) returnedData = await axios.get(link, data)
            else returnedData = await axios.get(link)
            break;
        case 'POST':
            if(data) returnedData = await axios.post(link, data)
            else returnedData = await axios.post(link)
            break;
        case 'PUT':
            if(data) returnedData = await axios.put(link, data)
            else returnedData = await axios.put(link)
            break;
        case 'PATCH':
            if(data) returnedData = await axios.patch(link, data)
            else returnedData = await axios.patch(link)
            break;
        case 'DELETE':
            if(data) returnedData = await axios.delete(link, data)
            else returnedData = await axios.delete(link)
            break;
    }
} catch(err) {
    dateLiteral = new Date();
    createDate();

    fs.writeFileSync(
        `${__dirname}logs/${date}.log`,
        String(err)
    );

    console.log(chalk.redBright(`❌ An error has occured, view full error log in ${__dirname}logs/${date}.log`));
    process.exit(-1);
}


dateLiteral = new Date();
createDate();

const info = {
    method: method,
    date: dateLiteral.toUTCString(),
    link: link,
    status: returnedData.status,
    contentType: returnedData.headers['content-type'],
    protocol: link.startsWith('https') ? 'HTTPS' : 'HTTP',
    body: returnedData.data
}

fs.writeFileSync(
    `${__dirname}logs/${date}.log`,
    String(JSON.stringify(info, null, 4))
);

console.log(chalk.greenBright(`✔ Success! View the log file at ${__dirname}logs/${date}.log!`))
