const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'pettit.andrew@gmail.com',
        subject: 'Welcome to the task App',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app`

    })
}

const cancelAccountEmail = (email, name) => {
    sgMail.send({
        to: email, 
        from: 'pettit.andrew@gmail.com',
        subject: `We're sorry to see you go`,
        text: `Thanks for being a part of the Task App ${name}, but we are sorry to see you go. `
    })
}
 
module.exports = {
    sendWelcomeEmail,
    cancelAccountEmail
}