const dotenv = require("dotenv");
dotenv.config();
const https = require("https");
const url = require("url");
const querystring = require("querystring");

const redirect_uri = `http://${process.env.backendIPAddress}/courseville/access_token`;
const authorization_url = `https://www.mycourseville.com/api/oauth/authorize?response_type=code&client_id=${process.env.client_id}&redirect_uri=${redirect_uri}`;
const access_token_url = "https://www.mycourseville.com/api/oauth/access_token";

// ---------------------------------------- Login / Logout ----------------------------------------

exports.login = (req, res) => {
  res.redirect(authorization_url);
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect(`http://${process.env.frontendIPAddress}/index.html`);
  //res.end();
};

// ---------------------------------------- Accessing token ----------------------------------------

exports.accessToken = (req, res) => {
  const parsedUrl = url.parse(req.url);
  const parsedQuery = querystring.parse(parsedUrl.query);

  if (parsedQuery.error) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end(`Authorization error: ${parsedQuery.error_description}`);
    return;
  }

  if (parsedQuery.code) {
    const postData = querystring.stringify({
      grant_type: "authorization_code",
      code: parsedQuery.code,
      client_id: process.env.client_id,
      client_secret: process.env.client_secret,
      redirect_uri: redirect_uri,
    });

    const tokenOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": postData.length,
      },
    };

    const tokenReq = https.request(
      access_token_url,
      tokenOptions,
      (tokenRes) => {
        let tokenData = "";
        tokenRes.on("data", (chunk) => {
          tokenData += chunk;
        });
        tokenRes.on("end", () => {
          const token = JSON.parse(tokenData);
          req.session.token = token;
          console.log(req.session);
          if (token) {
            res.writeHead(302, {
              Location: `http://${process.env.frontendIPAddress}/index.html`, //switch to index instead of home
            });
            res.end();
          }
        });
      }
    );
    tokenReq.on("error", (err) => {
      console.error(err);
    });
    tokenReq.write(postData);
    tokenReq.end();
  } else {
    res.writeHead(302, { Location: authorization_url });
    res.end();
  }
};

// ----------------------------------------------------------------------------------------------
// ---------------------------------------- Request data ----------------------------------------
// ----------------------------------------------------------------------------------------------

// ---------------------------------------- get/user/info ---------------------------------------

exports.userInfo = (req, res) => {
  try {
    const infoOptions = {
      headers: {
        Authorization: `Bearer ${req.session.token.access_token}`,
      },
    };
    const infoReq = https.request(
      "https://www.mycourseville.com/api/v1/public/get/user/info",
      infoOptions,
      (infoRes) => {
        let infoData = "";
        infoRes.on("data", (chunk) => {
          infoData += chunk;
        });
        infoRes.on("end", () => {
          const info = JSON.parse(infoData);
          res.send(info);
          res.end();
        });
      }
    );
    infoReq.on("error", (err) => {
      console.error(err);
    });
    infoReq.end();
  } catch (error) {
    console.log(error);
    console.log("Please logout, then login again.");
  }
};

// ---------------------------------------- get/user/courses ------------------------------------

exports.getCourses = (req, res) => {
  try {
    const coursesOptions = {
      headers: {
        Authorization: `Bearer ${req.session.token.access_token}`,
      },
    };
    const coursesReq = https.request(
      "https://www.mycourseville.com/api/v1/public/get/user/courses?detail=1",
      coursesOptions,
      (coursesRes) => {
        let coursesData = "";
        coursesRes.on("data", (chunk) => {
          coursesData += chunk;
        });
        coursesRes.on("end", () => {
          const courses = JSON.parse(coursesData);
          res.send(courses);
          res.end();
        });
      },
    );
    coursesReq.on("error", (error) => {
      console.error(error);
    });
    coursesReq.end();
  } catch (error) {
    console.log(error);
    console.log("Please logout, then login again.")
  }
};

// ---------------------------------- get/course/assignments ----------------------------

exports.getCourseAssignments = (req, res) => {
  const cv_cid = req.params.cv_cid;
  try {
    const assignmentsOptions = {
      headers: {
        Authorization: `Bearer ${req.session.token.access_token}`,
      },
    };
    const assignmentsReq = https.request(
      `https://www.mycourseville.com/api/v1/public/get/course/assignments?cv_cid=${cv_cid}&detail=1`,
      assignmentsOptions,
      (assignmentsRes) => {
        let assignmentsData = "";
        assignmentsRes.on("data", (chunk) => {
          assignmentsData += chunk;
        });
        assignmentsRes.on("end", () => {
          const assignments = JSON.parse(assignmentsData);
          res.send(assignments);
          res.end();
        });
      }
    );
    assignmentsReq.on("error", (error) => {
      console.error(error);
    })
    assignmentsReq.end();
  } catch (error) {
    console.error(error);
    console.log("Please logout, then login again.");
  }
};