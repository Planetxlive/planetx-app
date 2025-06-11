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

const s3Client = new S3Client({
  region: process.env.EXPO_PUBLIC_AWS_REGION || '',
  credentials: {
    accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
  },
});
const bucketName = process.env.EXPO_PUBLIC_AWS_BUCKET_NAME;

export async function uploadPropertyImages(imgAsset: ImagePickerAsset[]) : Promise<string[]> {
  try {
    let imageURLs: string[] = [];
    console.log(imgAsset)
    for (let i = 0; i < imgAsset.length; i++) {
      console.log(imgAsset[i])
      const fileExtension = imgAsset[i].fileName?.toLowerCase().split('.')[
        // imgAsset[i].fileName?.toLowerCase().split(".").length - 1
        (imgAsset[i].fileName?.toLowerCase().split('.').length || 2) - 1
      ];
      if (
        fileExtension === 'png' ||
        fileExtension === 'jpg' ||
        fileExtension === 'jpeg'
      ) {
        console.log(fileExtension)
        const data = await fs.readAsStringAsync(imgAsset[i].uri, {
          encoding: fs.EncodingType.Base64,
        });
        const arrayBuffer = Uint8Array.from(atob(data), c => c.charCodeAt(0));
        const uploadName = imgAsset[i].fileName
          ?.toLowerCase()
          .replaceAll(' ', '_');
        const uploadParams: PutObjectCommandInput = {
          Bucket: bucketName,
          Key: uploadName,
          Body: arrayBuffer,
          ContentType: `image/${fileExtension}`,
        };
        const res = await s3Client.send(new PutObjectCommand(uploadParams));
        console.log(res);
        const signedUrl = `https://${process.env.EXPO_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.EXPO_PUBLIC_AWS_REGION}.amazonaws.com/${imgAsset[i].fileName}`;
        // console.log(signedUrl);
        imageURLs.push(signedUrl);
      }
    }
    return imageURLs;
  } catch (error: any) {
    console.error('Error uploading Image:', error);
    return [];
  }
}
