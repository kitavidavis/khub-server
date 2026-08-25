const { sendEmailViaNodemailer, CONFIG } = require("../utils/sendEmailViaNodemailer");

async function welcomeEmailService({ name, email }){
    try{
        if(!name || !email){
            throw new Error("Missing fields are required to send email");
        }

        await sendEmailViaNodemailer({
            from: CONFIG.from, 
            to: email, 
            subject: `Welcome to WIKI, ${name}`, 
            html: `<p>Hi ${name}, welcome to WIKI</p>`
    });
    } catch(error){
        console.log(error);
    }
}

module.exports = {
    welcomeEmailService
}