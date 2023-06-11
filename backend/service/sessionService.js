
const checkSessionTTL = (req, res, next) => {
    if(!req.session.game) return res.status(401).json({ message: 'Session expired. Please start a new game.' });
    
    const ttl = req.session.cookie.maxAge;
    if(ttl <= 0){
        req.session.destroy((err) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } 
        })
    }else{
        req.session.cookie.maxAge = 60000 // 100 sek for testing purposes
    }
    next();
}


module.exports = {checkSessionTTL}