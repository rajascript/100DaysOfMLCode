import * as tf from "@tensorflow/tfjs";
import * as ui from "./ui";

export async function urlExists(url) {
  ui.status("Testing url " + url);
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (err) {
    return false;
  }
}
export async function loadHostedPretrainedModel(url) {
  ui.status("Loading pretrained model from " + url);
  try {
    const model = await tf.loadModel(url);
    ui.status("Done loading pretrained model.");

    ui.disableLoadModelButtons();
    return model;
  } catch (err) {
    console.error(err);
    ui.status("Loading pretrained model failed.");
  }
}

export async function loadHostedMetadata(url) {
  ui.status("Loading metadata from " + url);
  try {
    const metadataJson = await fetch(url);
    const metadata = await metadataJson.json();
    ui.status("Done loading metadata.");
    return metadata;
  } catch (err) {
    console.error(err);
    ui.status("Loading metadata failed.");
  }
}
