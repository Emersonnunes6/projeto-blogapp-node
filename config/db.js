if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI:"mongodb+srv://emersonnunes6:emersonnunes123@blogapp-prod.debyz.mongodb.net/blogapp-prod?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}