class Object3D{
    constructor(props) {
        super(props);
        this.DefaultUp = new Vector3( 0, 1, 0 );
        this.DefaultMatrixAutoUpdate = true;
        this.name='';
        this.type='';
        this.parent=null;
        this.children=[];
        this.up=this.DefaultUp;
        this.position='';
        this.rotation='';
        this.quaternion='';
        this.scale='';
        this.modelViewMatrix='';
        this.normalMatrix='';

        this.matrix=new Matrix4();
        this.matrixWorld=new Matrix4();
        this.matrixAutoUpdate=this.DefaultMatrixAutoUpdate;
        this.matrixWorldNeedUpdate=false;

        this.layers='';
        this.visible=true;
        this.castShadow=false;
        this.receiveShadow=false;

        this.frustumCulled=true;
        this.renderOrder=0;

    }

    applyMatrix(matrix){
        this.matrix.premultiply( matrix );
    }

    applyQuaternion(q){
        this.quaternion.premultiply( q );
        return this;
    }

    setRotationFromAxisAngle(axis,angle){
        this.quaternion.setFromAxisAngle(axis,angle);
    }

    setRotationFromEuler(euler){
        this.quaternion.setFromEular(euler,true);
    }
    setRotationFromMatrix(matrix){
        this.quaternion.setFromRotationMatrix(matrix);
    }
    setRotationFromQuaternion(q){
        this.quaternion.copy(q);
    }

    /**
     * 沿着自定义的轴旋转angle
     */
    rotateOnAxis(axis, angle){
        const q=new Quaternion();
        q.setFromAxisAngle(axis,angle);
        this.quaternion.multiple(q);
        return this;
    }

    /**
     * 沿着x轴旋转angle
     */
    rotateX(angle){
        const v=new Vector3(1,0,0);
        return this.rotateOnAxis(v,angle);
    }

    /**
     * 沿着y轴旋转angle
     */
    rotateY(angle){
        const v=new Vector3(0,1,0);
        return this.rotateOnAxis(v,angle);
    }

    /**
     * 沿着z轴旋转angle
     */
    rotateZ(angle){
        const v=new Vector3(0,0,1);
        return this.rotateOnAxis(v,angle);
    }

    /**
     * 沿着某轴移动distance的距离
     */
    translateOnAxis(axis, distance){
        const v=new Vector3();
        v.copy(axis).applyQuaternion(this.quaternion);
        this.position.add(v.multipleScalar(distance));
        return this;
    }

    /**
     * 沿x轴移动distance的距离
     */
    translateX(distance){
        const v=new Vector3(1,0,0);
        return this.translateOnAxis(v,distance)
    }

    /**
     * 将向量从本地坐标系转化为世界坐标系
     */
    localToWorld(vector){
        return vector.applyMatrix(this.matrixWorld);
    }

    /**
     * 将向量从世界坐标系转化为本地坐标系
     */
    worldToLocal(vector){
        const m=new Matrix4();
        return vector.applyMatrix(m.getInverse(this.matrixWorld));
    }

    lookAt(x,y,z){
        const q1=new Quaternion();
        const m1=new Matrix4();
        const target=new Vector3();
        const position=new Vector3();
        if(x.isVector3{
            target.copy(x);
        }else{
            target.set(x,y,z);
        }

        const parent=this.parent;
        this.updateWorldMatrix(true,false);
        position.setFromMatrixPosition(this.matrixWorld);
        if(this.isCamera || this.isLight){
            m1.lookAt(position,target,this.up);
        }else{
            m1.lookAt(target,position,this.up);
        }

        this.quaternion.setFromRotationMatrix(m1);
        if(parent){
            m1.extractRotation(parent.matrixWorld);
            q1.setFromRotationMatrix(m1);
            this.quaternion.premultiply(m1.inverse());
        }
    }

    /**
     * 将object作为本对象的子对象添加进来，object的原parent会删除该object
     */
    add(object){
        if(object && object.isObject3D){
            if(object.parent!==null){
                object.parent.remove(object);
            }
            object.parent=this;
            this.children.push(object);
        }   
        return this;
    }

    /**
     * 从本对象的子对象中删除object
     */
    remove(object){
        const index=this.children.indexOf(object);
        if(index!==-1){
            object.parent=null;
            this.children.splice(index,1);
        }
        return this;
    }


    /**
     * 将object作为本对象的一个子对象，同时保持object的世界坐标系
     */
    attach(object){
        const m=new Matrix4();
        this.updateWorldMatrix(true,false);
        m.getInverse(this.matrixWorld);
        if(object.parent!==null){
            object.parent.updateWorldMatrix(true,false);
            m.multiply(object.parent.matrixWorld);
        }
        object.applyMatrix(m);
        object.updateWorldMatrix(false,false);
        this.add(object);
        return this;
    }

    /**
     * 返回一个物体在世界坐标系中的位置
     */
    getWorldPosition(target=new Vector3()){
        this.updateWorldMatrix(true);
        return target.setFromMatrixPosition(this.matrixWorld);
    }

    getWorldQuaternion(target=new Quaternion()){
        const position=new Vector3();
        const scale=new Vector3();
        this.updateWorldMatrix(true);
        this.matrixWorld.decompose(position,target,scale);
        return target;
    }

    getWorldScale(){
        const position=new Vector3();
        const quaternion=new Quaternion();
        this.updateWorldMatrix(true);
        this.matrixWorld.decompose(position,quaternion,target);
        return target;
    }

    getWorldDirection(target=new Vector3()){
        this.updateWorldMatrix(true);
        const e=this.matrixWorld.elements;
        return target.set(e[8],e[9],e[10]).normalize();
    }

    /**
     * 回调该对象的所有子节点
     */
    traverse(callback){
        callback(this);
        this.children.forEach(child=>{child.traverse(callback)});
    }

    /** 
     * 回调所有的可见的子节点
     */
    traverseVisible(callback){
        if (this.visible===false) {return;}
        callback(this);
        this.children.forEach(child=>{child.traverseVisible(callback)});
    }

    /** 
     * 回调所有的父节点
     */
    traverseAncestors(callback){
        const parent=this.parent;
        if(parent!==null){
            callback(parent);
            parent.traverseAncestors(callback);
        }
    }

    /**
     * 抽象方法，用来获取射线和这个对象相交的物体
     * 子类如 Mesh、Line、Points会实现这个方法
     */
    raycaster(raycaster,intersects){

    }

    updateMatrix(){
        this.matrix.compose(this.position,this.quaternion,this.scale);
        this.matrixWorldNeedUpdate=true;
    }

    /**
     * 更新object和所有子节点的全局转换
     */
    updateMatrixWorld(force){
        if(this.matrixAutoUpdate){this.updateMatrix();}

        if(this.matrixWorldNeedUpdate || force){
            if(this.parent===null){
                this.matrixWorld.copy(this.matrix);
            }else{
                this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix);
            }
            this.matrixWorldNeedUpdate=false;
            force=true;
        }
        this.children.forEach(child=>{
            child.updateMatrixWorld(force);
        });
    }

    updateWorldMatrix(updateParents, updateChildren){
        const parent=this.parent;
        if(updateParents===true && parent!==null){
            parent.updateWorldMatrix(true,false);
        }
        if(this.matrixAutoUpdate){
            this.updateMatrix();
        }

        if(this.parent===null){
            this.matrixWorld.copy(this.matrix);
        }else{
            this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)
        }

        if(updateChildren){
            this.children.forEach(child=>{
                child.updateWorldMatrix(false,true);
            });
        }

    }


}
