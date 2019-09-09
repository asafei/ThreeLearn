class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    setX(x) {
        this.x = x;
        return this;
    }

    setY(y) {
        this.y = y;
        return this;
    }

    setZ(z) {
        this.z = z;
        return this;
    }

    /**
     * 将x、y、z的值设置为标量scalar
     * @param scalar 要设置的标量值
     */
    setScalar(scalar) {
        this.x = scalar;
        this.y = scalar;
        this.z = scalar;
        return this;
    }

    /**
     * 将x、y、z的值分别加上标量scalar
     * @param scalar
     * @returns {Vector3}
     */
    addScalar(scalar) {
        this.x += scalar;
        this.y += scalar;
        this.z += scalar;
        return this;
    }

    /**
     * 设置某一所引出的数值
     * @param index
     * @param value
     * @returns {Vector3}
     */
    setComponent(index, value) {
        switch (index) {
            case 0:
                this.x = value;
                break;
            case 1:
                this.y = value;
                break;
            case 2:
                this.z = value;
                break;
            default:
                throw new Error('index is out of range:' + index);
        }
        return this;
    }

    /**
     * 获取某一索引处的数值
     * @param index
     * @returns {number}
     */
    getComponent(index) {
        switch (index) {
            case 0:
                return this.x;
            case 1:
                return this.y;
            case 2:
                return this.z;
            default:
                throw new Error('index is out of range: ' + index);
        }
    }

    clone() {
        return new this.constructor(this.x, this.y, this.z);
    }

    /**
     * 将vector中相应的值赋值给本vector3
     * @param vector
     */
    copy(vector) {
        this.x = vector.x;
        this.y = vector.y;
        this.z = vector.z;
        return this;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
        return this;
    }

    /**
     * 将本Vector设置为 vector1与vector2的和
     * @param vector1
     * @param vector2
     * @returns {Vector3}
     */
    addVectors(vector1, vector2) {
        this.x = vector1.x + vector2.x;
        this.y = vector1.y + vector2.y;
        this.z = vector1.z + vector2.z;
        return this;
    }

    /**
     * 将本x、y、z的值分别减去vector中x、y、z的值
     * @param vector
     * @returns {Vector3}
     */
    sub(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        this.z -= vector.z;
        return this;
    }

    /**
     * 将本Vector设置为 vector1与vector2的差
     * @param vector1
     * @param vector2
     * @returns {Vector3}
     */
    subVectors(vector1, vector2) {
        this.x = vector1.x - vector2.x;
        this.y = vector1.y - vector2.y;
        this.z = vector1.z - vector2.z;
        return this;
    }

    /**
     * 将本x、y、z的值分别减去scalar值
     * @param scalar
     */
    subScalar(scalar) {
        this.x -= scalar;
        this.y -= scalar;
        this.z -= scalar;
        return this;
    }

    /**
     * 将本x、y、z的值分别与vector对应的x、y、z的值相乘
     * @param vector
     * @returns {Vector3}
     */
    multiply(vector) {
        this.x *= vector.x;
        this.y *= vector.y;
        this.z *= vector.z;
        return this;
    }

    /**
     * 将本x、y、z的值分别与标量值scalar相乘
     * @param scalar
     * @returns {Vector3}
     */
    multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }

    /**
     * 将本x、y、z的值设置为 vector1和vector2对应的x、y、z的值相乘的结果
     * @param vector1
     * @param vector2
     * @returns {Vector3}
     */
    multiplyVectors(vector1, vector2) {
        this.x = vector1.x * vector2.x;
        this.y = vector1.y * vector2.y;
        this.z = vector1.z * vector2.z;
        return this;
    }

    applyEuler() {
    }

    applyAxisAngle() {
    }

    /**
     * 让矩阵matrix3左乘本向量
     * @param matrix3
     */
    applyMatrix3(matrix3) {
        const x = this.x, y = this.y, z = this.z;
        const e = matrix3.elements;
        //推测elements是列优先矩阵
        this.x = e[0] * x + e[3] * y + e[6] * z;
        this.y = e[1] * x + e[4] * y + e[7] * z;
        this.z = e[2] * x + e[5] * y + e[8] * z;
        return this;
    }

    applyMatrix4(matrix4) {
        const x = this.x, y = this.y, z = this.z;
        const e = matrix4.elements;
        //? 为何这么设置w
        const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
        this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
        this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
        this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
        return this;
    }

    applyQuaternion(quaternion) {
    }

    /**
     * 将本向量投影在指定camera中
     * 先转为相机坐标系，再按相机系数进行投影
     * @param camera
     * @returns {*}
     */
    project(camera) {
        //先转为为相机坐标系，然后进行投影
        return this.applyMatrix4(camera.matrixWorldInverse).applyMatrix4(camera.projectionMatrix);
    }

    /**
     * 将身为相机投影坐标的向量，转换为世界坐标系。即反相机投影
     * @param camera
     * @returns {*}
     */
    unProject(camera) {
        //先将本相机投影坐标转为相机坐标系，然后转为世界坐标系
        return this.applyMatrix4(camera.projectionMatrixInverse).applyMatrix4(camera.matrixWorld);
    }

    /**
     * 将向量看作是方向，通过矩阵改变该方向,，并进行归一化
     * @param matrix4
     */
    transformDirection(matrix4) {
        const x = this.x, y = this.y, z = this.z;
        const e = matrix4.elements;
        this.x = e[0] * x + e[4] * y + e[8] * z;
        this.y = e[1] * x + e[5] * y + e[9] * z;
        this.z = e[2] * x + e[6] * y + e[10] * z;
        return this.normalize();
    }

    /**
     * 将本x、y、z的值分别与vector对应的x、y、z的值相除
     * @param vector
     * @returns {Vector3}
     */
    divide(vector) {
        this.x /= vector.x;
        this.y /= vector.y;
        this.z /= vector.z;
        return this;
    }

    /**
     * 将本x、y、z的值分别与除以标量值scalar
     * @param scalar
     * @returns {Vector3}
     */
    divideScalar(scalar) {
        return this.multiplyScalar(1 / scalar);
    }

    /**
     * 将本x、y、z的值分别取与vector对应x、y、z的最小值
     * @param vector
     * @returns {Vector}
     */
    min(vector) {
        this.x = Math.min(this.x, vector.x);
        this.y = Math.min(this.y, vector.y);
        this.z = Math.min(this.z, vector.z);
        return this;
    }

    /**
     * 将本x、y、z的值分别取与vector对应x、y、z的最大值
     * @param vector
     * @returns {Vector}
     */
    max(vector) {
        this.x = Math.max(this.x, vector.x);
        this.y = Math.max(this.y, vector.y);
        this.z = Math.max(this.z, vector.z);
        return this;
    }

    /**
     * 如果很向量的x、y、z值比maxVector3的x、y、z值大，则代替
     * 如果很向量的x、y、z值比minVector3的x、y、z值小，则代替
     * clamp为固定的意思
     * @param minVector3
     * @param maxVector3
     */
    clamp(minVector3, maxVector3) {
        this.x = Math.min(maxVector3.x, Math.max(minVector3.x, this.x));
        this.y = Math.min(maxVector3.y, Math.max(minVector3.y, this.y));
        this.z = Math.min(maxVector3.z, Math.max(minVector3.z, this.z));
        return this;
    }

    /**
     * 如果很向量的x、y、z值比maxVal值大，则替换为maxVal
     * 如果很向量的x、y、z值比minVal值小，则替换为minVal
     * @param minVal
     * @param maxVal
     * @returns {Vector3}
     */
    clampScalar(minVal, maxVal) {
        this.x = Math.max(minVal, Math.min(maxVal, this.x));
        this.y = Math.max(minVal, Math.min(maxVal, this.y));
        this.z = Math.max(minVal, Math.min(maxVal, this.z));
        return this;
    }

    /**
     * 返回长度，该长度不能大于max，不能小于min
     * @param min
     * @param max
     * @returns {Vector3}
     */
    clampLength(min, max) {
        const length = this.length();
        return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)))
    }

    /**
     * 将x、y、z分别去向下的最大整数，即始终降位
     */
    floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        return this;
    }

    /**
     * 将x、y、z分别取向上的最小整数，即始终进位
     * @returns {Vector3}
     */
    ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        return this;
    }

    /**
     * 将x、y、z分别最近整数，即四舍五入
     * @returns {Vector3}
     */
    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        return this;
    }

    /**
     * 将x、y、z分别取反
     * @returns {Vector3}
     */
    negate() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

    /**
     * 计算本向量与vector3的点积，即内积、点乘
     * a.b=|a|*|b|*cos(a,b); 可以表示一个向量在另一个向量上的投影
     * a.b>0，表示方向基本相同，夹角在0-90度之间
     * a.b=0，表示互相垂直
     * a.b<0，表示方向基本相反，夹角在90-180之间
     * @param vector3
     */
    dot(vector3) {
        return this.x * vector3.x + this.y * vector3.y + this.z * vector3.z;
    }

    /**
     * 向量的长度
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     * 长度的平方
     * @returns {number}
     */
    lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    /**
     * 计算向量的曼哈顿长度
     * @returns {number}
     */
    manhattanLength() {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    }

    /**
     * 将向量转为单位矩阵
     */
    normalize() {
        return this.divideScalar(this.length() || 1);
    }

    /**
     *  不改变向量的方向，只改变向量的长度
     * @param length
     * @returns {Vector3}
     */
    setLength(length) {
        return this.normalize().multiplyScalar(length)
    }

    /**
     * 线性插值
     * @param vector3 待插值的
     * @param alpha 插值因子，范围[0,1]
     */
    lerp(vector3, alpha) {
        this.x += (vector3.x - this.x) * alpha;
        this.y += (vector3.y - this.y) * alpha;
        this.z += (vector3.z - this.z) * alpha;
        return this;
    }

    /**
     * 将向量设置为 vec1到vec2的因子为appha线性差值
     * @param vec1 其实插值向量
     * @param vec2 待插值的向量
     * @param alpha 插值因子
     * @returns {*}
     */
    lerpVectors(vec1, vec2, alpha) {
        return this.subVectors(vec2, vec1).multiplyScalar(alpha).add(vec1);
    }

    /**
     * 将本向量设置为 本向量与参数vector3的叉乘，即外积、向量积、叉积
     * 在2维几何上，叉乘表示向量a、b构成的平行四边形的面积
     * 在3d图形学上，叉乘表示生成一个与垂直与a、b的法向量
     * @param vector3
     */
    cross(vector3) {
        return this.crossVectors(this, vector3);
    }

    /**
     * 将本向量设置为vec1和vec2叉乘的结果
     * @param vec1
     * @param vec2
     * @returns {Vector3}
     */
    crossVectors(vec1, vec2) {
        const ax = vec1.x, ay = vec1.y, az = vec1.z;
        const bx = vec2.x, by = vec2.y, bz = vec2.z;
        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;
        return this;
    }

    /**
     * 将本向量投影到另一个向量
     * @param vector
     */
    projectOnVector(vector) {
        const scalar = vector.dot(this) / vector.lengthSq();
        return this.copy(vector).multiplyScalar(scalar);
    }

    /**
     * todo
     * @param planeNormal
     */
    projectOnPlane(planeNormal) {
    }

    /**
     * todo
     * 将入射向量按照法线平面反射出去，
     * 假定法线有单位长度
     * @param normal
     */
    reflect(normal) {
    }

    /**
     * todo:将theta的三元计算提取出去
     * 计算本向量与vector的夹角，单位是弧度
     * @param vector
     * @returns {number}
     */
    angleTo(vector) {
        let theta = this.dot(vector) / (Math.sqrt(this.lengthSq() * v.lengthSq()));
        theta = theta > 1 ? 1 : theta;
        theta = theta < -1 ? -1 : theta;
        return Math.acos(theta);
    }

    /**
     * 计算本向量到目标向量的距离
     * @param vector
     * @returns {number}
     */
    distanceTo(vector) {
        return Math.sqrt(this.distanceToSquared(vector))
    }

    /**
     * 计算本向量到目标向量距离的平方
     * @param vector
     * @returns {number}
     */
    distanceToSquared(vector) {
        const dx = this.x - vector.x, dy = this.y - vector.y, dz = this.z - vector.z;
        return dx * dx + dy * dy + dz * dz;
    }

    /**
     * 计算本向量与目标向量的曼哈顿距离
     * @param vector
     * @returns {number}
     */
    manhattanDistanceTo(vector) {
        return Math.abs(this.x - vector.x) + Math.abs(this.y - vector.y) + Math.abs(this.z - vector.z);
    }

    /**
     * todo 猜测是计算球心到球面上一点的向量
     * @param radius 半径，欧氏距离
     * @param phi 极角
     * @param theta equator angle 赤道角
     */
    setFromSphericalCoords(radius, phi, theta) {
    }

    /**
     * 检测本向量与目标向量是否严格相等
     * @param vector
     * @returns {boolean}
     */
    equals(vector) {
        return (this.x === vector.x && this.y === vector.y && this.z === this.z);
    }

    /**
     * 根据传入的数组和偏移来构造向量
     * @param array
     * @param offset
     * @returns {Vector3}
     */
    fromArray(array = [], offset = 0) {
        this.x = array[offset];
        this.y = array[offset + 1];
        this.z = array[offset + 2];
        return this;
    }

    toArray(array = [], offset = 0) {
        array[offset] = this.x;
        array[offset + 1] = this.y;
        array[offset + 2] = this.z;
    }

    /**
     * todo 了解attribute的构成
     * @param attribute
     * @param index
     * @param offset
     * @returns {Vector3}
     */
    fromBufferAttribute(attribute, index) {
        this.x = attribute.getX(index);
        this.y = attribute.getY(index);
        this.z = attribute.getZ(index);
        return this;
    }
}
