const osmium = require("osmium");
const path = require("path");
const filePath = path.join(__dirname, "data", "japan-latest.osm.pbf");
const fs = require("fs");
const handler = new osmium.Handler();

const output = path.join(__dirname, "dist", "output.ndjson");
try {
  fs.unlinkSync(output);
} catch (error) {
  // delete if exists
}
const fd = fs.openSync(output, "a");

let nodeCount = 0;
const tagCount = {};
handler.on("init", () => console.log("init!"));
handler.on("node", (node) => {
  nodeCount++;
  const nid = node.id;
  const geometry = node.geojson();
  const tags = node.tags();

  Object.keys(tags).forEach((tag) => {
    if (tagCount[tag]) {
      tagCount[tag]++;
    } else {
      tagCount[tag] = 1;
    }
  });

  if (Object.keys(tags).length === 0) {
    return;
  } else {
    const feature = {
      type: "Feature",
      properties: { nid: nid, ...tags },
      geometry: geometry,
    };
    fs.appendFileSync(fd, JSON.stringify(feature) + "\n", "utf8");
  }
});

const reader = new osmium.Reader(filePath);
osmium.apply(reader, handler);

fs.closeSync(fd);
console.log("done!");
console.log("Nodes count: " + nodeCount);
console.log("Tags Count:");
console.log(JSON.stringify(tagCount, null, 2));
