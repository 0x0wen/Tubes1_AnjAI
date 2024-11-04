import * as THREE from "three";

export default class MagicCube {
  constructor() {
    this.cubes = [];
    this.WholeCube = new THREE.Group();
    this.WholeCube.name = "DMCube";
  }

  getCubesLevel(level) {
    return this.cubes.filter((cube) => cube.position.y === level);
  }

  getCubesRow(row) {
    return this.cubes.filter((cube) => cube.position.z === row);
  }

  getCubesColumn(column) {
    return this.cubes.filter((cube) => cube.position.x === column);
  }

  getCube(x, y, z) {
    return this.cubes.find(
      (cube) =>
        cube.position.x === x && cube.position.y === y && cube.position.z === z
    );
  }

  getWholeCube() {
    return this.WholeCube;
  }

  getOne3Cube(number) {
    return this.WholeCube.getObjectByName(number);
  }

  createNumberedMaterial(number, color) {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");

    if (context) {
      context.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
      context.fillRect(0, 0, size, size);

      context.fillStyle = "#000000";
      context.font = "bold 100px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(number.toString(), size / 2, size / 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.MeshBasicMaterial({ map: texture });
  }

  createNumberedMaterials(number) {
    return [
      this.createNumberedMaterial(number, 0xff0000),
      this.createNumberedMaterial(number, 0x00ff00),
      this.createNumberedMaterial(number, 0x0000ff),
      this.createNumberedMaterial(number, 0xffff00),
      this.createNumberedMaterial(number, 0xff00ff),
      this.createNumberedMaterial(number, 0x00ffff),
    ];
  }

  createCube(x, y, z, number) {
    const geometry = new THREE.BoxGeometry(4, 4, 4);
    const cube = new THREE.Mesh(geometry, this.createNumberedMaterials(number));
    cube.name = number;
    cube.position.set(x, y, z);
    this.WholeCube.add(cube);
  }

  shuffleNumbers() {
    const numbers = Array.from({ length: 125 }, (_, i) => i + 1);

    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    return numbers;
  }

  generateCube() {
    const numbers = this.shuffleNumbers();
    let index = 0;

    let gap = 4.05;

    for (let y = 0; y < 5; y++) {
      let level = [];
      for (let z = 0; z < 5; z++) {
        let row = [];
        for (let x = 0; x < 5; x++) {
          const number = numbers[index++];
          this.createCube(x * gap, y * gap, z * gap, number);

          row.push(number);
        }
        level.push(row);
      }
      this.cubes.push(level);
    } 

    this.WholeCube.position.set(-8, -8, -8);

    // console.log(this.cubes);

  }

  visibleOnlyOneLevel(level) {
    level = level - 1;
    this.WholeCube.children.forEach((cube) => {
      cube.visible = cube.position.y === level * 4.05;
    });
  }

  allVisible() {
    this.WholeCube.children.forEach((cube) => {
      cube.visible = true;
    });
  }

  reshuffleCube() {
    this.WholeCube.clear();

    this.cubes = [];
    this.generateCube();
  }


  showXYZ(){
    this.cubes.forEach((level) => {
      level.forEach((row) => {
        row.forEach((number) => {
          let cube = this.getOne3Cube(number);
          let cubePos = cube.position;
          console.log(`x: ${cubePos.x}, y: ${cubePos.y}, z: ${cubePos.z}, number: ${number}`);
        });
      });
    });
  }

  switchCube(number1, number2){
    let cube1 = this.getOne3Cube(number1);
    let cube2 = this.getOne3Cube(number2);
    let cube1Pos = cube1.position;
    let cube2Pos = cube2.position;
    cube1.position.set(cube2Pos.x, cube2Pos.y, cube2Pos.z);
    cube2.position.set(cube1Pos.x, cube1Pos.y, cube1Pos.z);

    this.cubes[cube1Pos.y/4.05][cube1Pos.z/4.05][cube1Pos.x/4.05] = number2;
    this.cubes[cube2Pos.y/4.05][cube2Pos.z/4.05][cube2Pos.x/4.05] = number1;

  }
}
