const osmium = require('osmium')
const path = require('path')
const filePath = path.join(__dirname, 'data', 'japan-latest.osm.pbf')

const handler = new osmium.Handler()

let nodes = 0
let ways = 0
let relations = 0

handler.on('init', () => console.log('init!'))
handler.on('done', () => console.log('done'))
handler.on('node', node => {
  nodes++
  nodes % 1000 === 0 && console.log(`${nodes / 1000}k nodes`)
})

const reader = new osmium.Reader(filePath)
osmium.apply(reader, handler)

console.log('Nodes: ' + nodes)
console.log('Ways: ' + ways)
console.log('Relations: ' + relations)
