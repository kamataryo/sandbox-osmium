const osmium = require("osmium");
const path = require("path");
const fs = require("fs");

const input = path.join(process.argv[2]);
const output = path.join(__dirname, "dist", "output.ndjson");

const fd = fs.openSync(output, "a");

const handler = new osmium.Handler();

let nodeCount = 0;
const tagCount = {};

handler.on("init", () => console.log("init!"));
handler.on("node", (node) => {
  nodeCount++;
  const nid = node.id;
  const geometry = node.geojson();
  const tags = node.tags();

  // stat
  Object.keys(tags).forEach((tag) => {
    if (tagCount[tag]) {
      tagCount[tag]++;
    } else {
      tagCount[tag] = 1;
    }
  });

  // eliminate non POI
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

const reader = new osmium.Reader(input);
osmium.apply(reader, handler);

fs.closeSync(fd);
console.log("done!");

// stats
console.log("Nodes count: " + nodeCount);
console.log("Tags Count:");
console.log(JSON.stringify(tagCount, null, 2));
const entries = Object.entries(tagCount);
entries.sort(([, count_a], [, count_b]) => count_b - count_a);
console.log(entries.map((entry) => entry.join(",")).join("\n"));
