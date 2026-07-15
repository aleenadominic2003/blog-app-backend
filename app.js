const Express = require("express")
const Mongoose = require("mongoose")
const Bcrypt = require("bcrypt")
const Cors = require("cors")
const jwt = require("jsonwebtoken")
const userModel = require("./models/users")
const postModel = require("./models/posts")

let app = Express()

app.use(Express.json())
app.use(Cors())

Mongoose.connect("mongodb://aleena:aleena1234@ac-etp0lvq-shard-00-00.rb4mymb.mongodb.net:27017,ac-etp0lvq-shard-00-01.rb4mymb.mongodb.net:27017,ac-etp0lvq-shard-00-02.rb4mymb.mongodb.net:27017/blogappdb?ssl=true&replicaSet=atlas-mfk3xx-shard-0&authSource=admin&appName=Cluster0")

//create post
app.post("/create-post", async (req,res)=>{
    let input =req.body
    //token validation by passing it through body or header
    //standard format - input : through body, token : through header

    let token = req.headers.token
    jwt.verify(token, "blogApp", async (error, decoded)=>{
        if (decoded && decoded.email) {
            
            let result = new postModel(input)
            await result.save()
            res.json({"status":"success"})

        } else {
            res.json({"status":"Invalid Authentication"}) //if token is not correct 
        }

    }) // verify token
})
//api + input != data insertion
//api + correct input + token = data insertion & storing , token is only give to the user after login - for authentication & security of data



// VIEW ALL POST API - no input, token is the only input
app.post("/view-all-post", (req,res)=>{
    let token = req.headers.token //token inside headers - token is the only input here - only authenticated users can access all posts
    jwt.verify(token, "blogApp", (error,decoded)=>{
        if (decoded && decoded.email) {

            postModel.find().then(
                (items)=>{
                    res.json(items)
                }
            ).catch(
                (eeror)=>{
                    res.json({"status":"error"})
                }
            )
            
        } else {
            res.json({"status":"Invalid Authentication"})
        }
    })
    
})

//VIEW MY POST API - input : userId + token
app.post("/view-my-post", (req,res)=>{
    let input = req.body
    let token = req.headers.token 
    jwt.verify(token, "blogApp", (error,decoded)=>{
        if (decoded && decoded.email) {

            postModel.find(input).then(
                (items)=>{
                    res.json(items)
                }
            ).catch(
                (error)=>{
                    res.json({"status":error})
                }
            )
            
        } else {
            res.json({"status":"Invalid Authentication"})
        }
    })
    
})




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