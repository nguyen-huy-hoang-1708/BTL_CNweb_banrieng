import app from './app';
import config from './config';
import { startNotificationService } from './services/notification.service';

const PORT = config.port;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    
    // Start notification service
    startNotificationService();
});


