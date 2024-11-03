import {
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  SASProtocol,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { fileName } = await req.json();

    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    const containerName = process.env.BLOB_CONTAINER_NAME;

    if (!accountName || !accountKey || !containerName) {
      throw new Error("Missing Azure Storage environment variables");
    }

    const sharedKeyCredential = new StorageSharedKeyCredential(
      accountName,
      accountKey
    );

    // Define expiry time (5 minutes)
    const expiryTime = new Date(new Date().valueOf() + 5 * 60 * 1000);

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName: fileName,
        permissions: BlobSASPermissions.parse("cw"), // 'c' for create, 'w' for write
        startsOn: new Date(), // Token is valid immediately
        expiresOn: expiryTime, // Token expires after 5 minutes
        protocol: SASProtocol.Https, // Secure HTTPS protocol
      },
      sharedKeyCredential
    ).toString();

    return NextResponse.json(
      {
        success: true,
        sasToken: `?${sasToken}`,
        uploadUrl: `https://${accountName}.blob.core.windows.net/${containerName}/${fileName}?${sasToken}`,
        message: "Successfully authorized blob upload",
      },
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
