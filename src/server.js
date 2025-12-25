import express from 'express';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';

const app = express();
const PORT = process.env.PORT || 5003 //default is 5000

// get file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url);
//get directory name from file path
const __dirname = dirname(__filename);

//serves the HTML file from the public directory
app.use(express.static(path.join(__dirname, '../public'))); // where to find the ublicdirectory
app.use(express.json());

//serving up the HTML file from the public directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

//ROUTES
app.use('/auth', authRoutes);
app.use('/todos',authMiddleware, todoRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});