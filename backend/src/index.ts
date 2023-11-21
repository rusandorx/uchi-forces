import app from './server';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.SERVER_PORT ?? 3001;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})
