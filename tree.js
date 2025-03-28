import mergeSort from "./mergeSort.js";

function Node(value, left = null, right = null) {
	return {
		value,
		left,
		right,
	};
}

class Tree {
	constructor(arr) {
		this.root = this.buildTree(mergeSort(arr));
	}

	buildTree(arr) {
		const q = [];
		let mid = Math.floor((arr.length - 1) / 2);
		let node = Node(arr[mid]);
		q.push({ node, range: [0, arr.length - 1] });
		for (let i = 0; i < arr.length; i++) {
			const [s, e] = [q[i].range[0], q[i].range[1]];
			mid = s + Math.floor((e - s) / 2);
			if (s < mid) {
				const lMid = s + Math.floor((mid - 1 - s) / 2);
				node = Node(arr[lMid]);
				q[i].node.left = node;
				q.push({ node, range: [s, mid - 1] });
			}
			if (e > mid) {
				const rMid = mid + 1 + Math.floor((e - mid - 1) / 2);
				node = Node(arr[rMid]);
				q[i].node.right = node;
				q.push({ node, range: [mid + 1, e] });
			}
		}
		return q[0].node;
	}

	levelOrder(fn) {
		const q = [this.root];
		for (let i = 0; i < q.length; i++) {
			if (q[i].left) q.push(q[i].left);
			if (q[i].right) q.push(q[i].right);
			fn(q[i]);
		}
	}

	find(value, s = "u") {
		let curRoot = this.root;
		let prev = null;
		while (1) {
			if (curRoot === null) {
				return null;
			}
			if (curRoot.value < value) {
				prev = curRoot;
				curRoot = curRoot.right;
			} else if (curRoot.value > value) {
				prev = curRoot;
				curRoot = curRoot.left;
			} else {
				break;
			}
		}
		return s === "u" ? curRoot : [prev, curRoot];
	}

	preOrder(fn) {
		if (this.root === null) return;
		const q = [this.root];
		for (let i = 0; i < q.length; i++) {
			fn(q[i]);
			if (q[i].left !== null) q.push(q[i].left);
			if (q[i].left !== null) q.push(q[i].left);
		}
	}

	insert(value) {
		let curNode = this.root;
		while (1) {
			if (curNode.value === value)
				throw new Error(`Value ${value} already exist`);
			if (curNode.value > value) {
				if (curNode.left) {
					curNode = curNode.left;
					continue;
				}
				const node = Node(value);
				curNode.left = node;
				break;
			}
			if (curNode.value < value) {
				if (curNode.right) {
					curNode = curNode.right;
					continue;
				}
				const node = Node(value);
				curNode.right = node;
				break;
			}
		}
	}

	delete(value) {
		const nodes = this.find(value, "two");
		if (!nodes[0] && nodes[1].right) return this.deleteRoot(nodes);
		let side;
		nodes[0].value > nodes[1].value ? (side = "left") : (side = "right");
		if (!nodes[1].right || !nodes[1].left) {
			if (!nodes[0]) {
				this.root = nodes[1].left;
				return;
			}
			nodes[1].right
				? (nodes[0][side] = nodes[1].right)
				: (nodes[0][side] = nodes[1].left);
			return;
		}
		this.deleteRoot(nodes, side);
	}

	deleteRoot = (nodes, side = "left") => {
		let smallest = nodes[1].right;
		while (1) {
			if (!smallest.left) break;
			smallest = smallest.left;
		}
		smallest = this.find(smallest.value, "");
		if (smallest[0] !== nodes[1]) {
			smallest[0].left = smallest[1].right;
			smallest[1].right = nodes[1].right;
		} else {
			smallest[0].right = nodes[1].right.right;
		}
		smallest[1].left = nodes[1].left;
		nodes[0] ? (nodes[0][side] = smallest[1]) : (this.root = smallest[1]);
	};

	depth(value = null, getArray = false) {
		const q = [{ node: this.root, height: 0 }];
		for (let i = 0; i < q.length; i++) {
			if (q[i].node.value === value) return q[i].height;
			if (q[i].node.left)
				q.push({ node: q[i].node.left, height: q[i].height + 1 });
			if (q[i].node.right)
				q.push({ node: q[i].node.right, height: q[i].height + 1 });
		}
		return getArray ? q : q.at(-1).height;
	}

	height(value = null) {
		const arr = this.depth(null, true);
		let height = 0;
		for (let i = 0; i < arr.length; i++) {
			if (value === arr[i].node.value) {
				height = arr[i].height;
				break;
			}
		}
		return (arr.at(-1).height - height);
	}
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
	if (node === null) {
		return;
	}
	if (node.right !== null) {
		prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
	}
	console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
	if (node.left !== null) {
		prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
	}
};

const arr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
const myTree = new Tree(arr);
console.log(myTree.height(5));
console.log(myTree.depth(5));
// myTree.delete(8);
// myTree.delete(9);
// myTree.delete(23);
// console.log(myTree.root);
// prettyPrint(myTree.root);
// myTree.preOrder((e) => console.log(e.value));
