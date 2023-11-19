import 'dotenv/config'
import OpenAI from 'openai';
import nodeFetch from "node-fetch";
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const openai = new OpenAI({
    apiKey: hide,
});

const app = express();
app.use(express.json());

const corsOptions = {
    origin: 'http://127.0.0.1:5501',
    credentials: true,
};

app.use(cors(corsOptions));

const system_message = "You are a travel planning assistant, your job is to find a destination in Japan for Adventure Seeking user.\
Based on the user's input: (Adventure Seeker, Cultural Explorer, Family-Friendly Travller, Urban Experience, Relaxation and Wellness), \
provide comment on the input of the user and allow user to choose one among the following options:\
Extreme Sport, Water Adventure, Mountain Exploration, Nature Exploration, Winter Sport, Others (Please specify).\
Then, ask which one activity would the user want among the following options:\
Skiing, Ice Skating, Bungee Jumping, Skydiving, Others (Please specify).\
Finally, based on the user input, give the user the recommendation of destination.";

app.post('/getAnswer', async (req, res) => {
  try {
    const userInput = req.body.userInput;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "system", "content": system_message},
        {"role": "user", "content": `${userInput}`},
      ],
      temperature: 0.6,
    });

    res.setHeader('Content-Type', 'application/json');
    res.json({ answer: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(5501, () => {
 console.log('http://localhost:5501/getAnswer');
});


/*app.get('/getRecommend', async (req, res) => {
    try {
    const userInputHistory = req.body.userInputHistory;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "system", "content": system_message2},
        {"role": "user", "content": userInputHistory},
      ],
    });

    console.log(userInputHistory)
    res.setHeader('Content-Type', 'application/json');
    res.json({ answer: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); */
