# p5playcustomize
p5.js + p5play.js をカスタマイズします。

## バージョン

0.0.1

## SVGファイル描画のなめらか対応

オリジナル p5.loadImage でもSVGファイルを読み込めますが、Bitmap化されてしまうため拡大時にぎざぎざと粗く描画されます。
- HtmlImageの状態を p5.Image内に保持します
- drawImageをするときにp5.ImageではなくHtmlImageより描画します。

## 言い訳

作ったばかりであまり試せていないです。自分だけで使っている状態です。
スプライトを回転させたり拡大・縮小させたり移動させたりアニメーションをさせたりして、なめらかな描画を楽しんでいるだけです。
p5playで作品を作りながら、気づいたところを直してバージョンアップしていきます（気が向いたら）。
おかしなところがあればご連絡ください。(→ amami-thida100@outlook.jp)

## 試したバージョン

- p5.js : v1.6.0 February 22, 2023
- p5play.js : v3.7

## INSTALL方法

```
npm login --scope=amami-harhid --auth-type=legacy --registry=https://npm.pkg.github.com

> username : amami-harhid
> password : {SEC_TOKEN}

```

```
npm i @amami-harhid/p5playcustomize
```

必要な p5, p5.play, planck は一緒にinstallされます。 

## 使い方

```: main.js

import '../node_modules/p5/lib/p5.js'
import '../node_modules/planck/dist/planck.js';
import '../node_modules/p5.play/p5play.js';
import '../node_modules/@amami-harhid/p5playcustomize/lib/p5playcustomize.js'

const s = (p) => {
    let block;
    let floor;
    let blockAni;
    let W, H;
    p.preload = () =>{
        catImage = p.loadImage('assets/cat.svg')
        catImage2 = p.loadImage('assets/cat2.svg')
    }
    p.setup = () =>{
        W = innerWidth;
        H = innerHeight;
        var c = p.createCanvas(W,H)
        p.world.gravity.y = 9.8
        block = new p.Sprite(W/2, 240, catImage.width, catImage.height)
        blockAni = new p.SpriteAnimation(block,catImage,catImage2)
        blockAni.frameDelay = 8
        block.scale = 2;
        floor = new p.Sprite(W*10/2, H, W*10, 25, 'static');
        floor.color = 'red';

    }
    p.draw = () =>{
        p.background(255)
        p.camera.x = block.x
        p.camera.y = block.y
    }
}

const ms = new p5(s);

```
```:index.html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>p5playSVG</title>
  <script src="js/main.js" type="module"></script>
  <style>
    body {
      margin: 0;
      overflow: hidden;
      transform: translate3d(0,0,0);
    }
  </style>
</head>
<body></body>
</html>

```

## セキュリティトークン

セキュリティトークンがないと npm login できません。
参照専用のセキュリティトークンは用意済ですが、さすがに公開できないです。

ご利用されたい方には 個別にお知らせします。
