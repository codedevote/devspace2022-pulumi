import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";
import { enums } from "@pulumi/azure-native/types";

const projectName = pulumi.getProject();
const stackName = pulumi.getStack();

// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup(`${stackName}-${projectName}`);

// Create an Azure resource (Storage Account)
const storageAccount = new storage.StorageAccount("sa", {
    resourceGroupName: resourceGroup.name,
    sku: {
        name: storage.SkuName.Standard_LRS,
    },
    kind: storage.Kind.StorageV2,
    allowBlobPublicAccess: true
});

const storageContainer = new storage.BlobContainer("content", {
    accountName: storageAccount.name,
    publicAccess: enums.storage.PublicAccess.Container,
    resourceGroupName: resourceGroup.name,
    containerName: pulumi.interpolate `${storageAccount.name}-content`
});

const website = new storage.Blob("website", {
    resourceGroupName: resourceGroup.name,
    containerName: storageContainer.name,
    accountName: storageAccount.name,
    type: storage.BlobType.Block,
    blobName: "index.html",
    contentType: "text/html",
    source: new pulumi.asset.FileAsset("index.html")
});

export const websiteUrl = website.url;