
const checkSessionTTL = (req, res, next) => {
    if(req.session.game){
        const ttl = req.session.cookie.maxAge;
        if(ttl <= 0){
            req.session.destroy((err) => {
                if(err){
                    res.status(500).json({error: err.message});
                }
            })
        }else{
            req.session.cookie.maxAge = 6000 // 10 sek for testing purposes
        }
    }
    next();
}


module.exports = {checkSessionTTL}