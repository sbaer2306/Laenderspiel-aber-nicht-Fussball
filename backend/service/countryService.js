const axios = require('axios');

const options = {
    method: 'GET',
    url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/countries',
    params:{
        currencyCode: 'EUR',
        hateoasMode: 'true',
    },
    headers: {
        'X-RapidAPI-Key': '00e65e4bd9msh46628eee2602330p1480d2jsn2c9616ca8cca',
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
    }
}

async function fetchCountry(){//gameid als parameter?
    try{
        //logic to change which span of countries should be returned
        //options.params.currencyCode = ""; f.e.

        const response = await axios.get(options);
        console.log("Country Response:", response.data)
        return response.data;
    }catch(error){
        console.error('Fehler bei der GeoDB Cities Anfrage', error);
        throw error;
    }
}

module.exports = fetchCountry;


/*      

Game:
      properties:
        id:
          type: integer
          example: 1341251235
        user_id:
          type: integer
          example: 198374918
        current_round:
          type: integer
          example: 1
        max_rounds:
          type: integer
          example: 3
        ttl:
          type: integer
          format: int32
          description: "Time to live in seconds"
          example: 900
        created_at:
          type: string
          format: date-time
          example: "2023-06-02T16:00:00Z"
        difficulty:
          type: number
          format: float
        country_id:
          type: integer
          example: 10
        current_score:
          type: integer
          nullable: true
        total_score:
          type: integer
        
        */