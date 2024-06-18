const express = require('express');
const app = express();
const zod = require('zod')
const port = 3000
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const jwtPassword = "123456";
app.use(express.json())

const schema = zod.array(zod.number())
mongoose.connect('*******');
const User = mongoose.model('Users', { name: String, email: String, password: String })


app.post('/signUp', async function (req, res) {
    const name = req.body.name
    const username = req.body.username
    const password = req.body.password
    try {
        let userExist = await User.findOne({ email: username })
        if (userExist) {
            res.status(400).json({
                msg: "user already exist"
            })
            return;
        }
        const user = new User({
            name: name,
            email: username,
            password: password
        })

        user.save()
        res.json({
            msg: "successfuly saved"
        })
        return;
    } catch {
        res.status(500).json({
            msg: "somethin went wrong"
        })
        return;
    }

})

app.post('/signin', async function (req, res) {
    const username = req.body.username
    const password = req.body.password
    try {
        let isUserExist = await User.findOne({ email: username, password: password })
        if (!isUserExist) {
            res.status(403).json({
                msg: "user not exist"
            })
            return;
        }
        const token = jwt.sign({ username: username }, jwtPassword)
        res.json({ token });
        return;
    } catch (err) {
        res.status(500).json({
            msg: "some thing went wrong"
        })
        return;
    }



})

const USERS = [
    { name: "deepak", id: 432423 },
    { name: "deepak1", id: 432323 },
    { name: "deepak2", id: 437423 },
]

async function isUserExist(username, password) {
    let isExist = false;
    let user = await User.findOne({ email: username, password: password })
    if (user != null) {
        isExist = true;
    }
    return isExist;
}
app.get('/getUsers', function (req, res) {
    const authToken = req.headers.authorization
    try {
        const token = jwt.verify(authToken, jwtPassword)
        console.log("token")
        console.log(token)


        res.json({
            users: USERS.filter(user => user.name != token.username)
        })



    } catch {
        res.status(403).json({
            msg: "invalid user"
        })
    }
})








//  {
//     email : string == email,
//     password : string,
//     country : "IN" or "US"
//  }



// const userSchema = zod.object({
//     email : zod.string(),
//     password : zod.string(),
//     country: zod.literal('IN').or(zod.literal('US'))
// })



var users = [{
    name: "deepak",
    kidneys: [{ healthy: false }, { healthy: true }]
}]


function sum(n) {
    let ans = 0;
    for (let i = 1; i <= n; i++) {
        ans = ans + i;
    }
    return ans;
}



app.get('/', function (req, res) {
    let userKidneys = users[0].kidneys;
    let healthyKidneys = userKidneys.filter(kidney => kidney.healthy == true).length
    res.json({ userKidneys, healthyKidneys });
})


app.post('/saveKideneyStatus', function (req, res) {
    const isHealthy = req.body.isHealthy;
    users[0].kidneys.push({
        healthy: isHealthy
    })

    res.json({
        msg: "Done"
    })

})


app.put('/putHealthy', function (req, res) {

    for (let i = 0; i < users[0].kidneys.length; i++) {
        users[0].kidneys[i].healthy = true;
    }


    res.json({ msg: "done" })
})

let count = 0;
function calculate(req, res, next) {
    console.log("new", new Date().getTime())
    setTimeout(() => {
        let date1 = new Date()
        req.startDate = date1;
        console.log("date1", date1.getTime())
        next();
    }, 2000);

}


app.get('/health-checkup', function (req, res) {
    const kidneyId = req.query.kidneyId;
    const username = req.headers.username;
    const password = req.headers.password;

    if (username == "deepak" && password == "pass") {
        if (kidneyId == 1 || kidneyId == 2) {
            res.json({
                msg: "kidney is fine"
            })
        }
    }

    console.log(req.startDate.getTime())
    console.log(new Date().getTime())
    res.status(400).json({ msg: new Date() - req.startDate })
})




app.post('/checkup', function (req, res) {
    const kidneys = req.body.kidneys
    // const kidneysLength = kidneys.length;
    response = schema.safeParse(kidneys)
    // res.send("You have "+ kidneysLength + " kidneys")
    res.send(response)
})

app.use(function (err, req, res, next) {
    res.json({
        msg: "something went wrong"
    })
})

app.listen(port, () => {
    console.log(`listening on ${port}`)
});


