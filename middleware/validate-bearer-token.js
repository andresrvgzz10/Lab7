const APIKEY = "2abbf7c3-245b-404f-9473-ade729ed4653";

function validateApiKey(req,res,next)
{
    if (!req.headers.authorization)
    {
        res.statusMessage = "Unathorized Message. Please send the APIKEY"
        return res.status(401).end();      
    }

    if(req.headers.authorization !== `Bearer ${APIKEY}`){
        res.statusMessage = "Unathorized Request. Invalid APIKEY"
        return res.status(401).end();   
    }

    next();
    
}

module.exports = validateApiKey;
