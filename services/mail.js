const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const OAuth2 = google.auth.OAuth2;

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOKEN;

const oauth2Client = new OAuth2(
  clientId,
  clientSecret,
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: refreshToken,
});

const send = async (message, email, subject, sender) => {
  const accessToken = await oauth2Client.getAccessToken();

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      type: "OAuth2",
      user: "hngteamsilver@gmail.com",
      clientId,
      clientSecret,
      accessToken: accessToken.token,
      refreshToken,
    },
  });

  let response = await transporter.sendMail({
    from: `'${sender}' <hngteamsilver@gmail.com>`,
    subject: subject,
    to: email,
    text: message,
  });

  console.log(response);
};

module.exports = { send };
