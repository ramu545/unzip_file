const fs = require('fs');
const AWS = require('aws-sdk');
const formidable = require('formidable');
const unzip = require('unzip');
const request = require('request');
const resizeImgae = require('./resize_img');
const config = require('../config/config');

const spacesEndpoint = new AWS.Endpoint(config.DigitalOceanDEV.DigitalOceanEndpoint);
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: config.DigitalOceanDEV.DigitalOceanAccessKeyId,
    secretAccessKey: config.DigitalOceanDEV.DigitalOceanSecretAccessKey,
}); // configuring the s3 bucket

function uploadFileUnzip(req, res, next) {
    return new Promise(async (resolve, reject) => {
        const form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            // console.log('responce ', files);
            if (err) return res.status(500).json({ error: err });
            if (Object.keys(files).length === 0) {
                console.log(res.status(400).json({ message: "no files uploaded" }));
            }
            const filesInfo = Object.keys(files).map(async (key) => {
                const file = files[key];
                let outlet_Id = file.name.split('.').slice(0, -1).join('.');
                console.log('file name ', file.name);
                let stream_Data = fs.createReadStream(file.path);
                var params = { Bucket: config.DigitalOceanDEV.DigitalOceanBucket, Key: config.DoFolderName + '/' + outlet_Id + '/' + file.name, Body: stream_Data, ACL: 'public-read' };
                var options = { partSize: 10 * 1024 * 1024, queueSize: 1 };
                s3.upload(params, options, async function (err, data) {
                    if(err){
                        reject({errormessage:err});
                    }else{
                        await originalFile(data.Location, outlet_Id).then((respurl) => {
                            // console.log('responce url ', respurl);
                            resolve(respurl);
                        });
                    }
                });
            });
        })
    });
}

async function originalFile(filePath, outlet_Id) {
    return new Promise(async (resolve, reject) => {
        request(filePath)
            .pipe(unzip.Parse())
            .on('entry', async function (entry) {
                // console.log('Entry ', entry);
                let size = entry.size;
                let fileName = (entry.path).substring((entry.path).lastIndexOf('/') + 1);
                
                // await resizeImgae.imageAlter(entry, fileName, outlet_Id).then((urlValue) => {
                    //     console.log('responce from S3 Url ', urlValue);
                    //     resolve(urlValue);
                    // });

                const params = {
                    Bucket: config.DigitalOceanDEV.DigitalOceanBucket, // pass your bucket name
                    Key: config.DoFolderName + '/' + outlet_Id + '/' + config.DoOrginalImages + '/' + fileName,
                    Body: entry,
                    ACL: 'public-read'
                }; // configuring the parameters
                var options = { partSize: size, queueSize: 1 };
                s3.upload(params, options, async function (err, data) {
                    if(err){
                        reject({errormessage:err});
                    }else{
                        console.log('data location ',data.Location );
                        resolve(data.Location);
                    }
                });
            });

    });
}
module.exports = { uploadFileUnzip }