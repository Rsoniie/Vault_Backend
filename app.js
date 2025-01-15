import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db_connection.js';
import User_routes from './routes/User_routes.js';
import File_routes from './routes/Pdf_routes.js';
import Feedback_routes from './routes/Feed_route.js';

const app = express();
app.use(express.json());
// app.use(cors())

app.use(cors({
    origin: '*'
}));
const PORT = 3000

// console.log("Thiese are all environment variagles", process.env.MONGODB_URI)
await connectDB();

app.get('/', (req, res) => {
    res.send("This app is running");
})


app.use('/user', User_routes);
app.use('/pdf', File_routes);
app.use('/feed', Feedback_routes);

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
})