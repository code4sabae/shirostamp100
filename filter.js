import { CSV } from "https://code4sabae.github.io/js/CSV.js";

window.onload = async () => {
  const csv = await CSV.fetch("100castles.csv");
  const json = CSV.toJSON(csv);

  inputfilter.onchange = inputfilter.onkeyup = () => {
    const key = inputfilter.value;
    let cnt = 0;
    for (const d of json) {
      let flg = false;
      for (const name in d) {
        if (d[name].indexOf(key) >= 0) {
          flg = true;
          break;
        }
      }
      const idname = "data" + d["100castles"];
      console.log(idname);
      const div = document.getElementById(idname);
      if (flg) {
        cnt++;
      }
      div.style.display = flg ? "block" : "none";
    }
    filtered.textContent = `該当事業：${cnt}件`;
  };

  for (let i = 1; i <= 100; i++) {
    const name = "chk" + i;
    const chk = document.getElementById(name);
    chk.chkname = name;
    if (localStorage.getItem(chk.chkname) == "true") {
      chk.checked = true;
    }
    chk.onchange = function() {
      localStorage.setItem(this.chkname, this.checked);
    }
  }};
