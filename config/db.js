if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI:"mongodb+srv://emersonnunes6:<password>@blogapp-prod.debyz.mongodb.net/test"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}