import AWS from "aws-sdk";
import { v4 as uuid } from "uuid";

AWS.config.update({
    region: "ap-south-1",
    accessKey: "AKIAX7RF22LFG3IJVBIF",
    secretKey: "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",
});

const s3 = new AWS.S3({
    region: "ap-south-1",
    credentials: {
        accessKeyId: "AKIAX7RF22LFG3IJVBIF",
        secretAccessKey: "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",
    },
    signatureVersion: "v4",
});

export default async function handler(req, res) {
    const key = uuid() + ".pdf";
    const expireTime = 60 * 4;

    const url = await s3.getSignedUrlPromise("putObject", {
        Bucket: "cipteststorage",
        Key: key,
        Expires: expireTime,
        ContentType: "application/pdf",
        ACL: "public-read",
    });

    res.json({ url, key });
}
