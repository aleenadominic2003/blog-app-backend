const Express = require("express")
const Mongoose = require("mongoose")
const Bcrypt = require("bcrypt")
const Cors = require("cors")
const jwt = require("jsonwebtoken")
const userModel = require("./models/users")

let app = Express()

app.use(Express.json())
app.use(Cors())

Mongoose.connect("mongodb://aleena:aleena1234@ac-etp0lvq-shard-00-00.rb4mymb.mongodb.net:27017,ac-etp0lvq-shard-00-01.rb4mymb.mongodb.net:27017,ac-etp0lvq-shard-00-02.rb4mymb.mongodb.net:27017/blogappdb?ssl=true&replicaSet=atlas-mfk3xx-shard-0&authSource=admin&appName=Cluster0")

//sign in

app.post("/signIn",async(req,res)=>{

    let input=req.body
    let result=userModel.find({email:req.body.email}).then(
        (items)=>{
            if (items.length>0) {

                const passwordValidator=Bcrypt.compareSync(req.body.password,items[0].password)
                if (passwordValidator) {
                    
                    //pass token
                    jwt.sign({email:req.body.email},"blogApp",{expiresIn:"1d"},
                        (error,token)=>{

                            if (error) {
                                res.json({"status":"error","errorMessage":error})
                            } else {
                                res.json({"status":"success","token":token,"userId":items[0]._id})
                            }

                    })

                } else {
                    res.json({"status":"invalid password"})
                }
            } else {
                res.json({"status":"invalid email id"})
            }
        }
    ).catch()

})

//signup
app.post("/signup", async (req, res) => {

    let input = req.body
    let hashedPassword = Bcrypt.hashSync(req.body.password, 10)
    console.log(hashedPassword)
    req.body.password = hashedPassword


    //validating mail
    userModel.find({ email: req.body.email }).then(
        (items) => {

            if (items.length > 0) {
                res.json({ "status": "email already exists" })
            }
            else {
                let result = new userModel(input)
                result.save()
                res.json({ "satus": "success" })
            }

        }
    ).catch(
        (error) => { }
    )





})

app.listen(3030, () => {
    console.log("server started")
})