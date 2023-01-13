import * as pulumi from "@pulumi/pulumi";
import * as docker from "@pulumi/docker";

const config = new pulumi.Config();
const imageName = config.require("imageName");

const image = new docker.RemoteImage("nginx", {
    name: imageName
});

let names: pulumi.Output<string>[] = [];

for(let i = 0; i < 5; i++) {
    const container = new docker.Container(`nginx${i}`, {
        image: image.repoDigest,
        ports: [{
           internal: 80,
           external: 8080 + i
        }]
     });

     names.push(container.name);
}

export const containerNames = names;