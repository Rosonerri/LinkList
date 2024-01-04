class Nodes {
  public val: number;
  public next: Nodes | null | any;

  constructor(val: number) {
    this.val = val;
    this.next = null;
  }
}

class LinkList {
  public head: Nodes | null | any;
  public tail: Nodes | null | any;
  public length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  // push
  addTail(val: number) {
    let node = new Nodes(val);

    if (!this.head) {
      this.head = node;
      this.tail = this.head;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.length++;
    return this;
  }

  // unshift
  addHead(val: number) {
    let node = new Nodes(val);
    if (!this.head) {
      this.head = node;
      this.tail = null;
    } else {
      this.head = node;
      node.next = this.head;
    }

    this.length++;
    return this;
  }

  // pop
  removeTail() {
    if (!this.head) {
      return undefined;
    } else {
      let current = this.tail;
      let nextTail = current;

      while (current.next) {
        this.tail = nextTail;
        this.tail.next = null;
      }
      this.length--;
      return current;
    }
  }

  // shift
  removeHead() {
    if (!this.head) {
      return undefined;
    } else {
      let current = this.head;
      let newHead = current;

      while (current.next) {
        this.head = newHead;
        this.head.next = null;
      }
      this.length--;
      return current;
    }
  }

  get(index: number) {
    if (index < 0 || index >= this.length) {
      return "Out of Range";
    } else {
      let count: number = 0;
      let current = this.head;

      while (count !== index) {
        current = current.next;
        count++;
      }

      return current;
    }
  }

  set(index: number, val: number) {
    let node = this.get(index);

    if (node) {
      node.val = val;
      return true;
    } else {
      return false;
    }
  }

  insert(index: number, val: number) {
    let node = new Nodes(val);

    if (index < 0 || index > this.length) return "Out of Range";
    if (index === 0) return !!this.addHead(val);
    if (index === this.length) return !!this.addTail(val);

    let prev = this.get(index - 1);
    let temp = prev.next;

    prev.next = node;
    node.next = temp;

    this.length++;
    return true;
  }

  remove(index: number) {
    if (index < 0 || index > this.length) return "Out of Range";
    if (index === 0) return !!this.removeHead();
    if (index === this.length) return !!this.removeTail();

    let prev = this.get(index - 1);
    let temp = prev.next;

    prev.next = temp.next;

    this.length--;
    return temp;
  }
}

let linkList = new LinkList();

linkList.addTail(90);
linkList.addTail(3);
linkList.addTail(31);
linkList.addTail(4);
linkList.addTail(9);

console.clear();
// console.log("Nodes removed from the List: ", linkList.removeHead());
// console.log("total Nodes in the List:", linkList.length);
// console.log("get Nodes by Position in the List:", linkList.get(0));

// console.log("get Nodes by Position in the List:");
// console.log(linkList.set(0, 25));
console.log(linkList.remove(1));

console.log("total Nodes in the List:", linkList.length);
console.log("viewing Nodes in the List:", linkList);
// console.log("get Nodes by Position in the List:", linkList.get(0));
