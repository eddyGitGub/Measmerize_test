const fs = require('fs')

function buildTree(nodes) {
  const nodesById = {};
  const roots = [];

  // First pass: build a hash table of nodes keyed by their ID,
  // and identify the root nodes.
  for (const node of nodes) {
    nodesById[node.nodeId] = { ...node, children: [] };
    if (!node.parentId) {
      roots.push(nodesById[node.nodeId]);
    }
  }
  // Second pass: attach child nodes to their parent nodes.
  for (const node of nodes) {
    const parent = nodesById[node.parentId];
    if (parent) {
      parent.children.splice(
        findIndexAfter(nodesById, parent.children, node.previousSiblingId),
        0,
        nodesById[node.nodeId]
      );
    }
  }
  
  for (const root of roots) {
    sortChildren(root);
  }
  return roots;
}

// Sort the children of each node recursively.
function sortChildren(node) {
  node.children.sort((a, b) => a.name.localeCompare(b.name));
  for (const child of node.children) {
    sortChildren(child);
  }
}
// Finds the index to insert a node after its previous sibling (or at the beginning if the sibling is null).
function findIndexAfter(nodesById, siblings, previousSiblingId) {
  if (previousSiblingId === null) {
    return 0;
  } else {
    const previousSibling = nodesById[previousSiblingId];
    const index = siblings.indexOf(previousSibling);
    return index === -1 ? siblings.length : index + 1;
  }
}

  const jsonFile = require("./input/nodes.json");
  
  const tree = buildTree(jsonFile);
  
fs.writeFile('./output/result.json', JSON.stringify(tree, null, 2), (err) => {
 if (err) throw err;
});
  console.log(JSON.stringify(tree, null, 2));
  