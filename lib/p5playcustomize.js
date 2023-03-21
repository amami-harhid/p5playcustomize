/**
 * p5.jsの初期化プロセス中に必要なタスクを追加する。
 */
p5.prototype.registerMethod('init', function() {
    // this は p5
    var selfp5 = this;

    const orgSetup = selfp5._setup
    /**
     * p5.js _setup() の後に p5.image() を置換する処理を行う。
     */
    selfp5._setup = function(){
        orgSetup.apply(selfp5);
        selfp5.customizeP5image(); // オリジナル_setup()実行後でないと 動かない！
    }

    /**
     * SVGイメージ読み込みのために、p5.js の loadImageを書き換える
     * オリジナル loadImageのNonGifの処理だけとして
     * p5.Imageへ SVGイメージを保持させる(Image.orgImage)。
     * 
     * @param {String} path 
     * @param {function} successCallback 
     * @param {function} failureCallback 
     * @returns 
     */
    selfp5.loadImage = function(path, successCallback, failureCallback){
        var pImg = selfp5.createImage(1, 1);
        var self = this;
        var req = new Request(path, {
            method: 'GET',
            mode: 'cors'
        });
        fetch(path, req).then(function (response) {
            // Only Non-GIF 
            var img = new Image(); // -> HTML Image Element
            img.onload = function () {
                pImg.width = pImg.canvas.width = img.width;
                pImg.height = pImg.canvas.height = img.height;
                pImg.drawingContext.drawImage(img, 0, 0);
                pImg.modified = true;
                pImg._setProperty('orgImage', img);

                if (typeof successCallback === 'function') {
                    successCallback(pImg);
                }
                self._decrementPreload();
            }
            img.src = path;
        });
        return pImg;
    }

    selfp5.customizeP5image = function(){
        self = this;
        _customizeP5image(self);
    }
});


/**
 * p5.image()を書き換える。
 * このfunctionは、p5._setup() の実行後に呼び出される。
 * _renderer.image を参照できるのは setup()の中からの様子です。
 */
    const _customizeP5image = function(selfp5) {

    /* 元の処理を退避 */
    const oImage = selfp5._renderer.image;
    /**
     * p5の中の_main.default.RendererGL.prototype.image 
     * を書き換える。
     * @param {p5.Image} img 
     * @param {number} sx 
     * @param {number} sy 
     * @param {number} sWidth 
     * @param {number} sHeight 
     * @param {number} dx 
     * @param {number} dy 
     * @param {number} dWidth 
     * @param {number} dHeight 
     */
    selfp5._renderer.image = function(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight){
        //oImage.apply(this,[img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight])
        // オリジナルのimage()を実行せずに下記の処理で書き換える。
        try {
            var cnv = img.orgImage; // loadImage内で読み込んだオリジナルイメージ
            var s = 1;
            if (img.width && img.width > 0) {
                s = cnv.width / img.width;
            }
            if (this._isErasing) {
                this.blendMode(this._cachedBlendMode);
            }
            this.drawingContext.drawImage(cnv, s * sx, s * sy, s * sWidth, s * sHeight, dx, dy, dWidth, dHeight);
            if (this._isErasing) {
                this._pInst.erase(0,0);
            }
        } catch (e) {
            if (e.name !== 'NS_ERROR_NOT_AVAILABLE') {
                throw e;
            }
        }
    }
};






