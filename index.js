const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api/jokes/random", async (req, res) => {
  try {
    const response = await axios({
      method: "get",
      url: `https://api.api-ninjas.com/v1/jokes`,
      headers: {
        "X-Api-Key": process.env.API_KEY,
        "Content-Type": "application/json",
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error(
      "Error details:",
      err.response ? err.response.data : err.message
    );
    res.status(500).json({
      error: "An error occurred while fetching jokes",
      details: err.response ? err.response.data : err.message,
    });
  }
});

app.get("/api/images/random", async (req, res) => {
  try {
    const response = await axios({
      method: "get",
      url: `https://api.unsplash.com/search/photos?page=1&query=nature&client_id=${process.env.UNSPLASH_API_KEY}`,
      headers: {
        'Accept': 'application/json'
      }
    });

    const imageUrls = response.data.results.map(image => ({
      id: image.id,
      url: image.urls.regular, 
    }));

    res.json(imageUrls); 

  } catch (err) {
    console.error("Error details:", err.message);
    res.status(500).json({
      error: "An error occurred while fetching images",
    });
  }
});

app.get("/api/joke-image/random",async(req,res)=>{
   try{
     const [jokeResponse , imageResponse] = await Promise.all([
       axios({
        method: "get",
        url: `https://api.api-ninjas.com/v1/jokes`,
        headers: {
          "X-Api-Key": process.env.API_KEY,
          "Content-Type": "application/json",
        },
       }),
       axios({
        method: "get",
        url: `https://api.unsplash.com/search/photos?page=1&query=nature&client_id=${process.env.UNSPLASH_API_KEY}`,
        headers: {
          'Accept': 'application/json'
        }
       })
     ])

     const joke = jokeResponse.data; // first resolve joke api
     const imageUrls = imageResponse.data.results.map(image=>({  // second resolve image api
       id : image.id,
       url : image.urls.regular
     }))
      
     //combine both in single result
     const result = {
       joke,
       images:imageUrls
     }
     
     // sending result 
     res.json(result)
   }catch(err){
    console.error("Error details:", err.message);
    res.status(500).json({
      error: "An error occurred while fetching images",
    });
   }
})

app.listen(port, () => {
  console.log("server started at " + port);
});