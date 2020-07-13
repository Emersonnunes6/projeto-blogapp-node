if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI:"mongodb+srv://emerson6:emersonnunes@blogapp-prod.debyz.mongodb.net/blogapp-prod?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}