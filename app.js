var express = require("express");
var bodyParser = require("body-parser");
var nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const config = require("./config");
const axios = require("axios");
const { stringify } = require("querystring");
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const connect = mongoose
  .connect(config.mongourl, {
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Mondo db connected...."))
  .catch((err) => console.log(err));

const timelineSchema = new mongoose.Schema({
  branch: String,
  semesters: [
    {
      subjects: [String],
      suggested_subjects: [String],
    },
  ],
});

const subjectSchema = new mongoose.Schema({
  code: String,
  title: String,
  L: String,
  T: String,
  P: String,
  J: String,
  C: String,
  comments: [String],
  upvotes: Number,
  rating: Number,
  ips: [String],
});

const subject = mongoose.model("subjects2", subjectSchema);
const timeline = mongoose.model("timelines", timelineSchema);

app.get("/subjectrequest1", async (req, res) => {
  const subs = await subject.find({});
  res.status(200).json(subs);
});

app.get("/subjectrequest2", async (req, res) => {
  const subs = await subject.find({});
  res.status(200).json(subs);
});

app.get("/subjectrequest3", async (req, res) => {
  const subs = await subject.find({});
  res.status(200).json(subs);
});

app.get("/subjectrequest4", async (req, res) => {
  const subs = await subject.find({});
  res.status(200).json(subs);
});

app.get("/subjectrequest5", async (req, res) => {
  const subs = await subject.find({});
  res.status(200).json(subs);
});

app.get("/subjectrequest6", async (req, res) => {
  const subs = await subject.find({});
  res.status(200).json(subs);
});

app.post("/suggest", async (req, res) => {
  const { code, branch, sem } = req.body; //sem is array index in timeline.subjects
  const suggest = await timeline.findOne({ branch });
  suggest.subjects[sem].push(code);
  suggest.save();
});

app.post("/search", async (req, res) => {
  const { code } = req.body; //sem is array index in timeline.subjects
  res.redirect(`/subject/${code.substr(0, 7)}`);
});

app.post("/upvote", async (req, res) => {
  const { code } = req.body;
  const subject = await subject
    .findOneAndUpdate({ code }, { $inc: { upvotes: 1 } })
    .exec();
});

app.post("/comment", async (req, res) => {
  console.log(req.body);
  const { code, comment, upvote } = req.body;
  var ip = req.headers["x-forwarded-for"];
  const checker = await subject.findOne({ code: code });
  if (checker.ips.indexOf(ip) !== -1)
    return res.json({ code: `/subject/${code}` });
  if (!req.body.captcha)
    return res.json({ success: false, msg: "Please select captcha" });
  const secretKey = "6LeD-AEaAAAAACgS5NJdouinMYUtlqjmYPPKJuSE";

  const query = stringify({
    secret: secretKey,
    response: req.body.captcha,
    remoteip: req.connection.remoteAddress,
  });
  const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;
  const config = {
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
    },
  };
  // Make a request to verifyURL
  let body = await axios.get(verifyURL, config);
  body = body.data;
  // If not successful
  if (body.success !== undefined && !body.success)
    return res.json({ success: false, msg: "Failed captcha verification" });
  if(upvote !== '')
  {  
    const subjectinfo = await subject
    .findOneAndUpdate(
      { code },
      {
        $push: { comments: comment, ips: ip },
        $inc: { upvotes: +1, rating: +upvote },
      },
      { new: true }
    )
    .exec();
  }
  else
  {
    const subjectinfo = await subject
    .findOneAndUpdate(
      { code },
      { $push: { comments: comment }},
      { new: true }
    )
    .exec();
  }
  res.json({ code: `/subject/${code}` });
});

app.get("/subject/:code", async (req, res) => {
  const { code } = req.params;
  const subjectinfo = await subject.findOne({ code });
  if (subjectinfo !== null) {
    res.render("subject.ejs", { subject: subjectinfo });
  } else {
    res.render("not_found.ejs", {
      notFound: "/assets/pageNotFound.png",
      title_logo: "/assets/coach.png",
    });
  }

  //send ejs with this data
});

app.post("/civilrequest", function (req, res) {
  res.redirect("/civil");
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "morningrobot@gmail.com",
      pass: "ggggffff",
    },
  });

  var mailOptions = {
    from: "wimpywarlord@gmail.com",
    to: "greetyourgirlfriend@gmail.com",
    subject: "CIVIL SUGGESTION",
    text: JSON.stringify(req.body),
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
});
app.post("/cserequest", function (req, res) {
  console.log(req.body);
  res.redirect("/cse");
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "morningrobot@gmail.com",
      pass: "ggggffff",
    },
  });

  var mailOptions = {
    from: "wimpywarlord@gmail.com",
    to: "greetyourgirlfriend@gmail.com",
    subject: "CSE SUGGESTION",
    text: JSON.stringify(req.body),
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
});
app.post("/ecerequest", function (req, res) {
  console.log(req.body);
  res.redirect("/ece");
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "morningrobot@gmail.com",
      pass: "ggggffff",
    },
  });

  var mailOptions = {
    from: "wimpywarlord@gmail.com",
    to: "greetyourgirlfriend@gmail.com",
    subject: "ECE SUGGESTION",
    text: JSON.stringify(req.body),
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
});
app.post("/eeerequest", function (req, res) {
  console.log(req.body);
  res.redirect("/eee");
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "morningrobot@gmail.com",
      pass: "ggggffff",
    },
  });

  var mailOptions = {
    from: "wimpywarlord@gmail.com",
    to: "greetyourgirlfriend@gmail.com",
    subject: "EEE SUGGESTION",
    text: JSON.stringify(req.body),
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
});
app.post("/itrequest", function (req, res) {
  console.log(req.body);
  res.redirect("/it");
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "morningrobot@gmail.com",
      pass: "ggggffff",
    },
  });

  var mailOptions = {
    from: "wimpywarlord@gmail.com",
    to: "greetyourgirlfriend@gmail.com",
    subject: "IT SUGGESTION",
    text: JSON.stringify(req.body),
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
});
app.post("/mechrequest", function (req, res) {
  console.log(req.body);
  res.redirect("/mech");
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "morningrobot@gmail.com",
      pass: "ggggffff",
    },
  });

  var mailOptions = {
    from: "wimpywarlord@gmail.com",
    to: "greetyourgirlfriend@gmail.com",
    subject: "MECH SUGGESTION",
    text: JSON.stringify(req.body),
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
});

