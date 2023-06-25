import cors from 'cors';
import express from 'express';

const app = express();
const PORT = 5000;

const Tweets = [];
const Logado = [];

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});


function getTweets(user) {
    return Tweets.filter(tweet => tweet.username == user);
}

function avatar(userFind) {
    return Logado.find(user => user.username == userFind).avatar;
}



app.get('/tweets', (req, res) => {

    const page = parseInt(req.query.page);

    if (Tweets.length == 0) {
        res.status(200).send([]);
        return;
    }

    if (page && page <= 0) {
        res.status(400).send('Página não é valida. Favor informar nova.');
    }
    else {

        if (page === 1) {
            

            if (Tweets.length <= 10) {
                const finalResponse = [...Tweets].reverse();
                finalResponse.forEach(tweet => {
                    tweet.avatar = avatar(tweet.username);
                });
                res.status(200).send(finalResponse);
               
            }
            else {
                const finalResponse = [...Tweets].reverse().slice(0, 9);
                finalResponse.forEach(tweet => {
                    tweet.avatar = avatar(tweet.username);
                });
                res.status(200).send(finalResponse);
             
            }
        }
        else {
            if (Tweets.length == 0) {
                res.status(200).send([]);
            }
            else {
                let startSlice = page ? (page - 1) * 10 : 0;
                let endSlice = startSlice + 10;

                if (startSlice > Tweets.length) {
                    res.status(200).send([]);
                    return;
                }

                if (endSlice > Tweets.length) {
                    endSlice = Tweets.length;
                }

                

                const finalResponse = Tweets.slice(startSlice, endSlice).reverse();
                finalResponse.forEach(tweet => {
                    tweet.avatar = avatar(tweet.username);
                });

                res.status(200).send(finalResponse);
            }
        }
    }
});



app.get('/tweets/:id', (req, res) => {

    console.log(`User ${req.params.id} requested all of his tweets`);
    const response = getTweets(req.params.id);
    res.send(response);
});



app.post('/sign-up', (req, res) => {
    if (Logado.find(user => user.username == req.body.username) == undefined) {
        if (req.body.username == "" || req.body.username == undefined || req.body == undefined || req.body.avatar == "" || req.body.avatar == undefined || typeof req.body.avatar != 'string' || typeof req.body.username != 'string') {
            res.status(400).send('Favor preencher os campos brigatórios!')
        }
        else {
            Logado.push(req.body);
            res.status(201).send('OK');
        }
    }
    else {
        res.status(401).send('UNAUTHORIZED');
    }
});



app.post('/tweets', (req, res) => {

    if (!req.body || !req.body.tweet || req.body.tweet == '' || !isNaN(req.body.tweet)) {
        res.sendStatus(400);
        return;
    }

    const newTweet = req.body;
    const tweetFrom = req.headers.user;

    if (Logado.find(user => user.username == tweetFrom) == undefined) {
        res.status(401).send('UNAUTHORIZED');
    }
    else {
        Tweets.push({ username: tweetFrom, tweet: newTweet.tweet });
        res.status(201).send('OK');
    }
});