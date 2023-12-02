import { v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME as string,
    api_key: process.env.NEXT_PUBLIC_API_KEY as string, 
    api_secret: process.env.NEXT_PUBLIC_API_SECRET as string 
});

export default cloudinary