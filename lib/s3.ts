import 'react-native-get-random-values';
import {
  S3Client,
  PutObjectCommand,
  PutObjectAclCommandInput,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import * as fs from 'expo-file-system';
import { ImagePickerAsset } from 'expo-image-picker';
import { Buffer } from 'buffer';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET_NAME } from './uri';

const s3Client = new S3Client({
  region: AWS_REGION || '',
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID || '',
    secretAccessKey: AWS_SECRET_ACCESS_KEY || '',
  },
});
const bucketName = AWS_BUCKET_NAME;

export async function uploadPropertyImages(imgAsset: ImagePickerAsset[]): Promise<string[]> {
  try {
    let imageURLs: string[] = [];
    
    if (!imgAsset || imgAsset.length === 0) {
      console.warn('No images provided for upload');
      return [];
    }

    for (let i = 0; i < imgAsset.length; i++) {
      const asset = imgAsset[i];
      
      if (!asset || !asset.uri) {
        console.warn(`Invalid image asset at index ${i}`);
        continue;
      }

      try {
        // Get file extension
        const fileName = asset.fileName?.toLowerCase() || '';
        const fileExtension = fileName.split('.').pop();
        
        if (!fileExtension || !['png', 'jpg', 'jpeg'].includes(fileExtension)) {
          console.warn(`Unsupported file type for image at index ${i}: ${fileExtension}`);
          continue;
        }

        // Read file as base64
        const fileInfo = await fs.getInfoAsync(asset.uri);
        if (!fileInfo.exists) {
          console.warn(`File does not exist at ${asset.uri}`);
          continue;
        }

        const data = await fs.readAsStringAsync(asset.uri, {
          encoding: fs.EncodingType.Base64,
        });

        if (!data) {
          console.warn(`Failed to read image data at index ${i}`);
          continue;
        }

        // Convert base64 to buffer
        const arrayBuffer = Uint8Array.from(atob(data), c => c.charCodeAt(0));
        
        // Generate upload name
        const uploadName = fileName.replaceAll(' ', '_');
        
        // Upload to S3
        const uploadParams: PutObjectCommandInput = {
          Bucket: bucketName,
          Key: uploadName,
          Body: arrayBuffer,
          ContentType: `image/${fileExtension}`,
        };

        await s3Client.send(new PutObjectCommand(uploadParams));
        
        // Generate and store URL
        const signedUrl = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${uploadName}`;
        imageURLs.push(signedUrl);
        
      } catch (error) {
        console.error(`Error processing image at index ${i}:`, error);
        // Continue with next image instead of failing completely
        continue;
      }
    }

    return imageURLs;
  } catch (error: any) {
    console.error('Error in uploadPropertyImages:', error);
    return [];
  }
}