app.get("/", function (req, res) {
  res.render("landing_page.ejs", {
    title_logo: "/assets/coach.png",
    facebook: "/assets/facebook.png",
    github: "/assets/github.png",
    instagram: "/assets/instagram.png",
    whatsapp:"/assets/whatsapp.png"
  });
});


app.get("/it", function (req, res) {
  timeline.find({ branch: "IT" }, function (err, alltimlines) {
    if (err) {
      console.log(err);
    } else {
      subject.find({}, function (err, allsubjects) {
        if (err) {
          console.log(err);
        } else {
          res.render("it_timeline.ejs", {
            title_logo: "/assets/coach.png",
            timeline: alltimlines,
            subjects: allsubjects,
          });
        }
      });
    }
  });
});

app.get("/cse", function (req, res) {
  timeline.find({ branch: "CSE" }, function (err, alltimlines) {
    if (err) {
      console.log(err);
    } else {
      subject.find({}, function (err, allsubjects) {
        if (err) {
          console.log(err);
        } else {
          res.render("cse_timeline.ejs", {
            title_logo: "/assets/coach.png",
            timeline: alltimlines,
            subjects: allsubjects,
          });
        }
      });
    }
  });
});

app.get("/ece", function (req, res) {
  timeline.find({ branch: "ECE" }, function (err, alltimlines) {
    if (err) {
      console.log(err);
    } else {
      subject.find({}, function (err, allsubjects) {
        if (err) {
          console.log(err);
        } else {
          res.render("ece_timeline.ejs", {
            title_logo: "/assets/coach.png",
            timeline: alltimlines,
            subjects: allsubjects,
          });
        }
      });
    }
  });
});

app.get("/eee", function (req, res) {
  timeline.find({ branch: "EEE" }, function (err, alltimlines) {
    if (err) {
      console.log(err);
    } else {
      subject.find({}, function (err, allsubjects) {
        if (err) {
          console.log(err);
        } else {
          res.render("eee_timeline.ejs", {
            title_logo: "/assets/coach.png",
            timeline: alltimlines,
            subjects: allsubjects,
          });
        }
      });
    }
  });
});

app.get("/civil", function (req, res) {
  timeline.find({ branch: "CIVIL" }, function (err, alltimlines) {
    if (err) {
      console.log(err);
    } else {
      subject.find({}, function (err, allsubjects) {
        if (err) {
          console.log(err);
        } else {
          res.render("civil_timeline.ejs", {
            title_logo: "/assets/coach.png",
            timeline: alltimlines,
            subjects: allsubjects,
          });
        }
      });
    }
  });

  //   let transporter = nodemailer.createTransport({
  //     service: "gmail",
  //     auth: {
  //       user: "miniorganisation@gmail.com",
  //       pass: "sankarvishnu23",
  //     },
  //   });
  //   let info = await transporter.sendMail({
  //     from: `Subjects-List <minioraganisation@gmail.com>`,
  //     to: "kvs.sankar001@gmail.com",
  //     subject: `${req.title}`,
  //     text: "Suggestion for subjects",
  //     html: `<h1>${req.title}</h1><br>${req.matter}<p></>`,
  //   });

  //   console.log("Message sent: %s", info.messageId);
  //   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
});

app.get("/mech", function (req, res) {
  timeline.find({ branch: "MEE" }, function (err, alltimlines) {
    if (err) {
      console.log(err);
    } else {
      subject.find({}, function (err, allsubjects) {
        if (err) {
          console.log(err);
        } else {
          res.render("mech_timeline.ejs", {
            title_logo: "/assets/coach.png",
            timeline: alltimlines,
            subjects: allsubjects,
          });
        }
      });
    }
  });
});

app.get("*", function (req, res) {
  res.render("not_found.ejs", {
    notFound: "/assets/pageNotFound.png",
    title_logo: "/assets/coach.png",
  });
});

app.listen(process.env.PORT || 8000, function () {
  console.log("SERVER 8000 HAS STARTED");
});
