export class SquarePyramid {
    constructor(gl, options = {}) {
        this.gl = gl;

        this.vao = gl.createVertexArray();
        this.vbo = gl.createBuffer();
        this.ebo = gl.createBuffer();

        this.vertices = new Float32Array([
            // 0, 1, 2 (좌측면)
            0, 1, 0,   -0.5, 0, -0.5,   -0.5, 0, 0.5,
            // 0, 2, 3 (정면)
            0, 1, 0,   -0.5, 0, 0.5,   0.5, 0, 0.5,
            // 0, 3, 4 (우측면)
            0, 1, 0,   0.5, 0, 0.5,   0.5, 0, -0.5,
            // 0, 4, 1 (후면)
            0, 1, 0,   0.5, 0, -0.5,   -0.5, 0, -0.5,
            // 1, 4, 3, 2 (하단)
            -0.5, 0, -0.5,   0.5, 0, -0.5,   0.5, 0, 0.5,   -0.5, 0, 0.5
        ])

        this.normals = new Float32Array([
            // 0, 1, 2 (좌측면)
            -1, 0, 0,   -1, 0, 0,   -1, 0, 0,   -1, 0, 0,
            // 0, 2, 3 (정면)
            0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
            // 0, 3, 4 (우측면)
            1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
            // 0, 4, 1 (후면)
            0, 0, -1,   0, 0, -1,   0, 0, -1,   0, 0, -1,
            // 1, 4, 3, 2 (하단)
            0, -1, 0,   0, -1, 0,   0, -1, 0,   0, -1, 0,
        ]);


        this.colors = new Float32Array([
            // 0, 1, 2 (좌측면) - yellow
            1, 1, 0, 1,   1, 1, 0, 1,   1, 1, 0, 1,
            // 0, 2, 3 (정면) - pink
            1, 0, 1, 1,   1, 0, 1, 1,   1, 0, 1, 1,
            // 0, 3, 4 (우측면) - skyblue
            0, 1, 1, 1,   0, 1, 1, 1,   0, 1, 1, 1,
            // 0, 4, 1 (후면) - red
            1, 0, 0, 1,   1, 0, 0, 1,   1, 0, 0, 1,
            // 1, 4, 3, 2 (하단) - black
            1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,  1, 1, 1, 1
        ]);

        this.texCoords = new Float32Array([
            // 0, 1, 2 (좌측면)
            0.5, 1,   0, 0,   0.25, 0,
            // 0, 2, 3 (정면)
            0.5, 1,   0.25, 0,   0.5, 0,
            // 0, 3, 4 (우측면)
            0.5, 1,   0.5, 0,   0.75, 0,
            // 0, 4, 1 (후면)
            0.5, 1,   0.75, 0,   1, 0,
            // 1, 4, 3, 3, 1, 2
            0, 1,   1, 1,   1, 0,   0, 0
        ]);

        this.indices = new Uint16Array([
            0, 1, 2,
            3, 4, 5,
            6, 7, 8,
            9, 10, 11,
            12, 13, 14,
            14, 15, 12
        ]);

        this.initBuffers();
    }

    initBuffers() {
        const gl = this.gl;

        // 버퍼 크기 계산
        const vSize = this.vertices.byteLength;
        const nSize = this.normals.byteLength;
        const cSize = this.colors.byteLength;
        const tSize = this.texCoords.byteLength;
        const totalSize = vSize + nSize + cSize + tSize;

        gl.bindVertexArray(this.vao);

        // VBO에 데이터 복사
        // gl.bufferSubData(target, offset, data): target buffer의 
        //     offset 위치부터 data를 copy (즉, data를 buffer의 일부에만 copy)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, totalSize, gl.STATIC_DRAW);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);
        gl.bufferSubData(gl.ARRAY_BUFFER, vSize, this.normals);
        gl.bufferSubData(gl.ARRAY_BUFFER, vSize + nSize, this.colors);
        gl.bufferSubData(gl.ARRAY_BUFFER, vSize + nSize + cSize, this.texCoords);

        // EBO에 인덱스 데이터 복사
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        // vertex attributes 설정
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);  // position
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, vSize);  // normal
        gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 0, vSize + nSize);  // color
        gl.vertexAttribPointer(3, 2, gl.FLOAT, false, 0, vSize + nSize + cSize);  // texCoord

        // vertex attributes 활성화
        gl.enableVertexAttribArray(0);
        gl.enableVertexAttribArray(1);
        gl.enableVertexAttribArray(2);
        gl.enableVertexAttribArray(3);

        // 버퍼 바인딩 해제
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
    }

    draw(shader) {

        const gl = this.gl;
        shader.use();
        gl.bindVertexArray(this.vao);
        gl.drawElements(gl.TRIANGLES, 18, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
    }

    delete() {
        const gl = this.gl;
        gl.deleteBuffer(this.vbo);
        gl.deleteBuffer(this.ebo);
        gl.deleteVertexArray(this.vao);
    }
}