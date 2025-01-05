
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db_connection.js';
import User_routes from './routes/User_routes.js';
import File_routes from './routes/Pdf_routes.js';


const app = express();
app.use(express.json());
app.use(cors())
const PORT = 3000

await connectDB();

app.get('/', (req, res) => {
    res.send("This app is running");
})


app.use('/user', User_routes);
app.use('/pdf', File_routes);

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
})