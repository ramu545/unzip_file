const sharp = require('sharp');
const AWS = require('aws-sdk');
const config = require('../config/config');
const finWidth = 800;
const finHeight = 600;

const spacesEndpoint = new AWS.Endpoint(config.DigitalOceanDEV.DigitalOceanEndpoint);
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: config.DigitalOceanDEV.DigitalOceanAccessKeyId,
    secretAccessKey: config.DigitalOceanDEV.DigitalOceanSecretAccessKey
}); // configuring the s3 bucket

function upload_to_S3(buffer, fname, outlet_Id) {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: config.DigitalOceanDEV.DigitalOceanBucket, // pass your bucket name
            Key: config.DoFolderName+'/'+outlet_Id+'/'+config.DoResizeImages+'/'+fname,
            Body: buffer,
            ACL: 'public-read'
        }; // configuring the parameters
        s3.upload(params, async function (s3Err, data) {
            if (s3Err) {
                reject({message:"Missing Parameters"});
                console.log('s3 error ');
            } else {
                // console.log(`File uploaded successfully at ${data.Location}`);
                resolve(data.Location);
            }
        }); // uploading and get responce from s3 bucket
    })
}

async function imageAlter(entry, fileName, outlet_Id) {
    return new Promise(async (resolve, reject) => {
        if (!entry) {
            reject({ message: "Stream Data Not Avilable", name: "Not Found" });
        } else {
            var sfileName = fileName.substring(fileName.lastIndexOf('/') + 1);
            const resizeimg = sharp(entry).resize(finWidth, finHeight);
            await upload_to_S3(resizeimg, sfileName, outlet_Id).then((val)=>{
                resolve(val);
            });
        }
    })
} // alter images uploading in to s3 bucket
module.exports = { imageAlter }
