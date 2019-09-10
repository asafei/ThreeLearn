class Matrix3{
    constructor(elements=[1, 0, 0,0, 1, 0,0, 0, 1]){
        this.elements=elements;//elements是按列向量排布的
        this.isMatrix3=ture;
    }

    /**
     * 设置元素数值，
     * @param n11
     * @param n12
     * @param n13
     * @param n21
     * @param n22
     * @param n23
     * @param n31
     * @param n32
     * @param n33
     * @returns {Matrix3}
     */
    set(n11, n12, n13, n21, n22, n23, n31, n32, n33){
        const elements=this.elements;
        elements[0]=n11;
        elements[1]=n21;
        elements[2]=n31;

        elements[3]=n12;
        elements[4]=n22;
        elements[5]=n32;

        elements[6]=n13;
        elements[7]=n23;
        elements[8]=n33;

        return this;
    }

    /**
     * 重置为单位矩阵
     */
    identity(){
        this.set(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        );
        return this;
    }

    /**
     * 克隆一个相同数据矩阵
     * @returns {*}
     */
    clone(){
        return this.constructor().fromArray(this.elements);
    }

    /**
     * 将matrix中的元素复制到本矩阵中
     * @param matrix
     * @returns {Matrix3}
     */
    copy(matrix){
        for(let i=0,len=this.elements.length;i<len;i++){
            this.elements[i]=matrix.elements[i];
        }
        return this;
    }

    /**
     * 将本矩阵设置成matrix的左上角3*3
     * @param matrix
     * @returns {Matrix3}
     */
    setFromMatrix4(matrix){
        const elements=this.elements;
        this.set(
            elements[0],elements[4],elements[8],
            elements[1],elements[5],elements[9],
            elements[2],elements[6],elements[10]
        );
        return this;
    }

    /**
     * todo , 引入Vector3，并且直销如何定义attribute
     * @param attribute
     */
    applyToBufferAttribute(attribute){
        const v=new Vector3();
        for(let i=0,len=attribute.count;i<i;i++){
            v.x=attribute.getX(i);
            v.y=attribute.getY(i);
            v.z=attribute.getZ(i);
            v.applyMatrix3(this);
            attribute.setXYZ(i,v.x,v.y,v.z);
        }
    }

    /**
     * 用matrix来乘以本矩阵
     * @param matrix
     */
    multiply(matrix){
        return this.multiplyMatrices(matrix,this);
    }

    /**
     * 将本矩阵设置成m1和m2的乘积
     * @param m1
     * @param m2
     * @returns {Matrix3}
     */
    multiplyMatrices(m1,m2){
        const ae=m1.elements,be=m2.elements;
        const a11=ae[0],a12=ae[3],a13=ae[6],a21=ae[1],a22=ae[4],a23=ae[7],a31=ae[2],a32=ae[5],a33=ae[8];
        const b11=be[0],b12=be[3],b13=be[6],b21=be[1],b22=be[4],b23=be[7],b31=be[2],b32=be[5],b33=be[8];

        this.elements[0]=a11*b11+a12*b12+a13*b13;
        this.elements[1]=a21*b11+a22*b21+a23*b13;
        this.elements[2]=a31*b11+a32*b21+a33*b13;
        this.elements[3]=a11*b12+a12*b22+a13*b32;
        this.elements[4]=a21*b12+a22*b22+a23*b32;
        this.elements[5]=a31*b12+a32*b22+a33*b32;
        this.elements[6]=a11*b13+a12*b23+a13*b33;
        this.elements[7]=a21*b13+a22*b23+a23*b33;
        this.elements[8]=a31*b13+a32*b23+a33*b33;
        return this;
    }

    /**
     * 将本矩阵设置成 用matrix乘以本矩阵的乘积
     * @param matrix
     */
    premultiply(matrix){
        this.multiplyMatrices(matrix,this);
    }

    /**
     * 将矩阵中的每个元素都乘以标量值scalar
     * @param scalar
     */
    multiplyScalar(scalar){
        for(let i=0,len=this.elements.length;i<len;i++){
            this.elements[i] *=scalar;
        }
        return this;
    }

    /**
     * 返回该矩阵的行列式的计算值
     */
    determinant(){
        const ae=this.elements;
        const a11=ae[0],a12=ae[3],a13=ae[6],a21=ae[1],a22=ae[4],a23=ae[7],a31=ae[2],a32=ae[5],a33=ae[8];
        return a11*a22*a33-a11*a32*a23-a21*a12*a33+a21*a32*a13+a31*a12*a23-a31*a22*a13;
    }

    /**
     * 将该矩阵设置成matrix的逆矩阵
     * A的逆矩阵=A的伴随矩阵的转置矩阵/A的行列式
     * @param matrix
     */
    getInverse(matrix){
        const me=matrix.elements;
        const m11=me[0],m12=me[3],m13=me[6],
              m21=me[1],m22=me[4],m23=me[7],
              m31=me[2],m32=me[5],m33=me[8];
        //求代数余子式
        const t11=m22*m33-m23*32,
              t12=-(m21*m33-m31*m23),
              t13=m21*m32-m31*m22,
            det=m11*t11+m12*t12+m13*t13;

        if(det===0){
            //todo,如何处理容错机制，报错还是忽略
            throw new Error("矩阵的秩为0，没有逆矩阵");
        }

        const detInv=1/det;
        //根据公式计算逆矩阵
        this.elements[0]=t11*detInv;
        this.elements[1]=t12*detInv;
        this.elements[2]=t13*detInv;

        this.elements[3]=(m13*m32-m12*m33)*detInv;
        this.elements[4]=(m13*m31-m11*m33)*detInv;
        this.elements[5]=(m31*m12-m11*m32)*detInv;

        this.elements[6]=(m12*m23-m22*m13)*detInv;
        this.elements[7]=(m11*m23-m21*m13)*detInv;
        this.elements[8]=(m11*m22-m21*m12)*detInv;
        return this;
    }

    /**
     * 将该矩阵进行转置
     */
    transpose(){
        let temp;
        temp=this.elements[1];this.elements[1]=this.elements[3];this.elements[3]=temp;
        temp=this.elements[2];this.elements[2]=this.elements[6];this.elements[6]=temp;
        temp=this.elements[5];this.elements[5]=this.elements[7];this.elements[7]=temp;
        return this;
    }

    /**
     * 将那本矩阵设置为正矩阵matrix的upper3*3的正矩阵。
     * normalMatrix表示矩阵的逆矩阵并转置
     * @param matrix
     */
    getNormalMatrix(matrix){
        return this.setFromMatrix4(matrix).getInverse(this).transpose();
    }

    /**
     * todo
     * @param tx offset x
     * @param ty offset y
     * @param sx repeat x
     * @param sy repeat y
     * @param rotation 旋转弧度
     * @param cx 旋转中心 x
     * @param cy 旋转中心 y
     */
    setUvTransform(tx, ty, sx, sy, rotation, cx, cy){

    }

    /**
     * todo
     * @param sx
     * @param xy
     */
    scale(sx,xy){
    }

    rotate(theta){

    }

    translate(tx,ty){

    }

    /**
     * 判断是否和matrix相等
     * @param matrix
     * @returns {boolean}
     */
    equals(matrix){
        const te=this.elements;
        const me=matrix.elements;
        for(let i=0,len=te.length;i<len;i++){
            if(me[i]!==te[i]){
                return false;
            }
        }
        return true;
    }

    /**
     * 从数组array的offset偏移处开始取值，创建矩阵
     * 遵循列有限原则
     * @param array
     * @param offset
     * @returns {Matrix3}
     */
    fromArray(array=[],offset=0){
        for(let i=0;i<9;i++){
            this.elements[i]=array[offset+i];
        }
        return this;
    }

    /**
     * 将本矩阵中的元素写入到数组并返回
     * 遵循列有限原则
     * @param array
     * @param offset
     * @returns {Array}
     */
    toArray(array=[],offset=0){
        const te=this.elements;
        for(let i=0,len=te.length;i<len;i++){
            array[offset+i]=te[i];
        }
        return array;
    }
}
