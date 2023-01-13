import { LocalProgramArgs, LocalWorkspace, OutputMap } from "@pulumi/pulumi/automation";
import * as upath from "upath";

let randomString = (Math.random() + 1).toString(36).substring(7);

const args: LocalProgramArgs = {
    stackName: `integration-test-${randomString}`,
    workDir: upath.joinSafe("..", "..", "Lab3", "result")
};

export async function deploy(): Promise<OutputMap> {
    
    const stack = await LocalWorkspace.createOrSelectStack(args);
    console.log(`deploying stack ${stack.name}`);
    
    // Konfiguration für den Stack setzen
    await stack.setConfig("azure-native:location", { value: "WestEurope" });

    const up = await stack.up({ onOutput: console.log });

    return up.outputs;
}

export async function destroy() {

    const stack = await LocalWorkspace.createOrSelectStack(args);
    console.log(`destroying stack ${stack.name}`);

    await stack.destroy({ onOutput: console.log });
    
    var ws = await LocalWorkspace.create(args);        
    await ws.removeStack(args.stackName);
}

export async function getOutputs(): Promise<OutputMap> {
    
    const stack = await LocalWorkspace.createOrSelectStack(args);

    var outputs = stack.outputs();

    return outputs;
}

export default { deploy, getOutputs, destroy };