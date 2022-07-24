import app from './app.js';
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config();

const PORT = +process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(chalk.bold.green(`Listening on ${PORT}`));
});