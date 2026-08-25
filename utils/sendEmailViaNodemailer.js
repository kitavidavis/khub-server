const nodemailer = require("nodemailer");
const { NODEMAILER_CONFIG } = require("../constants");

// Previously did JSON.parse(NODEMAILER_CONFIG) at module load time with no guard -
// if NODEMAILER_CONFIG wasn't set (e.g. a fresh deploy that hasn't wired up SMTP
// yet), JSON.parse(undefined) throws immediately, which crashed the *entire server*
// at startup (this module is required indirectly by controllers/admins/register.js
// and controllers/users/register.js via services/welcomeEmailService.js). Email
// sending is a non-critical side effect of registration, so a misconfigured/missing
// mailer should disable email sending, not take the whole API down.
let parsedConfig = null;
if (NODEMAILER_CONFIG) {
    try {
        parsedConfig = JSON.parse(NODEMAILER_CONFIG);
    } catch (e) {
        console.error("NODEMAILER_CONFIG is set but is not valid JSON - email sending is disabled.", e.message);
    }
} else {
    console.warn("NODEMAILER_CONFIG is not set - email sending is disabled.");
}

const CONFIG = {
    from: parsedConfig?.auth?.user,
}

const transporter = parsedConfig ? nodemailer.createTransport(parsedConfig) : null;

async function sendEmailViaNodemailer({
    from,
    to,
    subject,
    html
}) {
    if (!transporter) {
        throw new Error("Email is not configured (NODEMAILER_CONFIG missing/invalid).");
    }

    try{
        await transporter.sendMail({
            from,
            to,
            subject,
            html
        });
    } catch(e){
        throw new Error(`Could not send email:${e.message}`);
    }
}

module.exports = {
    sendEmailViaNodemailer,
    CONFIG
}
