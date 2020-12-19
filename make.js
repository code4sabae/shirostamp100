import { CSV } from "https://code4sabae.github.io/js/CSV.js";

const csv = CSV.decode(await Deno.readTextFile("100castles.csv"));
const head = csv[0].map((s) => s.replace(/\s/g, ""));
csv[0] = head;
//console.log(head);
//const data = head;
const json = CSV.toJSON(csv);

const data = [
  //"城名",
  "写真URL",
  "イラストURL",
  "都道府県",
  "市区町村",
  "参考HP",
  "入場料（大人）",
  "共通券内観光スポット1",
  "共通券料金1",
  "共通券内観光スポット2",
  "共通券料金2",
  "アイコンURL",
//  "緯度",
//  "経度",
  "100castles",
];

// make htmls

const path = "html";
await Deno.mkdir(path, { recursive: true });

const replaceLink = (s) => {
  s = s.replace(/(http(s)?:\/\/[a-zA-Z0-9-.!'()*;/?:@&=+$,%#_]+)/gi, "<a href='$1' target='_blank'>$1</a>");
  return s;
};

const apname = "shirostamp100";

const getCredit = (num, path) => {
  return `<div class=credit>
  <div>App: <a href=https://fukuno.jig.jp/${num}>福野泰介の一日一創</a> (<a href=https://github.com/code4sabae/c${apname}/>src on GitHub</a>)</div>
  <div>Data: <a href=http://linkdata.org/work/rdf1s6866i>100名城リスト｜オープンデータ共有＆ダウンロード｜LinkData</a> → <a href=${path}/100castles.csv>CSV UTF-8 with image/icon</a></div>
  <div>Illust: <a href=https://www.irasutoya.com/>いらすとや</a></div>
  </div>
</div>`
};

for (const d of json) {
  const divs = [];
  for (let i = 0; i < data.length; i++) {
    const val = d[data[i]];
    if (val) {
      if (val.endsWith(".png") || val.endsWith(".jpg")) {
        divs.push(`<div class=data id=data${i}><h2>${data[i]}</h2><div><img src=${val}><br>${replaceLink(val)}</div></div>`)
      } else {
        divs.push(`<div class=data id=data${i}><h2>${data[i]}</h2><div>${replaceLink(val)}</div></div>`)
      }
    }
  }
  const icon = d["アイコンURL"] || "https://code4sabae.github.io/shirostamp100/icon/oshiro.png";

  const html = `<!DOCTYPE html><html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<meta name="twitter:card" content="summary_large_image"/>
<meta property="og:image"  content="https://code4sabae.github.io/${apname}/${apname}.png">
<meta name="twitter:image" content="https://code4sabae.github.io/${apname}/${apname}.png">
<title>${d["城名"]} - 城スタンプ100</title>
<link rel="stylesheet" type="text/css" href="../${apname}.css">
</head>
<body class="detail">
<h1>${d["城名"]}</h1>
${divs.join("\n")}<br>
<script type="module" src="https://code4sabae.github.io/leaflet-mjs/map-gsi.mjs"></script>
<map-gsi zoom=8>
  <map-gsi-icon ll="${d["緯度"]},${d["経度"]}" name="${d["城名"]}" src="${icon}"></map-gsi-icon>
</map-gsi>
<a href=../index.html>一覧に戻る</a>
<hr>
<div class=credit>
${getCredit(3068, "..")}
</div>
`;
  await Deno.writeTextFile(path + "/" + d["100castles"] + ".html", html);
}

// make index

const toHTML = (d) => {
  return `<div id="data${d["100castles"]}"><a class="list" href="html/${d["100castles"]}.html">
  <h2>${d["100castles"]}. ${d["城名"]}</h2>
  <div>${d["都道府県"]} ${d["市区町村"]}</div>
  <input type="checkbox" id="chk${d["100castles"]}"><label for="chk${d["100castles"]}" class=checkbox02>巡った</label><br>
  </a></div>`;
};

const divs2 = [];
for (const d of json) {
  divs2.push(toHTML(d));
}

const title = "城スタンプ";

const indexhtml =
`<!DOCTYPE html><html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<meta name="twitter:card" content="summary_large_image"/>
<meta property="og:image"  content="https://code4sabae.github.io/${apname}/${apname}.png">
<meta name="twitter:image" content="https://code4sabae.github.io/${apname}/${apname}.png">
<title>${title}</title>
<script type="module" src="filter.js"></script>
<link rel="stylesheet" type="text/css" href="${apname}.css">
<body class="index">

<h1>${title}</h1>
<input id="inputfilter" type=text placeholder="キーワードを入力して絞り込み"><br>
<div id="filtered"></div>

<div id="main">${divs2.join("\n")}</div>
<hr>
${getCredit(3068, "")}
</body>
</html>`;

await Deno.writeTextFile("index.html", indexhtml);
